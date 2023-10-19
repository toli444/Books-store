import { Request, Response } from "express";
import {
  CreateBookWithAuthorInfoInput,
  CreateBookWithAuthorIdInput,
  BookIdInput,
  UpdateBookInput,
  PatchBookInput
} from "../schema/book.schema";
import * as booksService from "../services/books.service";

export async function get(req: Request, res: Response) {
  const books = await booksService.getMany();
  res.json(books);
}

export async function getOne(
  req: Request,
  res: Response<unknown, BookIdInput>
) {
  const book = await booksService.getOne(res.locals);
  res.json(book);
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

export async function update(
  req: Request,
  res: Response<unknown, UpdateBookInput>
) {
  const book = await booksService.updateBook(res.locals);
  res.json(book);
}

export async function patch(
  req: Request,
  res: Response<unknown, PatchBookInput>
) {
  const book = await booksService.patchBook(res.locals);
  res.json(book);
}

export async function remove(
  req: Request,
  res: Response<unknown, BookIdInput>
) {
  const book = await booksService.remove(res.locals);
  res.json(book);
}
