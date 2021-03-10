export const UNVERIFIED_RESOLUTION_PREFIX = '_';

export const enum PopularGames {
	CSGO = 'Counter-Strike: Global Offensive',
	JustChatting = 'Just Chatting',
	GTA5 = 'Grand Theft Auto V',
	LOL = 'League of Legends',
	WOW = 'World of Warcraft',
}
export interface ICompilationConfig {
	channelName: string;
	clipCount: number;
	period: string;
	trending: boolean;
	language: string;
	editing: boolean;
	game: string;
	log: boolean;
	introPath: string;
	outroPath: string;
}

const OUTPUT_FOLDER_LOCATION = '../';
export enum Folder {
	merged = 'merged_video',
	edited = 'edited_videos',
	raw = 'raw_videos',
	data = 'data_videos',
}


export interface IResolution {
	width: number;
	height: number;
}

export const DEFAULT_RESOLUTION: IResolution = { width: 1920, height: 1080 };







