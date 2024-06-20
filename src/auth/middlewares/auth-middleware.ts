import { NextFunction, Request, Response } from 'express';
import AuthService from '../auth-service';

const authService = new AuthService();

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {

  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }


  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  const payload = authService.verifyJwt(token);

  if (!payload) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  (req as any).user = payload;
  next();
};
