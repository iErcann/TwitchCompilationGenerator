import { ICompilationConfig } from './constants';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

axios.defaults.headers.common['Client-ID'] = process.env.CLIENT_ID;
axios.defaults.headers.common['Accept'] = 'application/vnd.twitchtv.v5+json';

export async function queryClips(compilationConfig: ICompilationConfig) {
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
	const clips = queryResult.data.clips;
	return clips;
}
