import express from 'express';
import GitHubLoginHandler from '../useCases/handleGitHubLogin';

const authController = () => {
  const gitHubLoginHandler = new GitHubLoginHandler();

  const loginWithGitHub = (req: express.Request, res: express.Response) => {
    gitHubLoginHandler.initiateGitHubLogin(req, res);
  };

  const handleGitHubCallback = (req: express.Request, res: express.Response) => {
    gitHubLoginHandler.processGitHubCallback(req, res);
  };

  return {
    loginWithGitHub,
    handleGitHubCallback,
  };
};

export default authController;
