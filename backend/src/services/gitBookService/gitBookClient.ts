import axios from 'axios';
import { appConfig } from '../../config';

const gitBookClient = axios.create({
  baseURL: appConfig.gitBook.baseURL,
  headers: { 'Authorization': `Bearer ${appConfig.gitBook.apiKey}` }
});

export default gitBookClient;
