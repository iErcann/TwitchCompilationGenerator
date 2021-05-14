import {   IResolution } from "../types";
import * as path from 'path';

export const UNVERIFIED_RESOLUTION_PREFIX = '_';

export const enum PopularGames {
	CSGO = 'Counter-Strike: Global Offensive',
	JustChatting = 'Just Chatting',
	GTA5 = 'Grand Theft Auto V',
	LOL = 'League of Legends',
	WOW = 'World of Warcraft',
}
 
export const Folders  =  {
	merged: path.resolve('merged_video'),
	edited: path.resolve('edited_videos'),
	raw: path.resolve('raw_videos'),
	data: path.resolve('data_videos'),
}


console.log("Output folders: " )
console.log(Folders);
 

export const DEFAULT_RESOLUTION: IResolution = { width: 1920, height: 1080 };


 



 
