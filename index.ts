import { client_id, compilationConfig } from './config';
import axios from 'axios';
import * as path from 'path';
import * as https from 'https';
import * as ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import { IncomingMessage } from 'http';
import * as cliProgress from 'cli-progress';
import * as colors from 'colors';

if (client_id.length === 0) throw new Error('Empty client_id, please modify it in config.ts!'.green);

enum Folder {
	merged = 'merged_video',
	edited = 'edited_videos',
	raw = 'raw_videos',
	data = 'data_videos',
}
const UNVERIFIED_RESOLUTION_PREFIX: string = '_';

export const enum PopularGames {
	CSGO = 'Counter-Strike: Global Offensive',
	JustChatting = 'Just Chatting',
	GTA5 = 'Grand Theft Auto V',
	LOL = 'League of Legends',
	WOW = 'World of Warcraft',
}
export interface ICompilationConfig {
	channelName: string;
	clipCount: number;
	period: string;
	trending: boolean;
	language: string;
	editing: boolean;
	game: string;
	log: boolean;
}

axios.defaults.headers.common['Client-ID'] = client_id;
axios.defaults.headers.common['Accept'] = 'application/vnd.twitchtv.v5+json';

function clean(str: string): string {
	return str.replace(/[^0-9a-z-A-Z ]/g, '').replace(/ +/, ' ');
}

function resetFolders(): void {
	for (const [key, value] of Object.entries(Folder)) {
		if (fs.existsSync(value)) {
			fs.rmdirSync(value, { recursive: true });
		}
		fs.mkdirSync(value);
	}
}
interface IResolution {
	width: number;
	height: number;
}

const DEFAULT_RESOLUTION: IResolution = { width: 1920, height: 1080 };
function getResolution(path: string): Promise<IResolution> {
	return new Promise<IResolution>((resolve) => {
		ffmpeg.ffprobe(path, (err: Error, metadata: any) => {
			if (err) {
				console.error(err);
			} else {
				const stream = metadata.streams[0];
				resolve({ width: stream.width, height: stream.height });
			}
		});
	});
}

async function hasDefaultResolution(path: string, wantedResolution: IResolution): Promise<boolean> {
	const resolution = await getResolution(path);
	return !(resolution.width != wantedResolution.width || resolution.height != wantedResolution.height);
}

function setResolution(path: string, newPath: string, wantedResolution: IResolution): Promise<string> {
	return new Promise((resolve) => {
		ffmpeg(path)
			.videoFilters([
				{
					filter: 'scale',
					options: `${wantedResolution.width}:${wantedResolution.height}`,
				},
			])
			.on('end', () => {
				try { 
					fs.unlinkSync(path)
				} catch (err) {
					console.error(err)
				}
				resolve('Resolution changed.');
			})
			.save(newPath);
	});
}

