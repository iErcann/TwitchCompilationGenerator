"use strict";
exports.__esModule = true;
var axios_1 = require("axios");
var dotenv = require("dotenv");
dotenv.config();
// if (!process.env.CLIENT_ID) {
//     throw new Error("CLIENT_ID not set.");
// } 
// axios.defaults.headers.common['Client-ID'] = process.env.CLIENT_ID;
axios_1["default"].defaults.headers.common['Client-ID'] = "31jy19qk4q4r2dpln4g4pqfo6fsrtw";
axios_1["default"].defaults.headers.common['Accept'] = 'application/vnd.twitchtv.v5+json';
exports["default"] = axios_1["default"];
