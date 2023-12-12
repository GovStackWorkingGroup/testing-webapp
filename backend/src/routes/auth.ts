import express from 'express';
import authController from '../controllers/authController';

const buildAuthRoutes = () => {
  const router = express.Router();
  const controller = authController();

  router.get('/auth/github', controller.loginWithGitHub);
  router.get('/auth/github/callback', controller.handleGitHubCallback);

  return router;
};

export default buildAuthRoutes;
