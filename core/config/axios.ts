import axios from 'axios';
import { client_id } from '../../config' 

 
axios.defaults.headers.common['Client-ID'] = client_id;
axios.defaults.headers.common['Accept'] = 'application/vnd.twitchtv.v5+json';


export default axios;