import { injectable } from 'inversify';

@injectable()
class AuthService {
  public getMany() {
    return prisma.user.findMany();
  }
}

export default AuthService;
