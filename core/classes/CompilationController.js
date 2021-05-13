"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.CompilationController = void 0;
var cliProgress = require("cli-progress");
var ffmpeg = require("fluent-ffmpeg");
var fs = require("fs");
var constants_1 = require("../constants");
var Clip_1 = require("./Clip");
var CompilationController = /** @class */ (function () {
    function CompilationController(config) {
        this.compilationConfig = config;
    }
    CompilationController.prototype.runCompilation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var clips, i, filename, path_1, newPath, editedPath, dataPath, clip, downloadMsg, resolutionIsOk, editMsg, folderToMerge, mergedMsg;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Clip_1.Clip.queryClips(this.compilationConfig)];
                    case 1:
                        clips = _a.sent();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < clips.length)) return [3 /*break*/, 11];
                        filename = "" + i;
                        path_1 = constants_1.Folders.raw + "/" + constants_1.UNVERIFIED_RESOLUTION_PREFIX + filename + ".mp4";
                        newPath = constants_1.Folders.raw + "/" + filename + ".mp4";
                        editedPath = constants_1.Folders.edited + "/" + filename + ".mp4";
                        dataPath = constants_1.Folders.data + "/" + filename + ".json";
                        clip = clips[i];
                        clip.data.title = this.clean(clip.data.title);
                        console.log("\n Clip " + (i + 1) + " -------------");
                        console.log("\t Channel :  " + clip.data.broadcaster.display_name);
                        console.log("\t Title :  " + clip.data.title);
                        console.log("\t Game: " + clip.data.game);
                        console.log("\t Views: " + clip.data.views);
                        return [4 /*yield*/, clip.download(path_1)];
                    case 3:
                        downloadMsg = _a.sent();
                        console.log(downloadMsg.green);
                        return [4 /*yield*/, clip.hasDefaultResolution(constants_1.DEFAULT_RESOLUTION)];
                    case 4:
                        resolutionIsOk = _a.sent();
                        if (!!resolutionIsOk) return [3 /*break*/, 6];
                        console.log(("Different resolution detected, scaling it to " + constants_1.DEFAULT_RESOLUTION.width + ":" + constants_1.DEFAULT_RESOLUTION.height + "..").cyan);
                        return [4 /*yield*/, clip.setResolution(newPath, constants_1.DEFAULT_RESOLUTION)];
                    case 5:
                        _a.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        clip.rename(newPath);
                        _a.label = 7;
                    case 7:
                        if (!this.compilationConfig.editing) return [3 /*break*/, 9];
                        return [4 /*yield*/, clip.editVideo(editedPath)];
                    case 8:
                        editMsg = _a.sent();
                        console.log(editMsg.green);
                        _a.label = 9;
                    case 9:
                        if (this.compilationConfig.log) {
                            fs.writeFileSync(dataPath, JSON.stringify(clip));
                        }
                        _a.label = 10;
                    case 10:
                        i++;
                        return [3 /*break*/, 2];
                    case 11:
                        folderToMerge = this.compilationConfig.editing ? constants_1.Folders.edited : constants_1.Folders.raw;
                        return [4 /*yield*/, this.mergeClips(folderToMerge)];
                    case 12:
                        mergedMsg = _a.sent();
                        console.log(mergedMsg.green);
                        return [2 /*return*/];
                }
            });
        });
    };
    CompilationController.prototype.run = function () {
        this.resetFolders();
        this.runCompilation();
        // En vrai c'est useless car Clip fait déjà ce filter 
        /*
        if (isAutomatic(this.compilationConfig)) {
            this.runAutomatic();
        } else {
            this.runManual();
        }*/
    };
    CompilationController.prototype.clean = function (str) {
        return str.replace(/[^0-9a-z-A-Z ]/g, '').replace(/ +/, ' ');
    };
    CompilationController.prototype.resetFolders = function () {
        for (var _i = 0, _a = Object.entries(constants_1.Folders); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            if (fs.existsSync(value)) {
                fs.rmdirSync(value, { recursive: true });
            }
            fs.mkdirSync(value);
        }
    };
    CompilationController.prototype.mergeClips = function (folderToMerge) {
        var opt = {
            format: '[{bar}] {percentage}% | ETA: {eta}s '.cyan
        };
        var progressBar = new cliProgress.SingleBar(opt, cliProgress.Presets.shades_classic);
        return new Promise(function (resolve) {
            var proc = ffmpeg()
                .on('end', function () {
                progressBar.update(100);
                progressBar.stop();
                resolve('Merge finished.');
            })
                .on('progress', function (info) {
                progressBar.update(Number(info.percent.toFixed(2)));
            })
                .on('start', function (cmdline) {
                console.log(cmdline);
                progressBar.start(100, 0);
            });
            var directoryPath = folderToMerge; // path.join(__dirname, folderToMerge);
            console.log('\nMerge started.'.cyan);
            fs.readdir(directoryPath, function (err, files) {
                if (err) {
                    return console.log('Unable to scan directory: ' + err);
                }
                // Intro
                //if (this.compilationConfig.introPath && this.compilationConfig.introPath.length > 0) proc.input(this.compilationConfig.introPath);
                // Clips
                files = files.sort(function (first, second) { return first.localeCompare(second); });
                for (var i = 0; i < files.length; i++) {
                    proc.input(folderToMerge + "/" + files[i]);
                }
                // Outro
                //if (this.compilationConfig.outroPath && this.compilationConfig.outroPath.length > 0) proc.input(this.compilationConfig.outroPath);
                proc.inputOption('-vsync 2');
                proc.mergeToFile(constants_1.Folders.merged + "/merged.mp4");
            });
        });
    };
    return CompilationController;
}());
exports.CompilationController = CompilationController;
