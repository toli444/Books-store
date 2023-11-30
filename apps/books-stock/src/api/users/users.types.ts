import { UserRoles } from '../auth/auth.types';

export interface IUser {
  id: string;
  role: UserRoles;
  email: string;
  password: string;
}
