import { decorate, injectable } from 'inversify';
import { Strategy, ExtractJwt } from 'passport-jwt';
import UsersService from '../users/users.service';
import { Request } from 'express';

interface IRequest extends Request {
  cookies: {
    accessToken?: string;
  };
}

interface IJwtPayload {
  id: string;
}

const cookieExtractor = (req: IRequest) => {
  return req.cookies?.accessToken || null;
};

decorate(injectable(), Strategy);

@injectable()
class JwtStrategy extends Strategy {
  constructor(usersService: UsersService) {
    super(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([
          cookieExtractor,
          ExtractJwt.fromAuthHeaderAsBearerToken()
        ]),
        secretOrKey: process.env.JWT_SECRET
      },
      async (jwtPayload: IJwtPayload, done) => {
        const user = await usersService.getOne({ userId: jwtPayload.id });

        if (user) {
          return done(null, user);
        }

        return done(null, false);
      }
    );
  }
}

export default JwtStrategy;
