"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const https = __importStar(require("https"));
const ffmpeg = __importStar(require("fluent-ffmpeg"));
const fs = __importStar(require("fs"));
const cliProgress = __importStar(require("cli-progress"));
const constants_1 = require("./constants");
const queryClips_1 = require("./queryClips");
const config_1 = require("../config");
function clean(str) {
    return str.replace(/[^0-9a-z-A-Z ]/g, '').replace(/ +/, ' ');
}
function resetFolders() {
    for (const [key, value] of Object.entries(constants_1.Folder)) {
        if (fs.existsSync(value)) {
            fs.rmdirSync(value, { recursive: true });
        }
        fs.mkdirSync(value);
    }
}
function getResolution(path) {
    return new Promise((resolve) => {
        ffmpeg.ffprobe(path, (err, metadata) => {
            if (err) {
                console.error(err);
            }
            else {
                const stream = metadata.streams[0];
                resolve({ width: stream.width, height: stream.height });
            }
        });
    });
}
function hasDefaultResolution(path, wantedResolution) {
    return __awaiter(this, void 0, void 0, function* () {
        const resolution = yield getResolution(path);
        return !(resolution.width != wantedResolution.width || resolution.height != wantedResolution.height);
    });
}
function setResolution(path, newPath, wantedResolution) {
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
                fs.unlinkSync(path);
            }
            catch (err) {
                console.error(err);
            }
            resolve('Resolution changed.');
        })
            .save(newPath);
    });
}
function downloadClip(path, dlUrl) {
    const file = fs.createWriteStream(path);
    return new Promise((resolve) => {
        https.get(dlUrl, (response) => {
            const contentLength = parseInt(response.headers['content-length']);
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
function editVideo(originalPath, filename, clipData) {
    const opt = {
        format: '[{bar}] {percentage}% | ETA: {eta}s'.cyan,
    };
    const progressBar = new cliProgress.SingleBar(opt, cliProgress.Presets.shades_classic);
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
            .save(`${constants_1.Folder.edited}/${filename}.mp4`);
    });
}
function mergeVideos(folderToMerge) {
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
        });
        const directoryPath = path.join(__dirname, folderToMerge);
        console.log('\nMerge started.'.cyan);
        fs.readdir(directoryPath, (err, files) => {
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            }
            // Intro
            //if (compilationConfig.introPath.length > 0) proc.input(compilationConfig.introPath);
            // Clips
            files = files.sort((first, second) => first.localeCompare(second));
            console.log(files);
            for (let i = 0; i < files.length; i++) {
                proc.input(`${folderToMerge}/${files[i]}`);
            }
            // Outro
            //if (compilationConfig.introPath.length > 0) proc.input(compilationConfig.outroPath);
            proc.inputOption('-vsync 2');
            proc.mergeToFile(`${constants_1.Folder.merged}/merged.mp4`);
        });
    });
}
function run(compilationConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        resetFolders();
        const clips = yield queryClips_1.queryClips(compilationConfig);
        console.log(`${clips.length} clips detected`);
        const editing = compilationConfig.editing;
        const log = compilationConfig.log;
        for (let i = 0; i < clips.length; i++) {
            const filename = `${i}`;
            const path = `${constants_1.Folder.raw}/${constants_1.UNVERIFIED_RESOLUTION_PREFIX}${filename}.mp4`;
            const newPath = `${constants_1.Folder.raw}/${filename}.mp4`;
            const clip = clips[i];
            clip.title = clean(clip.title);
            const thumbUrl = clip.thumbnails.medium;
            const dlUrl = thumbUrl.substring(0, thumbUrl.indexOf('-preview')) + '.mp4';
            console.log(`\n Clip ${i + 1} -------------`);
            console.log(`\t Channel :  ${clip.broadcaster.display_name}`);
            console.log(`\t Title :  ${clip.title}`);
            console.log(`\t Game: ${clip.game}`);
            console.log(`\t Views: ${clip.views}`);
            //console.log(clip);
            const downloadMsg = yield downloadClip(path, dlUrl);
            console.log(downloadMsg.green);
            const resolutionIsOk = yield hasDefaultResolution(path, constants_1.DEFAULT_RESOLUTION);
            if (!resolutionIsOk) {
                console.log(`Different resolution detected, scaling it to ${constants_1.DEFAULT_RESOLUTION.width}:${constants_1.DEFAULT_RESOLUTION.height}..`.cyan);
                yield setResolution(path, newPath, constants_1.DEFAULT_RESOLUTION);
            }
            else {
                fs.rename(path, newPath, function (err) {
                    if (err)
                        console.log('ERROR: ' + err);
                });
            }
            if (editing) {
                const editMsg = yield editVideo(newPath, filename, clip);
                console.log(editMsg.green);
            }
            if (log) {
                fs.writeFileSync(`${constants_1.Folder.data}/${filename}.json`, JSON.stringify(clip));
            }
        }
        const folderToMerge = editing ? constants_1.Folder.edited : constants_1.Folder.raw;
        const mergedMsg = yield mergeVideos(folderToMerge);
        console.log(mergedMsg.green);
    });
}
run(config_1.compilationConfig).then(() => { });
