import { UserRoles } from "../auth/auth.types";

export interface IUser {
  id: number;
  role: UserRoles;
  email: string;
  password: string;
}
