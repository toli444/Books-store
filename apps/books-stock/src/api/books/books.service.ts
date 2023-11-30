import { injectable } from 'inversify';
import { Prisma } from '@prisma/client';
import { prisma } from '../../server';
import { PathLike } from 'fs';
import { readDataFromCsvFile } from '../../utils/readFromCsv.util';
import { AppError, HttpStatusCode } from '../../utils/AppError';

@injectable()
class BooksService {
  public findOne({ bookId }: { bookId: string }) {
    return prisma.book.findUnique({
      where: {
        id: bookId
      },
      include: {
        author: true,
        stockStatus: true
      }
    });
  }

  public findAll() {
    return prisma.book.findMany({
      include: {
        author: true,
        stockStatus: true
      }
    });
  }

  public createWithAuthorInfo({
    name,
    authorFirstName,
    authorLastName,
    quantity = 0
  }: {
    name: string;
    authorFirstName: string;
    authorLastName: string;
    quantity?: number;
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
        },
        stockStatus: {
          create: {
            quantity
          }
        }
      }),
      include: {
        author: true,
        stockStatus: true
      }
    });
  }

  public createWithAuthorId({
    name,
    authorId,
    quantity = 0
  }: {
    name: string;
    authorId: string;
    quantity?: number;
  }) {
    return prisma.book.create({
      data: Prisma.validator<Prisma.BookCreateInput>()({
        name,
        author: {
          connect: {
            id: authorId
          }
        },
        stockStatus: {
          create: {
            quantity
          }
        }
      }),
      include: {
        author: true,
        stockStatus: true
      }
    });
  }

  public async createMany(
    books: Array<{
      name: string;
      authorFirstName: string;
      authorLastName: string;
      quantity?: number;
    }>
  ) {
    await prisma.author.createMany({
      data: books.map((book) => ({
        firstName: book.authorFirstName,
        lastName: book.authorLastName
      })),
      skipDuplicates: true
    });

    // await prisma.$queryRaw`
    //   INSERT INTO "StockStatus" ("name", "authorId")
    //   VALUES ${Prisma.join(
    //     books.map(
    //       (book) => Prisma.sql`
    //       (
    //         ${Prisma.join([
    //           book.name,
    //           Prisma.sql`(SELECT "id" FROM "Author" WHERE "firstName" = ${book.authorFirstName} AND "lastName" = ${book.authorLastName})`,
    //           Prisma.sql`(SELECT "id" FROM "Author" WHERE "firstName" = ${book.authorFirstName} AND "lastName" = ${book.authorLastName})`
    //         ])}
    //       )`
    //     )
    //   )}
    //   ON CONFLICT DO NOTHING`;

    return prisma.$queryRaw`
      INSERT INTO "Book" ("name", "authorId")
      VALUES ${Prisma.join(
        books.map(
          (book) => Prisma.sql`
          (
            ${Prisma.join([
              book.name,
              Prisma.sql`(SELECT "id" FROM "Author" WHERE "firstName" = ${book.authorFirstName} AND "lastName" = ${book.authorLastName})`,
              Prisma.sql`(SELECT "id" FROM "Author" WHERE "firstName" = ${book.authorFirstName} AND "lastName" = ${book.authorLastName})`
            ])}
          )`
        )
      )}
      ON CONFLICT DO NOTHING`;
  }

  public async patch({
    bookId,
    name,
    authorId,
    quantity
  }: {
    bookId: string;
    name?: string;
    authorId?: string;
    quantity?: number;
  }) {
    const book = await this.findOne({ bookId });

    if (!book) {
      throw new AppError({
        statusCode: HttpStatusCode.NOT_FOUND,
        message: 'Not found.'
      });
    }

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
          : undefined,
        stockStatus: quantity
          ? {
              update: {
                where: { id: book.stockStatus?.id },
                data: {
                  quantity
                }
              }
            }
          : undefined
      }),
      include: {
        author: true,
        stockStatus: true
      }
    });
  }

  public remove({ bookId }: { bookId: string }) {
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
