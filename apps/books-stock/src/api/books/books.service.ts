import { injectable } from 'inversify';
import { Prisma } from '@prisma/client';
import { prisma } from '../../server';
import { PathLike } from 'fs';
import { readDataFromCsvFile } from '../../utils/readFromCsv.util';
import { AppError, HttpStatusCode } from '../../utils/AppError';

@injectable()
class BooksService {
  findOne({ bookId }: { bookId: string }) {
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

  findAll() {
    return prisma.book.findMany({
      include: {
        author: true,
        stockStatus: true
      }
    });
  }

  findByIds(ids: Array<string>) {
    return prisma.book.findMany({
      include: {
        author: true,
        stockStatus: true
      },
      where: {
        id: { in: ids }
      }
    });
  }

  createWithAuthorInfo({
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

  createWithAuthorId({
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

  async createMany(
    books: Array<{
      name: string;
      authorFirstName: string;
      authorLastName: string;
      quantity: number;
    }>
  ) {
    await prisma.author.createMany({
      data: books.map((book) => ({
        firstName: book.authorFirstName,
        lastName: book.authorLastName
      })),
      skipDuplicates: true
    });

    await prisma.$queryRaw`
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

    await prisma.$queryRaw`
      INSERT INTO "StockStatus" ("itemId", "quantity")
      VALUES ${Prisma.join(
        books.map(
          (book) => Prisma.sql`
          (
            ${Prisma.join([
              Prisma.sql`(SELECT "id" FROM "Book" WHERE "authorId" = (SELECT "id" FROM "Author" WHERE "firstName" = ${book.authorFirstName} AND "lastName" = ${book.authorLastName}) AND "name" = ${book.name})`,
              book.quantity
            ])}
          )`
        )
      )}
      ON CONFLICT ("itemId") DO UPDATE SET "quantity" = EXCLUDED.quantity`;
  }

  async patch({
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

  remove({ bookId }: { bookId: string }) {
    return prisma.book.delete({
      where: {
        id: bookId
      }
    });
  }

  readBooksFromCsv({ filePath }: { filePath: PathLike }) {
    return readDataFromCsvFile<{
      name: string;
      authorFirstName: string;
      authorLastName: string;
      quantity: number;
    }>(filePath, (data) => {
      return {
        ...data,
        quantity: parseInt(data.quantity, 10)
      };
    });
  }
}

export default BooksService;
