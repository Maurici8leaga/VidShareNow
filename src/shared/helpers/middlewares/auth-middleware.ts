import { Request, Response, NextFunction } from 'express';
import JWT from 'jsonwebtoken';
import { NotAuthorizedError } from '@helpers/errors/notAuthorizedError';
import { config } from '@configs/configEnv';
import { AuthPayload } from '@user/interfaces/authPayload.interface';

export class AuthMiddleware {
  public verifyUserToken(req: Request, _res: Response, next: NextFunction): void {
    if (!req.session?.token) {
      throw new NotAuthorizedError('Token not provided. Please login again');
    }

    try {
      const payload: AuthPayload = JWT.verify(req.session?.token, config.JWT_TOKEN!) as AuthPayload;

      req.currentUser = payload;
    } catch (error) {
      throw new NotAuthorizedError('Token is invalid. Please login again');
    }
    next();
  }

  public checkUserAuthentication(req: Request, _res: Response, next: NextFunction): void {
    if (!req.currentUser) {
      throw new NotAuthorizedError('Authentication is required to access this route');
    }
    next();
  }
}

export const authMiddleware: AuthMiddleware = new AuthMiddleware();
