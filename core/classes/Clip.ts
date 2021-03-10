import axios from '../config/axios';
import { ICompilationConfig } from '../constants';
import { BroadcasterData, VodData, ClipData } from '../constants/clip';


export class Clip {
	private channelName: string;
	private date: string;
	private game: string;
	private language: string;

	constructor(data: ClipData) {
		this.channelName = data.title;
		this.date = data.date;
		this.game = data.game;
		this.channelName = data.broadcaster.display_name;
		this.language = data.language;
	}
	static async queryClips(compilationConfig: ICompilationConfig): Promise<Array<ClipData>> {
        const channel = compilationConfig.channelName;
		const clipCount = compilationConfig.clipCount;
		const period = compilationConfig.period;
		const trending = compilationConfig.trending;
		const language = compilationConfig.language;
		const game = compilationConfig.game;

		if (game.length && channel.length) {
			console.log('Both channel and game are specified, game is ignored.'.red);
		}

		let apiUrl = `https://api.twitch.tv/kraken/clips/top?period=${period}&trending=${trending}&limit=${clipCount}`;
		apiUrl += language.length > 0 ? `&language=${language}` : '';
		apiUrl += channel.length > 0 ? `&channel=${channel}` : '';
		apiUrl += game.length > 0 ? `&game=${game}` : '';

		const queryResult = await axios.get(apiUrl, {});
		const clips: Array<ClipData> = queryResult.data.clips;
		return clips;
	}
}

