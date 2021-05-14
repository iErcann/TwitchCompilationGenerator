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