import { NextFunction, Request, Response } from 'express';
import { UserRoles } from '../api/auth/auth.types';
import passport from 'passport';
import { HttpStatusCode } from '../utils/AppError';
import { IUser } from '../api/users/users.types';

// eslint-disable-next-line @typescript-eslint/no-unsafe-return
export const authorize = (requiredRole: UserRoles) => [
  passport.authenticate('jwt', { session: false }),
  (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUser;

    if (user && user.role === requiredRole) {
      return next();
    } else {
      return res
        .status(HttpStatusCode.FORBIDDEN)
        .json({ error: 'Access denied. Insufficient permissions.' });
    }
  }
];
