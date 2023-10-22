import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import {
  CreateBookWithAuthorInfoInput,
  CreateBookWithAuthorIdInput,
  BookIdInput,
  UpdateBookInput,
  PatchBookInput
} from "../schema/book.schema";
import BooksService from "../services/books.service";

@injectable()
class BooksController {
  private booksService: BooksService;

  public constructor(@inject(BooksService) booksService: BooksService) {
    this.booksService = booksService;
  }
  public get = async (req: Request, res: Response) => {
    const books = await this.booksService.getMany();
    res.json(books);
  };

  public getOne = async (req: Request, res: Response<unknown, BookIdInput>) => {
    const book = await this.booksService.getOne(res.locals);
    res.json(book);
  };

  public create = async (
    req: Request,
    res: Response<unknown, CreateBookWithAuthorIdInput>
  ) => {
    const book = await this.booksService.createWithAuthorId(res.locals);
    res.json(book);
  };

  public createWithAuthorInfo = async (
    req: Request,
    res: Response<unknown, CreateBookWithAuthorInfoInput>
  ) => {
    const book = await this.booksService.createWithAuthorInfo(res.locals);
    res.json(book);
  };

  public update = async (
    req: Request,
    res: Response<unknown, UpdateBookInput>
  ) => {
    const book = await this.booksService.update(res.locals);
    res.json(book);
  };

  public patch = async (
    req: Request,
    res: Response<unknown, PatchBookInput>
  ) => {
    const book = await this.booksService.patch(res.locals);
    res.json(book);
  };

  public remove = async (req: Request, res: Response<unknown, BookIdInput>) => {
    const book = await this.booksService.remove(res.locals);
    res.json(book);
  };
}

export default BooksController;
