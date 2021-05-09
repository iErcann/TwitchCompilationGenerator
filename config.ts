import { PopularGames } from "./core/constants";
import { IAutomaticCompilationConfig, IManualCompilationConfig, ICompilationConfig } from "./core/types";


export const compilationConfig : IAutomaticCompilationConfig = {
    channelName: "xqcow", 
    clipCount: 3, 
    period: "month", 
    trending: false,
    editing: true, 
    game: PopularGames.CSGO,
    log: true, 
}


export const manualCompilationConfig : IManualCompilationConfig = {
	log: false,
	editing: true,
	clipsList: ["https://www.twitch.tv/antoinedaniellive/clip/UninterestedFreezingEmuWTRuck-RmhtVhoy_xrz52PJ?filter=clips&range=7d&sort=time", 
	"https://www.twitch.tv/antoinedaniellive/clip/UninterestedEagerPuddingFailFish-h_i5D2Qj9djmzMR5",
	 "https://clips.twitch.tv/UninterestedEagerPuddingFailFish-h_i5D2Qj9djmzMR5"]
}


