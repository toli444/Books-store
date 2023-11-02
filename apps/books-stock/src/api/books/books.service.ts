import { injectable } from "inversify";
import { Prisma } from "@prisma/client";
import { prisma } from "../../server";

@injectable()
class BooksService {
  public getOne({ bookId }: { bookId: number }) {
    return prisma.book.findUnique({
      where: {
        id: bookId
      },
      include: {
        author: true
      }
    });
  }

  public getMany() {
    return prisma.book.findMany({
      include: {
        author: true
      }
    });
  }

  public createWithAuthorInfo({
    name,
    authorFirstName,
    authorLastName
  }: {
    name: string;
    authorFirstName: string;
    authorLastName: string;
  }) {
    return prisma.book.create({
      data: Prisma.validator<Prisma.BookCreateInput>()({
        name,
        author: {
          connectOrCreate: {
            where: {
              firstName_lastName: {
                firstName: authorFirstName,
                lastName: authorLastName
              }
            },
            create: {
              firstName: authorFirstName,
              lastName: authorLastName
            }
          }
        }
      }),
      include: {
        author: true
      }
    });
  }

  public createWithAuthorId({
    name,
    authorId
  }: {
    name: string;
    authorId: number;
  }) {
    return prisma.book.create({
      data: Prisma.validator<Prisma.BookCreateInput>()({
        name,
        author: {
          connect: {
            id: authorId
          }
        }
      }),
      include: {
        author: true
      }
    });
  }

  public createMany(
    books: Array<{
      name: string;
      authorId: number;
    }>
  ) {
    return prisma.book.createMany({
      data: books.map((book) =>
        Prisma.validator<Prisma.BookCreateManyInput>()({
          name: book.name,
          authorId: book.authorId
        })
      )
    });
  }

  public update({
    bookId,
    name,
    authorId
  }: {
    bookId: number;
    name: string;
    authorId: number;
  }) {
    return prisma.book.update({
      where: {
        id: bookId
      },
      data: Prisma.validator<Prisma.BookUpdateInput>()({
        name,
        author: {
          connect: {
            id: authorId
          }
        }
      }),
      include: {
        author: true
      }
    });
  }

  public patch({
    bookId,
    name,
    authorId
  }: {
    bookId: number;
    name?: string;
    authorId?: number;
  }) {
    return prisma.book.update({
      where: {
        id: bookId
      },
      data: Prisma.validator<Prisma.BookUpdateInput>()({
        name,
        author: authorId
          ? {
              connect: {
                id: authorId
              }
            }
          : undefined
      }),
      include: {
        author: true
      }
    });
  }

  public remove({ bookId }: { bookId: number }) {
    return prisma.book.delete({
      where: {
        id: bookId
      }
    });
  }
}

export default BooksService;
