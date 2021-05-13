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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryClips = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv = __importStar(require("dotenv"));
const config_1 = require("../config");
dotenv.config();
axios_1.default.defaults.headers.common["Client-ID"] = process.env.CLIENT_ID;
axios_1.default.defaults.headers.common["Accept"] = "application/vnd.twitchtv.v5+json";
function queryClips(compilationConfig) {
    return __awaiter(this, void 0, void 0, function* () {
        const channel = compilationConfig.channelName;
        const clipCount = compilationConfig.clipCount;
        const period = compilationConfig.period;
        const trending = compilationConfig.trending;
        const language = compilationConfig.language;
        const game = compilationConfig.game;
        if (game.length && channel.length) {
            console.log("Both channel and game are specified, game is ignored.".red);
        }
        let apiUrl = `https://api.twitch.tv/kraken/clips/top?period=${period}&trending=${trending}&limit=${clipCount}`;
        apiUrl += language.length > 0 ? `&language=${language}` : "";
        apiUrl += channel.length > 0 ? `&channel=${channel}` : "";
        apiUrl += game.length > 0 ? `&game=${game}` : "";
        const queryResult = yield axios_1.default.get(apiUrl, {});
        const clips = queryResult.data.clips;
        return clips;
    });
}
exports.queryClips = queryClips;
queryClips(config_1.compilationConfig).then((clips) => console.log(clips[0]));
