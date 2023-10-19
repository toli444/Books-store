import { NextFunction, Request, Response } from "express";
import { prisma } from "../server";
import {
  CreateBookWithAuthorInfoInput,
  CreateBookWithAuthorIdInput,
  GetOneBookInput
} from "../schema/book.schema";
import * as booksService from "../services/books.service";
import { AppError } from "../utils/AppError";

export async function get(req: Request, res: Response) {
  const books = await prisma.book.findMany({
    include: {
      author: true
    }
  });
  res.json(books);
}

export async function getOne(
  req: Request,
  res: Response<unknown, GetOneBookInput>
) {
  const books = await prisma.book.findUnique({
    where: {
      id: res.locals.bookId
    },
    include: {
      author: true
    }
  });
  res.json(books);
}

export async function create(
  req: Request,
  res: Response<unknown, CreateBookWithAuthorIdInput>
) {
  const book = await booksService.createWithAuthorId(res.locals);
  res.json(book);
}

export async function createWithAuthorInfo(
  req: Request,
  res: Response<unknown, CreateBookWithAuthorInfoInput>
) {
  const book = await booksService.createWithAuthorInfo(res.locals);
  res.json(book);
}

export async function update(req: Request, res: Response) {}

export async function remove(req: Request, res: Response) {}
