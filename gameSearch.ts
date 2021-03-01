import { client_id } from './config';
import axios from 'axios';
import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

if (client_id.length === 0) throw new Error('Empty client_id, please modify it in config.ts!'.green);

axios.defaults.headers.common['Client-ID'] = client_id;
axios.defaults.headers.common['Accept'] = 'application/vnd.twitchtv.v5+json';

rl.question('Search game: ', (answer) => {
    axios.get(`https://api.twitch.tv/kraken/search/games?query=${answer}`, {}).then((res) => {
        const games = res.data.games;
        console.log(`${games.length} games found \n`);
        for (let i = 0; i < games.length; i++) {
            const game = games[i];
            console.log(game.name);
        }
    });
    rl.close();
});
