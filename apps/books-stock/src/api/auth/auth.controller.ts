import { injectable } from "inversify";
import { Request, Response, CookieOptions } from "express";
import * as bcrypt from "bcryptjs";
import {
  tokenRoundsOfHashing,
  accessTokenExpiresIn
} from "../../config/defaults";
import { HttpStatusCode } from "../../utils/AppError";
import UsersService from "../users/users.service";
import { UserRoles } from "./auth.types";
import { IUser } from "../users/users.types";
import { jwtCookieName } from "../../config/defaults";
import omit from "lodash.omit";

let id = 0;

export const users: Array<IUser> = [];

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

  public register = async (
    req: Request<
      unknown,
      unknown,
      {
        email: string;
        password: string;
      }
    >,
    res: Response
  ) => {
    const { email, password } = req.body;

    const doesUserExist = users.find((u) => u.email === email);

    if (doesUserExist) {
      res
        .status(HttpStatusCode.CONFLICT)
        .json({ error: "The email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, tokenRoundsOfHashing);
    const newUser = {
      id: ++id,
      role: UserRoles.CUSTOMER,
      email,
      password: hashedPassword
    };
    users.push(newUser);

    res.status(HttpStatusCode.CREATED).json({
      message: "User registered successfully",
      user: omit(newUser, "password")
    });
  };

  public login = async (
    req: Request<unknown, unknown, IUser>,
    res: Response
  ) => {
    const { email, password } = req.body;

    const user = users.find((u) => u.email === email);

    if (!user) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ error: "Invalid username or password" });
    }

    const doPasswordsMatch = await bcrypt.compare(password, user.password);

    if (!doPasswordsMatch) {
      return res
        .status(HttpStatusCode.BAD_REQUEST)
        .json({ error: "Invalid username or password" });
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
      message: "User registered successfully"
    });
  };
}

export default AuthController;
