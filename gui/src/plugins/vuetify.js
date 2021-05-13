"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_1 = __importDefault(require("vue"));
const framework_1 = __importDefault(require("vuetify/lib/framework"));
const colors_1 = __importDefault(require("vuetify/lib/util/colors"));
vue_1.default.use(framework_1.default);
exports.default = new framework_1.default({
    theme: {
        dark: true,
        themes: {
            light: {
                primary: colors_1.default.purple,
                secondary: colors_1.default.grey.darken1,
                accent: colors_1.default.shades.black,
                error: colors_1.default.red.accent3,
            },
            dark: {
                primary: colors_1.default.grey.darken4,
                secondary: colors_1.default.grey.darken1,
                accent: colors_1.default.blue.darken3,
                error: colors_1.default.red.accent3,
            },
        },
    },
});
