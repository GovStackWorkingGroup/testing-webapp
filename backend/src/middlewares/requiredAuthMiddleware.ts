import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { appConfig } from '../config';

interface RequestAuth extends Request {
  user?: any;
}

const verifyGithubToken = async (req: RequestAuth, res: Response, next: NextFunction): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer TOKEN

  if (!token) {
    res.status(401).json({ message: 'User not authorized' });
    return; 
  }
  try {
    jwt.verify(token, appConfig.gitHub.jwtSecret, (err, user) => {
      if (err) {
        res.status(403).json({ message: 'Token is invalid' });
        return;
      }
      req.user = user;
      next();
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
    return;
  }
};

export default verifyGithubToken;
