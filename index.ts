import { client_id, compilationConfig } from './config';
import axios from 'axios';
import * as path from 'path';
import * as https from 'https';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import { IncomingMessage } from 'http';
import { resolve } from 'path';
import * as cliProgress from 'cli-progress';
import * as colors from 'colors';

if (client_id.length === 0) throw new Error('Empty client_id, please modify it in config.js!');

enum Folder {
	merged = 'merged_video',
	edited = 'edited_videos',
	raw = 'raw_videos',
}

interface ICompilationConfig {
	channelName:  string;
	clipCount: string;
	period: string;
	trending: boolean;
	language: string;
	editing: boolean;
}

axios.defaults.headers.common['Client-ID'] = client_id;
axios.defaults.headers.common['Accept'] = 'application/vnd.twitchtv.v5+json';

function resetFolders(): void {
	for (const [key, value] of Object.entries(Folder)) {
		if (fs.existsSync(value)) {
			fs.rmdirSync(value, { recursive: true });
		}
		fs.mkdirSync(value);
	}
}

function downloadClip(path: string, dlUrl: string): Promise<string> {
	const file: fs.WriteStream = fs.createWriteStream(path);

	return new Promise((resolve) => {
		https.get(dlUrl, (response: IncomingMessage) => {
			response.pipe(file);
			const contentLength: number = parseInt(response.headers['content-length'] as string);
			console.log('Clip download progress '.cyan);
			const opt = {
				format: '[{bar}] {percentage}% | ETA: {eta}s | {value}/{total} bytes'.cyan,
			};
			const progressBar = new cliProgress.SingleBar(opt, cliProgress.Presets.shades_classic);
			progressBar.start(contentLength, 0);
			let logTimer = setInterval(() => {
				progressBar.update(file.bytesWritten);
			}, 1000);
			file.on('finish', () => {
				progressBar.update(contentLength);
				clearInterval(logTimer);
				progressBar.stop();
				resolve('Clip downloaded.');
			});
		});
	});
}

function editVideo(originalPath: string, filename: string, clipData): Promise<string> {
	console.log('Clip edit progress '.cyan);
	const opt = {
		format: '[{bar}] {percentage}% | ETA: {eta}s | {value}% '.cyan,
	};
	const progressBar = new cliProgress.SingleBar(opt, cliProgress.Presets.shades_classic);
	progressBar.start(100, 0);

	return new Promise((resolve) => {
		ffmpeg(originalPath)
			.on('error', (err) => {
				console.log('an error happened: ' + err.message);
			})
			.on('progress', (info) => {
				progressBar.update(Number(info.percent.toFixed(2)));
			})
			.on('end', () => {
				progressBar.update(100);
				progressBar.stop();
				resolve('Edition finished');
			})

			.videoFilters([
				{
					filter: 'drawtext',
					options: {
						text: `${clipData.title}`,
						fontcolor: 'white',
						fontsize: 45,
						x: '(main_w/2-text_w/2)',
						y: '(main_h-text_h*2)',
						shadowcolor: 'black',
						box: '1',
						boxcolor: 'black@0.7',
						boxborderw: 10,
						shadowx: 0,
						shadowy: 0,
					},
				},
				{
					filter: 'drawtext',
					options: {
						text: `${clipData.broadcaster.display_name}`,
						fontcolor: 'white',
						fontsize: 40,
						x: '(main_w-text_w-10)',
						y: '(10)',
						shadowcolor: 'black',
						box: '1',
						boxcolor: 'black@0.7',
						boxborderw: 10,
						shadowx: 0,
						shadowy: 0,
					},
				},
			])
			.save(`${Folder.edited}/${filename}.mp4`);
	});
}
function mergeVideos(): Promise<string> {
	return new Promise((resolve) => {
		const proc = ffmpeg().on('end', () => {
			resolve('Merge finished.');
		});
		const directoryPath = path.join(__dirname, Folder.edited);
		console.log('Merge started.'.cyan);
		fs.readdir(directoryPath, (err, files: string[]) => {
			if (err) {
				return console.log('Unable to scan directory: ' + err);
			}
			files.forEach((file: string) => {
				proc.input(`${Folder.edited}/${file}`);
			});
			proc.mergeToFile(`${Folder.merged}/merged.mp4`);
		});
	});
}

async function run(): Promise<any> {
	resetFolders();

	const channel = compilationConfig.channelName;
	const clipCount = compilationConfig.clipCount;
	const period = compilationConfig.period;
	const trending = compilationConfig.trending;
	const language = compilationConfig.language;
	let apiUrl = `https://api.twitch.tv/kraken/clips/top?channel=${channel}&period=${period}&trending=${trending}&limit=${clipCount}`;
	apiUrl += language.length > 0 ? `&language=${language}` : '';
	axios
		.get(apiUrl, {})
		.then(async (res) => {
			const clips = res.data.clips;
			console.log('GET request finished.'.green);

			for (let i = 0; i < clips.length; i++) {
				const filename = `${i}`;
				const path = `${Folder.raw}/${filename}.mp4`;
				const clip = clips[i];
				//				console.log(clip);
				const thumbUrl = clip.thumbnails.medium;
				const dlUrl = thumbUrl.substring(0, thumbUrl.indexOf('-preview')) + '.mp4';
				console.log(`Clip ${i}`);
				console.log(`\t Channel :  ${clip.broadcaster.display_name}`);
				console.log(`\t Title :  ${clip.title}`);
				console.log(`\t Game: ${clip.game}`);
				console.log(`\t Views: ${clip.views}`);

				//console.log(clip);
				const downloadMsg = await downloadClip(path, dlUrl);
				console.log(downloadMsg.green);

				const editMsg = await editVideo(path, filename, clip);
				console.log(editMsg.green);

				console.log(`Downloaded and edited. ${i} \n \n`.green);
			}
			const mergedMsg = await mergeVideos();
			console.log(mergedMsg.green);
		})
		.catch((error) => {
			console.error(error);
		})
		.finally(() => {
			resolve('End.');
		});
}

run().then((endMsg) => console.log(endMsg));

export { ICompilationConfig };
