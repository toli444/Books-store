import { injectable } from 'inversify';
import { accessTokenExpiresIn } from '../../config/defaults';
import jwt from 'jsonwebtoken';
import { prisma } from '../../server';
import { Prisma } from '@prisma/client';

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

  public getOne({ userId, email }: { userId?: number; email?: string }) {
    return prisma.user.findUnique({
      where: {
        id: userId,
        email
      }
    });
  }

  public getMany() {
    return prisma.user.findMany();
  }

  public create = ({
    firstName,
    lastName,
    email,
    password
  }: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    return prisma.user.create({
      data: Prisma.validator<Prisma.UserCreateInput>()({
        firstName,
        lastName,
        email,
        password
      })
    });
  };
}

export default UsersService;
