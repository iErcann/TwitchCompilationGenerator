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
exports.Clip = void 0;
var https = require("https");
var cliProgress = require("cli-progress");
var fs = require("fs");
var ffmpeg = require("fluent-ffmpeg");
var axios_1 = require("../config/axios");
var helpers_1 = require("../helpers");
var Clip = /** @class */ (function () {
    function Clip(data, fileName) {
        this.data = data;
        this.fileName = fileName;
    }
    Clip.queryClipsData = function (compilationConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var clips, _a, channelName, period, trending, language, game, clipCount, apiUrl, queryResult, clipsList, slugList, i, apiUrl, queryResult;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        clips = [];
                        if (!helpers_1.isAutomatic(compilationConfig)) return [3 /*break*/, 2];
                        _a = compilationConfig, channelName = _a.channelName, period = _a.period, trending = _a.trending, language = _a.language, game = _a.game, clipCount = _a.clipCount;
                        if (game && game.length && channelName && channelName.length) {
                            console.log('Both channel and game are specified, game is ignored.'.red);
                        }
                        apiUrl = "https://api.twitch.tv/kraken/clips/top?period=" + period + "&limit=" + clipCount;
                        apiUrl += trending ? "&trending=" + trending : '';
                        apiUrl += language && language.length > 0 ? "&language=" + language : '';
                        apiUrl += channelName && channelName.length > 0 ? "&channel=" + channelName : '';
                        apiUrl += game && game.length > 0 ? "&game=" + game : '';
                        return [4 /*yield*/, axios_1["default"].get(apiUrl, {})];
                    case 1:
                        queryResult = _b.sent();
                        clips = queryResult.data.clips;
                        return [3 /*break*/, 6];
                    case 2:
                        clipsList = compilationConfig.clipsList;
                        slugList = clipsList.map(function (url) { return helpers_1.getSlug(url); });
                        i = 0;
                        _b.label = 3;
                    case 3:
                        if (!(i < slugList.length)) return [3 /*break*/, 6];
                        apiUrl = "https://api.twitch.tv/kraken/clips/" + slugList[i];
                        return [4 /*yield*/, axios_1["default"].get(apiUrl, {})];
                    case 4:
                        queryResult = _b.sent();
                        clips.push(queryResult.data);
                        _b.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 3];
                    case 6: return [2 /*return*/, clips];
                }
            });
        });
    };
    Clip.queryClips = function (compilationConfig) {
        return __awaiter(this, void 0, void 0, function () {
            var clipDatas, clips, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Clip.queryClipsData(compilationConfig)];
                    case 1:
                        clipDatas = _a.sent();
                        clips = [];
                        for (i = 0; i < clipDatas.length; i++)
                            clips.push(new Clip(clipDatas[i], i.toString()));
                        return [2 /*return*/, clips];
                }
            });
        });
    };
    Clip.prototype.download = function (path) {
        var thumbUrl = this.data.thumbnails.medium;
        var dlUrl = thumbUrl.substring(0, thumbUrl.indexOf('-preview')) + '.mp4';
        this.rawPath = path;
        var file = fs.createWriteStream(this.rawPath);
        return new Promise(function (resolve) {
            https.get(dlUrl, function (response) {
                var contentLength = parseInt(response.headers['content-length']);
                var opt = {
                    format: '[{bar}] {percentage}% | ETA: {eta}s | {value}/{total} bytes'.cyan
                };
                var progressBar = new cliProgress.SingleBar(opt, cliProgress.Presets.shades_classic);
                console.log('\nClip download progress '.cyan);
                progressBar.start(contentLength, 0);
                var logTimer = setInterval(function () {
                    progressBar.update(file.bytesWritten);
                }, 1000);
                response.pipe(file);
                file.on('finish', function () {
                    progressBar.update(contentLength);
                    clearInterval(logTimer);
                    progressBar.stop();
                    resolve('Clip downloaded.');
                });
            });
        });
    };
    Clip.prototype.rename = function (newPath) {
        // Changed to sync rename
        fs.renameSync(this.rawPath, newPath);
        this.rawPath = newPath;
    };
    Clip.prototype.getResolution = function () {
        var _this = this;
        return new Promise(function (resolve) {
            ffmpeg.ffprobe(_this.rawPath, function (err, metadata) {
                if (err) {
                    console.error(err);
                }
                else {
                    var stream = metadata.streams[0];
                    resolve({ width: stream.width, height: stream.height });
                }
            });
        });
    };
    Clip.prototype.setResolution = function (newPath, wantedResolution) {
        var _this = this;
        return new Promise(function (resolve) {
            ffmpeg(_this.rawPath)
                .videoFilters([
                {
                    filter: 'scale',
                    options: wantedResolution.width + ":" + wantedResolution.height
                },
            ])
                .on('end', function () {
                try {
                    fs.unlinkSync(_this.rawPath);
                    _this.rawPath = newPath;
                }
                catch (err) {
                    console.error(err);
                }
                resolve('Resolution changed.');
            })
                .save(newPath);
        });
    };
    Clip.prototype.hasDefaultResolution = function (wantedResolution) {
        return __awaiter(this, void 0, void 0, function () {
            var resolution;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getResolution()];
                    case 1:
                        resolution = _a.sent();
                        return [2 /*return*/, !(resolution.width != wantedResolution.width || resolution.height != wantedResolution.height)];
                }
            });
        });
    };
    Clip.prototype.editVideo = function (editedPath) {
        var _this = this;
        this.editedPath = editedPath;
        var opt = {
            format: '[{bar}] {percentage}% | ETA: {eta}s'.cyan
        };
        var progressBar = new cliProgress.SingleBar(opt, cliProgress.Presets.shades_classic);
        return new Promise(function (resolve) {
            ffmpeg(_this.rawPath)
                .on('error', function (err, stdout, stderr) {
                console.log('an error happened: ' + err.message);
                console.log("stdout:\n" + stdout);
                console.log("stderr:\n" + stderr); //this will contain more detailed debugging info
            })
                .on('progress', function (info) {
                progressBar.update(Number(info.percent.toFixed(2)));
            })
                .on('end', function () {
                progressBar.update(100);
                progressBar.stop();
                resolve('Edition finished');
            })
                .on('start', function () {
                console.log('\nClip edit progress '.cyan);
                progressBar.start(100, 0);
            })
                .videoFilters([
                {
                    filter: 'scale',
                    options: '1920:1080'
                },
                {
                    filter: 'drawtext',
                    options: {
                        text: "" + _this.data.title,
                        fontcolor: 'white',
                        fontsize: 45,
                        x: '(main_w/2-text_w/2)',
                        y: '(main_h-text_h*2)',
                        shadowcolor: 'black',
                        box: '1',
                        boxcolor: 'black@0.7',
                        boxborderw: 10,
                        shadowx: 0,
                        shadowy: 0
                    }
                },
                {
                    filter: 'drawtext',
                    options: {
                        text: "" + _this.data.broadcaster.display_name,
                        fontcolor: 'white',
                        fontsize: 40,
                        x: '(main_w-text_w-10)',
                        y: '(10)',
                        shadowcolor: 'black',
                        box: '1',
                        boxcolor: 'black@0.7',
                        boxborderw: 10,
                        shadowx: 0,
                        shadowy: 0
                    }
                },
            ])
                .save(_this.editedPath);
        });
    };
    return Clip;
}());
exports.Clip = Clip;
