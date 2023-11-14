export enum UserRoles {
  ADMIN = 'ADMIN',
  CUSTOMER = 'CUSTOMER'
}

export type User = {
  id: number;
  email: string;
  password: string;
  role: UserRoles;
  refreshToken?: string;
};
