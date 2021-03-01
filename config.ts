import { ICompilationConfig, PopularGames } from './index';
export const client_id = '';

export const compilationConfig: ICompilationConfig = {
	channelName:  '' ,  
	period: 'month', // day, week or month
    clipCount: 10,  
    trending: false, // If true, the clips are ordered by popularity; otherwise, by viewcount. 
    language: '',  
    editing: false,
    game: PopularGames.CSGO, 
    log: false,
    introPath: 'intro.mp4',
    outroPath: 'outro.mp4' 
};