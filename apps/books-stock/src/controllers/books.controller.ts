import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../server";
export async function get(req: Request, res: Response) {
  try {
    const books = await prisma.book.findMany();
    res.status(200).json(books);
  } catch (e) {
    res.status(500).json({ error: e });
  }
}

export async function getOne(req: Request, res: Response) {}

const createUserAndPost = (name: string, author: string) => {
  return Prisma.validator<Prisma.BookCreateInput>()({
    name,
    author: {
      connectOrCreate: {
        where: {
          name: author
        },
        create: {
          name: author
        }
      }
    }
  });
};

export async function create(req: Request, res: Response) {}

export async function update(req: Request, res: Response) {}

export async function remove(req: Request, res: Response) {}
