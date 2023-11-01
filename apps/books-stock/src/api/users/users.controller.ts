import { injectable } from "inversify";
import { Request, Response } from "express";
import UsersService from "./users.service";
import { userIdSchema } from "./user.schema";
import omit from "lodash.omit";

@injectable()
class UsersController {
  private usersService: UsersService;

  public constructor(usersService: UsersService) {
    this.usersService = usersService;
  }
  public get = async (req: Request, res: Response) => {
    const users = await this.usersService.getMany();
    res.json(users.map((u) => omit(u, "password")));
  };

  public getOne = async (req: Request, res: Response) => {
    const data = userIdSchema.parse(req.params);
    const user = await this.usersService.getOne(data);
    res.json(omit(user, "password"));
  };
}

export default UsersController;
