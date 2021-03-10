import axios from "axios";


if (!process.env.CLIENT_ID) {
    throw new Error("CLIENT_ID not set.");
} 

axios.defaults.headers.common['Client-ID'] = process.env.CLIENT_ID;
axios.defaults.headers.common['Accept'] = 'application/vnd.twitchtv.v5+json';


export default axios;