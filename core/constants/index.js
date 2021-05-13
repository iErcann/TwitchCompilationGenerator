"use strict";
exports.__esModule = true;
exports.DEFAULT_RESOLUTION = exports.Folders = exports.UNVERIFIED_RESOLUTION_PREFIX = void 0;
var path = require("path");
exports.UNVERIFIED_RESOLUTION_PREFIX = '_';
exports.Folders = {
    merged: path.resolve('merged_video'),
    edited: path.resolve('edited_videos'),
    raw: path.resolve('raw_videos'),
    data: path.resolve('data_videos')
};
console.log(exports.Folders);
exports.DEFAULT_RESOLUTION = { width: 1920, height: 1080 };
