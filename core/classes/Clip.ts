import * as https from 'https';
import { IncomingMessage } from 'http';
import * as cliProgress from 'cli-progress';
import * as fs from 'fs';
import * as ffmpeg from 'fluent-ffmpeg';
import * as colors from 'colors';


import axios from '../config/axios';
import { ClipData, IAutomaticCompilationConfig, ICompilationConfig, IManualCompilationConfig, IResolution } from '../types';
import { isAutomatic, getSlug } from '../helpers';



export class Clip {
	public data: ClipData;
	private rawPath!: string;
	private editedPath!: string;
	public fileName: string;

	constructor(data: ClipData, fileName: string) {
		this.data = data;
		this.fileName = fileName;
	}

	static async queryClipsData(compilationConfig: ICompilationConfig): Promise<Array<ClipData>> {
		let clips: Array<ClipData> = [];
		if (isAutomatic(compilationConfig)) {
			const { channelName, period, trending, language, game, clipCount } = compilationConfig as IAutomaticCompilationConfig;
			if (game && game.length && channelName && channelName.length) {
				console.log('Both channel and game are specified, game is ignored.'.red);
			}
			let apiUrl = `https://api.twitch.tv/kraken/clips/top?period=${period}&limit=${clipCount}`;
			apiUrl += trending ? `&trending=${trending}` : '';
			apiUrl += language && language.length > 0 ? `&language=${language}` : '';
			apiUrl += channelName && channelName.length > 0 ? `&channel=${channelName}` : '';
			apiUrl += game && game.length > 0 ? `&game=${game}` : '';


			const queryResult = await axios.get(apiUrl, {});
			clips = queryResult.data.clips;
		} else {
			const { clipsList } = compilationConfig as IManualCompilationConfig;
			const slugList: Array<string> = clipsList.map(url => getSlug(url));
			for (let i = 0; i < slugList.length; i++) {
				let apiUrl = `https://api.twitch.tv/kraken/clips/${slugList[i]}`;
				const queryResult = await axios.get(apiUrl, {});
				clips.push(queryResult.data);
			}
		}
		return clips;
	}

	static async queryClips(compilationConfig: ICompilationConfig): Promise<Array<Clip>> {
		const clipDatas: Array<ClipData> = await Clip.queryClipsData(compilationConfig);
		const clips: Array<Clip> = [];
		for (let i = 0; i < clipDatas.length; i++) clips.push(new Clip(clipDatas[i], i.toString()));
		return clips;
	}

	download(path: string): Promise<string> {
		const thumbUrl = this.data.thumbnails.medium;
		const dlUrl = thumbUrl.substring(0, thumbUrl.indexOf('-preview')) + '.mp4';

		this.rawPath = path;
		const file: fs.WriteStream = fs.createWriteStream(this.rawPath);
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
	rename(newPath: string) {
		fs.rename(this.rawPath, newPath, function (err) {
			if (err) console.log('ERROR: ' + err);
		});
		this.rawPath = newPath;
	}
	getResolution(): Promise<IResolution> {
		return new Promise<IResolution>((resolve) => {
			ffmpeg.ffprobe(this.rawPath, (err: Error, metadata: any) => {
				if (err) {
					console.error(err);
				} else {
					const stream = metadata.streams[0];
					resolve({ width: stream.width, height: stream.height });
				}
			});
		});
	}

	setResolution(newPath: string, wantedResolution: IResolution): Promise<string> {
		this.rawPath = newPath;
		return new Promise((resolve) => {
			ffmpeg(this.rawPath)
				.videoFilters([
					{
						filter: 'scale',
						options: `${wantedResolution.width}:${wantedResolution.height}`,
					},
				])
				.on('end', () => {
					try {
						this.rawPath = newPath;
						fs.unlinkSync(this.rawPath)
					} catch (err) {
						console.error(err)
					}
					resolve('Resolution changed.');
				})
				.save(newPath);
		});
	}


	async hasDefaultResolution(wantedResolution: IResolution): Promise<boolean> {
		const resolution = await this.getResolution();
		return !(resolution.width != wantedResolution.width || resolution.height != wantedResolution.height);
	}

	editVideo(editedPath: string): Promise<string> {
		this.editedPath = editedPath;
		const opt = {
			format: '[{bar}] {percentage}% | ETA: {eta}s'.cyan,
		};
		const progressBar = new cliProgress.SingleBar(opt, cliProgress.Presets.shades_classic);

		return new Promise((resolve) => {
			ffmpeg(this.rawPath)
				.on('error', (err: Error, stdout, stderr) => {
					console.log('an error happened: ' + err.message);
					console.log("stdout:\n" + stdout);
					console.log("stderr:\n" + stderr); //this will contain more detailed debugging info

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
							text: `${this.data.title}`,
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
							text: `${this.data.broadcaster.display_name}`,
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
				.save(this.editedPath);
		});
	}




}

