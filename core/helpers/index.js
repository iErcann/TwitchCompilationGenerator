"use strict";
exports.__esModule = true;
exports.getSlug = exports.isAutomatic = void 0;
function isAutomatic(config) {
    return config.hasOwnProperty("clipCount");
}
exports.isAutomatic = isAutomatic;
function getSlug(url) {
    url = url.substring(url.lastIndexOf('/') + 1);
    if (url.includes("?")) {
        url = url.substring(0, url.lastIndexOf('?'));
    }
    return url;
}
exports.getSlug = getSlug;
