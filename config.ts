import { ICompilationConfig, PopularGames } from './index';
export const client_id = '';

export const compilationConfig: ICompilationConfig = {
	channelName:  '' ,  
	period: 'week', // day, week or month
    clipCount: 2,  
    trending: false, // If true, the clips are ordered by popularity; otherwise, by viewcount. 
    language: '',  
    editing: true,
    game: PopularGames.JustChatting, 
    log: false  
};