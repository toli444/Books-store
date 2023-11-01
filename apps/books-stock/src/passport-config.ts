import { Strategy, ExtractJwt } from "passport-jwt";
import { users } from "./api/auth/auth.controller";
import passport from "passport";
import { Request } from "express";

type PassportType = typeof passport;

interface IRequest extends Request {
  cookies: {
    accessToken?: string;
  };
}

interface IJwtPayload {
  id: number;
}

const cookieExtractor = (req: IRequest) => {
  return req.cookies?.accessToken || null;
};
export function configurePassport(passport: PassportType) {
  passport.use(
    new Strategy(
      {
        jwtFromRequest: ExtractJwt.fromExtractors([
          cookieExtractor,
          ExtractJwt.fromAuthHeaderAsBearerToken()
        ]),
        secretOrKey: process.env.JWT_SECRET
      },
      (jwtPayload: IJwtPayload, done) => {
        const user = users.find((u) => u.id === jwtPayload.id);

        if (user) {
          return done(null, user);
        }

        return done(null, false);
      }
    )
  );
}
