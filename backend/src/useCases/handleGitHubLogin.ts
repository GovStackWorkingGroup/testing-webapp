import { Request, Response } from 'express';
import axios from 'axios';
import { appConfig } from '../config'; // Konfiguracja aplikacji

export default class GitHubLoginHandler {

  public initiateGitHubLogin(_: Request, res: Response): void {
    const clientId = appConfig.gitHub.clientId;
    const redirectUri = encodeURIComponent(appConfig.gitHub.callbackUrl);
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`);
  }

  public async processGitHubCallback(req: Request, res: Response): Promise<void> {
    const code = req.query.code as string;
    const clientId = appConfig.gitHub.clientId;
    const clientSecret = appConfig.gitHub.clientSecret;

    try {
      // change code for access token
      const githubResponse = await axios.post('https://github.com/login/oauth/access_token', {
        client_id: clientId,
        client_secret: clientSecret,
        code: code
      }, {
        headers: {
          accept: 'application/json'
        }
      });

      const accessToken = githubResponse.data.access_token;

      res.redirect(`http://localhost:3000?token=${accessToken}`);
    } catch (error) {
      console.error('Error during GitHub Callback:', error);
      res.status(500).send('Authentication failed');
    }
  }
}
