import { Prisma } from "@prisma/client";
import { prisma } from "../server";

export function getOne({ bookId }: { bookId: number }) {
  return prisma.book.findUnique({
    where: {
      id: bookId
    },
    include: {
      author: true
    }
  });
}

export function getMany() {
  return prisma.book.findMany({
    include: {
      author: true
    }
  });
}

export function createWithAuthorInfo({
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

export function createWithAuthorId({
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

export function update({
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

export function patch({
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

export function remove({ bookId }: { bookId: number }) {
  return prisma.book.delete({
    where: {
      id: bookId
    }
  });
}
