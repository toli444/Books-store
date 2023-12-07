import { injectable } from 'inversify';
import { prisma } from '../../server';

@injectable()
class AuthorsService {
  getBooks({ authorId }: { authorId: string }) {
    return prisma.author
      .findUnique({
        where: {
          id: authorId
        }
      })
      .books();
  }
}

export default AuthorsService;
