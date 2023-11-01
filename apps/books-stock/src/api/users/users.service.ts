import { injectable } from "inversify";
import { accessTokenExpiresIn } from "../../config/defaults";
import jwt from "jsonwebtoken";

@injectable()
class UsersService {
  public signToken = (user: { id: number }) => {
    const accessToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: `${accessTokenExpiresIn}m`
      }
    );

    return { accessToken };
  };
}

export default UsersService;
