import * as cliProgress from 'cli-progress';
import ffmpeg from '../constants/ffmpeg';
import * as path from 'path';
import { ICompilationConfig, IAutomaticCompilationConfig, IManualCompilationConfig } from '../types';
import * as fs from 'fs';
import { DEFAULT_RESOLUTION, Folders, UNVERIFIED_RESOLUTION_PREFIX } from '../constants';
import * as rimraf from 'rimraf'
import axios from '../config/axios';
import { Clip } from './Clip';


export class CompilationController {
    private compilationConfig: ICompilationConfig;
    constructor(config: ICompilationConfig) {
        this.compilationConfig = config;

    }
    async runCompilation() {
        const clips: Array<Clip> = await Clip.queryClips(this.compilationConfig);
        for (let i = 0; i < clips.length; i++) {
            const filename = `${i}`;
            const path = `${Folders.raw}/${UNVERIFIED_RESOLUTION_PREFIX}${filename}.mp4`;
            const newPath = `${Folders.raw}/${filename}.mp4`;
            const editedPath = `${Folders.edited}/${filename}.mp4`;
            const dataPath = `${Folders.data}/${filename}.json`;

            const clip = clips[i];
            clip.data.title = this.clean(clip.data.title);
            console.log(`\n Clip ${i + 1} -------------`);
            console.log(`\t Channel :  ${clip.data.broadcaster.display_name}`);
            console.log(`\t Title :  ${clip.data.title}`);
            console.log(`\t Game: ${clip.data.game}`);
            console.log(`\t Views: ${clip.data.views}`);

            //console.log(clip);
            const downloadMsg = await clip.download(path);
            console.log(downloadMsg.green);

            const resolutionIsOk: boolean = await clip.hasDefaultResolution(DEFAULT_RESOLUTION);
            if (!resolutionIsOk) {
                console.log(`Different resolution detected, scaling it to ${DEFAULT_RESOLUTION.width}:${DEFAULT_RESOLUTION.height}..`.cyan);
                await clip.setResolution(newPath, DEFAULT_RESOLUTION);
            } else {
                clip.rename(newPath);
            }


            if (this.compilationConfig.editing) {
                const editMsg = await clip.editVideo(editedPath);
                console.log(editMsg.green);
            }
            if (this.compilationConfig.log) {
                fs.writeFileSync(dataPath, JSON.stringify(clip));
            }
        }


        const folderToMerge = this.compilationConfig.editing ? Folders.edited : Folders.raw;
        const mergedMsg = await this.mergeClips(folderToMerge);
        console.log(mergedMsg.green);
    }


    run() {
        this.resetFolders();
        this.runCompilation();
    }
    clean(str: string): string {
        return str.replace(/[^0-9a-z-A-Z ]/g, '').replace(/ +/, ' ');
    }

    resetFolders(): void {
        for (const [key, value] of Object.entries(Folders)) {
            if (fs.existsSync(value)) {
                rimraf.sync(value);
            }
            fs.mkdirSync(value);
        }
    }

    mergeClips(folderToMerge: string): Promise<string> {
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
                .on('start', (cmdline: string) => {
                    console.log(cmdline);
                    progressBar.start(100, 0);
                })


            const directoryPath = folderToMerge; // path.join(__dirname, folderToMerge);
            console.log('\nMerge started.'.cyan);
            fs.readdir(directoryPath, (err, files: string[]) => {
                if (err) {
                    return console.log('Unable to scan directory: ' + err);
                }

                // Intro
                //if (this.compilationConfig.introPath && this.compilationConfig.introPath.length > 0) proc.input(this.compilationConfig.introPath);

                // Clips
                files = files.sort((first, second) => first.localeCompare(second))
                for (let i = 0; i < files.length; i++) {
                    proc.input(`${folderToMerge}/${files[i]}`);

                }
                // Outro
                //if (this.compilationConfig.outroPath && this.compilationConfig.outroPath.length > 0) proc.input(this.compilationConfig.outroPath);

                proc.inputOption('-vsync 2');
                proc.mergeToFile(`${Folders.merged}/merged.mp4`);
            });
        });


    }




}