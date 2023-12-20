import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { appConfig } from '../config';

interface RequestAuth extends Request {
    user?: any;
}

const verifyOptionalGithubToken = async (req: RequestAuth, _: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Format: Bearer TOKEN

    if (token) {
        try {
            jwt.verify(token, appConfig.gitHub.jwtSecret, (err, user) => {
                if (!err) {
                    req.user = user;
                }
                // Continue the request regardless of token validation
                next();
            });
        } catch (error: any) {
            // Log the error but don't send a response error
            console.error('Error in token verification:', error.message);
            next();
        }
    } else {
        // If no token, just continue the request
        next();
    }
};

export default verifyOptionalGithubToken;
