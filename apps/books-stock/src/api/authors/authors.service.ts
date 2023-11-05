import { injectable } from "inversify";
import { prisma } from "../../server";

@injectable()
class BooksService {
  public getBooks({ authorId }: { authorId: number }) {
    return prisma.author
      .findUnique({
        where: {
          id: authorId
        }
      })
      .books();
  }
}

export default BooksService;
