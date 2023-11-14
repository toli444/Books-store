import { injectable } from 'inversify';
import { Prisma } from '@prisma/client';
import { prisma } from '../../server';
import { PathLike } from 'fs';
import { readDataFromCsvFile } from '../../utils/readFromCsv.util';

@injectable()
class BooksService {
  public findOne({ bookId }: { bookId: number }) {
    return prisma.book.findUnique({
      where: {
        id: bookId
      },
      include: {
        author: true
      }
    });
  }

  public findAll() {
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

  public async createMany(
    books: Array<{
      name: string;
      authorFirstName: string;
      authorLastName: string;
    }>
  ) {
    await prisma.author.createMany({
      data: books.map((book) => ({
        firstName: book.authorFirstName,
        lastName: book.authorLastName
      })),
      skipDuplicates: true
    });

    return prisma.$queryRaw`
      INSERT INTO "Book" ("name", "authorId")
      VALUES ${Prisma.join(
        books.map(
          (book) => Prisma.sql`
          (
            ${Prisma.join([
              book.name,
              Prisma.sql`(SELECT "id" FROM "Author" WHERE "firstName" = ${book.authorFirstName} AND "lastName" = ${book.authorLastName})`
            ])}
          )`
        )
      )}
      ON CONFLICT DO NOTHING`;
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

  public readBooksFromCsv({ filePath }: { filePath: PathLike }) {
    return readDataFromCsvFile<{
      name: string;
      authorFirstName: string;
      authorLastName: string;
    }>({ filePath });
  }
}

export default BooksService;
