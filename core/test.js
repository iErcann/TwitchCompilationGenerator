"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compilationConfig = void 0;
const Clip_1 = require("./classes/Clip");
const clip = {
    slug: 'FrailStylishHamburgerLeeroyJenkins-Pd1MJ4UGOFlUd85I',
    tracking_id: '1077064837',
    url: 'https://clips.twitch.tv/FrailStylishHamburgerLeeroyJenkins-Pd1MJ4UGOFlUd85I?tt_medium=clips_api&tt_content=url',
    embed_url: 'https://clips.twitch.tv/embed?clip=FrailStylishHamburgerLeeroyJenkins-Pd1MJ4UGOFlUd85I&tt_medium=clips_api&tt_content=emb',
    embed_html: "<iframe src='https://clips.twitch.tv/embed?clip=FrailStylishHamburgerLeeroyJenkins-Pd1MJ4UGOFlUd85I&tt_medium=clips_api&",
    broadcaster: {
        id: '60917582',
        name: 's1mple',
        display_name: 's1mple',
        channel_url: 'https://www.twitch.tv/s1mple',
        logo: 'https://static-cdn.jtvnw.net/jtv_user_pictures/5f30f674-272c-41d4-b103-f121be3e0663-profile_image-300x300.png'
    },
    curator: {
        id: '99885363',
        name: 'sultaniho_8',
        display_name: 'Sultaniho_8',
        channel_url: 'https://www.twitch.tv/sultaniho_8',
        logo: 'https://static-cdn.jtvnw.net/user-default-pictures-uv/cdd517fe-def4-11e9-948e-784f43822e80-profile_image-150x150.png'
    },
    vod: {
        id: '936802708',
        url: 'https://www.twitch.tv/videos/936802708?t=3h47m14s',
        offset: 13634,
        preview_image_url: 'https://clips-media-assets2.twitch.tv/40871347133-offset-13658-preview.jpg'
    },
    broadcast_id: '40871347133',
    game: 'Counter-Strike: Global Offensive',
    language: 'ru',
    title: 's1mple 69 kills and 77K Viewers after 4OTs',
    views: 41039,
    duration: 30,
    created_at: '2021-03-04T22:00:16Z',
    thumbnails: {
        medium: 'https://clips-media-assets2.twitch.tv/40871347133-offset-13658-preview-480x272.jpg',
        small: 'https://clips-media-assets2.twitch.tv/40871347133-offset-13658-preview-260x147.jpg',
        tiny: 'https://clips-media-assets2.twitch.tv/40871347133-offset-13658-preview-86x45.jpg'
    }
};
// const clipData : ClipData   = clip as unknown as ClipData;
// console.log(clipData.curator);
exports.compilationConfig = {
    channelName: '',
    period: 'month',
    clipCount: 4,
    trending: false,
    language: '',
    editing: false,
    game: "Counter-Strike: Global Offensive" /* CSGO */,
    log: false,
    introPath: '',
    outroPath: ''
};
const arrayClipDatas = Clip_1.Clip.queryClips(exports.compilationConfig);
console.log(arrayClipDatas);
