import { Prisma } from "@prisma/client";
import { prisma } from "../server";

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
    data: {
      name,
      author: {
        connect: {
          id: authorId
        }
      }
    },
    include: {
      author: true
    }
  });
}
