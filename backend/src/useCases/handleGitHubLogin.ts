import { Request, Response } from 'express';
import axios, { AxiosError } from 'axios';
import { appConfig } from '../config';
import jwt from 'jsonwebtoken';

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
      const githubUserResponse = await axios.get('https://api.github.com/user', {
        headers: { Authorization: `token ${accessToken}` }
      });
      const userData = githubUserResponse.data;

      // Check if the user is a member of the "Reviewers" team
      const isMember = await this.checkTeamMembership(
        userData.login, appConfig.gitHub.organization, appConfig.gitHub.reviewersTeam
      );

      if (!isMember) {
        const redirectUrl = this.getBaseRedirectUrl(req) + '/?loginRejected=true';
        res.redirect(redirectUrl);
        return;
      }

      const sessionToken = jwt.sign(
        { userId: userData.id, username: userData.login },
        appConfig.gitHub.jwtSecret,
        { expiresIn: appConfig.gitHub.tokenExpirationTime } // Set expiration time
      );

      this.redirectUserWithToken(sessionToken, req, res);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Axios error during GitHub Callback:', error.message);
        if (error.response) {
          res.status(error.response.status).send(error.response.data);
        } else if (error.request) {
          res.status(500).send('No response received from GitHub');
        } else {
          res.status(500).send('Error in setting up the request');
        }
      } else {
        console.error('Non-Axios error during GitHub Callback:', error);
        res.status(500).send('Authentication failed due to server error');
      }
    }
  }

  private async checkTeamMembership(username: string, orgName: string, teamName: string): Promise<boolean> {
    try {
      const response = await axios.get(`https://api.github.com/orgs/${orgName}/teams/${encodeURIComponent(teamName)}`, {
        headers: {
          Authorization: `Bearer ${appConfig.gitHub.personalAccessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      });

      // Check if the team exists and if the user is a member of it
      if (response.status === 200 && response.data && response.data.slug === appConfig.gitHub.reviewersTeam) {
        const teamId = response.data.id;
        const membershipResponse = await axios.get(`https://api.github.com/teams/${teamId}/memberships/${username}`, {
          headers: {
            Authorization: `Bearer ${appConfig.gitHub.personalAccessToken}`,
            Accept: 'application/vnd.github.v3+json',
          },
        });

        return membershipResponse.status === 200;
      }

      return false;
    } catch (error) {
      return false;
    }
  }

  public redirectUserWithToken(sessionToken: string, req: Request, res: Response): void {
    const redirectUrl = this.getRedirectUrl(sessionToken, req);
    res.redirect(redirectUrl);
  }

  private getRedirectUrl(accessToken: string, req: Request): string {
    let baseUrl: string;
    if (appConfig.gitHub.devLoginMode) {
      baseUrl = `http://${appConfig.frontendHost}`;
    } else {
      let host = req.get('host') || '';

      if (host.startsWith('api.')) {
        host = host.substring(4);
      }

      const protocol = req.protocol;
      baseUrl = `${protocol}://${host}`;
    }
    return `${baseUrl}?token=${accessToken}`;
  }

  private getBaseRedirectUrl(req: Request): string {
    let baseUrl: string;
    if (appConfig.gitHub.devLoginMode) {
      baseUrl = `http://${appConfig.frontendHost}`;
    } else {
      let host = req.get('host') || '';
      if (host.startsWith('api.')) {
        host = host.substring(4);
      }
      const protocol = req.protocol;
      baseUrl = `${protocol}://${host}`;
    }
    return baseUrl;
  }
}
