import { injectable } from "inversify";
import { Request, Response, CookieOptions } from "express";
import * as bcrypt from "bcryptjs";
import {
  tokenRoundsOfHashing,
  accessTokenExpiresIn
} from "../../config/defaults";
import { AppError, HttpStatusCode } from "../../utils/AppError";
import UsersService from "../users/users.service";
import { jwtCookieName } from "../../config/defaults";
import omit from "lodash.omit";
import { loginUserSchema, registerUserSchema } from "./auth.schema";

const accessTokenCookieOptions: CookieOptions = {
  maxAge: accessTokenExpiresIn * 60 * 1000,
  httpOnly: true,
  sameSite: "strict",
  secure: process.env.NODE_ENV === "production"
};

@injectable()
class AuthController {
  private usersService: UsersService;

  public constructor(usersService: UsersService) {
    this.usersService = usersService;
  }

  public register = async (req: Request, res: Response) => {
    const { email, password, firstName, lastName } = registerUserSchema.parse(
      req.body
    );

    const doesUserExist = await this.usersService.getOne({ email });

    if (doesUserExist) {
      throw new AppError({
        statusCode: HttpStatusCode.CONFLICT,
        message: "The email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, tokenRoundsOfHashing);

    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      firstName,
      lastName
    });

    res.status(HttpStatusCode.CREATED).json({
      message: "User registered successfully",
      user: omit(user, "password")
    });
  };

  public login = async (req: Request, res: Response) => {
    const { email, password } = loginUserSchema.parse(req.body);

    const user = await this.usersService.getOne({ email });

    if (!user) {
      throw new AppError({
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: "Invalid username or password"
      });
    }

    const doPasswordsMatch = await bcrypt.compare(password, user.password);

    if (!doPasswordsMatch) {
      throw new AppError({
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: "Invalid username or password"
      });
    }

    const { accessToken } = this.usersService.signToken({
      id: user.id
    });

    res.cookie(jwtCookieName, accessToken, accessTokenCookieOptions);
    res.status(HttpStatusCode.OK).json({
      accessToken
    });
  };

  public logout = (req: Request, res: Response) => {
    res.cookie(jwtCookieName, "", {
      httpOnly: true,
      expires: new Date(0)
    });
    res.status(HttpStatusCode.OK).json({
      message: "User logged out successfully"
    });
  };
}

export default AuthController;
