import { Types } from 'mongoose';

export enum UserRoles {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER'
}

export type User = {
  _id: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRoles;
  refreshToken?: string;
};