function downloadClip(path: string, dlUrl: string): Promise<string> {
	const file: fs.WriteStream = fs.createWriteStream(path);

	return new Promise((resolve) => {
		https.get(dlUrl, (response: IncomingMessage) => {
			const contentLength: number = parseInt(response.headers['content-length'] as string);
			const opt = {
				format: '[{bar}] {percentage}% | ETA: {eta}s | {value}/{total} bytes'.cyan,
			};
			const progressBar = new cliProgress.SingleBar(opt, cliProgress.Presets.shades_classic);
			console.log('\nClip download progress '.cyan);
			progressBar.start(contentLength, 0);
			const logTimer = setInterval(() => {
				progressBar.update(file.bytesWritten);
			}, 1000);
			response.pipe(file);
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
	const opt = {
		format: '[{bar}] {percentage}% | ETA: {eta}s'.cyan,
	};
	const progressBar = new cliProgress.SingleBar(opt, cliProgress.Presets.shades_classic);

	return new Promise((resolve) => {
		ffmpeg(originalPath)
			.on('error', (err: Error) => {
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
			.on('start', () => {
				//console.log(cmdline);
				console.log('\nClip edit progress '.cyan);
				progressBar.start(100, 0);
			})
			.videoFilters([
				{
					filter: 'scale',
					options: '1920:1080',
				},
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
function mergeVideos(folderToMerge: string): Promise<string> {
	const opt = {
		format: '[{bar}] {percentage}% | ETA: {eta}s '.cyan,
	};
	const progressBar = new cliProgress.SingleBar(opt, cliProgress.Presets.shades_classic);

	return new Promise((resolve) => {
		const proc = ffmpeg()
			.on('end', () => {
				progressBar.update(100);
				progressBar.stop();
				resolve('Merge finished.');
			})
			.on('progress', (info) => {
				progressBar.update(Number(info.percent.toFixed(2)));
			})
			.on('start', (cmdline) => {
				console.log(cmdline);
				progressBar.start(100, 0);
			}) 


		const directoryPath = path.join(__dirname, folderToMerge);
		console.log('\nMerge started.'.cyan);
		fs.readdir(directoryPath, (err, files: string[]) => {
			if (err) {
				return console.log('Unable to scan directory: ' + err);
			}
			files.forEach((file: string) => {
				proc.input(`${folderToMerge}/${file}`);
			});
			proc.inputOption('-vsync 2');
			proc.mergeToFile(`${Folder.merged}/merged.mp4`);
		});
	});
}

async function run(): Promise<any> {
	resetFolders();

	const channel = compilationConfig.channelName;
	const clipCount: string = compilationConfig.clipCount.toString();
	const period = compilationConfig.period;
	const trending = compilationConfig.trending;
	const language = compilationConfig.language;
	const editing = compilationConfig.editing;
	const game = compilationConfig.game;
	const log = compilationConfig.log;

	let apiUrl = `https://api.twitch.tv/kraken/clips/top?period=${period}&trending=${trending}&limit=${clipCount}`;
	apiUrl += language.length > 0 ? `&language=${language}` : '';
	apiUrl += channel.length > 0 ? `&channel=${channel}` : '';
	apiUrl += game.length > 0 ? `&game=${game}` : '';

	console.log(apiUrl);
	console.log(compilationConfig);

	if (game.length && channel.length) {
		console.log('Both channel and game are specified, game is ignored.'.red);
	}
	axios
		.get(apiUrl, {})
		.then(async (res) => {
			const clips = res.data.clips;
			console.log('\n GET request finished.'.green);

			for (let i = 0; i < clips.length; i++) {
				const filename = `${i}`;
				const path = `${Folder.raw}/${UNVERIFIED_RESOLUTION_PREFIX}${filename}.mp4`;
				const newPath = `${Folder.raw}/${filename}.mp4`;
				const clip = clips[i];
				clip.title = clean(clip.title);

				const thumbUrl = clip.thumbnails.medium;
				const dlUrl = thumbUrl.substring(0, thumbUrl.indexOf('-preview')) + '.mp4';
				console.log(`\n Clip ${i} -------------`);
				console.log(`\t Channel :  ${clip.broadcaster.display_name}`);
				console.log(`\t Title :  ${clip.title}`);
				console.log(`\t Game: ${clip.game}`);
				console.log(`\t Views: ${clip.views}`);

				//console.log(clip);
				const downloadMsg = await downloadClip(path, dlUrl);
				console.log(downloadMsg.green);

				const resolutionIsOk: boolean = await hasDefaultResolution(path, DEFAULT_RESOLUTION);
				if (!resolutionIsOk) {
					console.log(`Different resolution detected, scaling it to ${DEFAULT_RESOLUTION.width}:${DEFAULT_RESOLUTION.height}..`.cyan);
					await setResolution(path, newPath, DEFAULT_RESOLUTION);
				} else {
					fs.rename(path, newPath, function (err) {
						if (err) console.log('ERROR: ' + err);
					});
				}

				if (editing) {
					const editMsg = await editVideo(newPath, filename, clip);
					console.log(editMsg.green);
				}
				if (log) {
					fs.writeFileSync(`${Folder.data}/${filename}.json`, JSON.stringify(clip));
				}
			}
			const folderToMerge = editing ? Folder.edited : Folder.raw;
			const mergedMsg = await mergeVideos(folderToMerge);
			console.log(mergedMsg.green);
		})
		.catch((error) => {
			console.error(error);
		});
}

run();
