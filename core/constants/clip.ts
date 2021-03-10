import { Clip } from '../classes/Clip';


export interface BroadcasterData {
    id: string;
    name: string;
    display_name: string;
    channel_url: string;
    logo: string;
}
  
export interface VodData {
    id: string;
    url: string;
    offset: number;
    preview_image_url: string;
}
export interface ClipData {
    trackingId: string;
    url: string;
    language: string;
    broadcaster: BroadcasterData;
    vod: VodData;
    game: string;
    title: string;
    views: number;
    duration: number;
    date: string;
    thumbnails: {
        medium: string;
        small: string;
        tiny: string;
    }
}


