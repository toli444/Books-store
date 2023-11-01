import { injectable } from "inversify";
import { Request, Response } from "express";
import {
  bookIdSchema,
  createBookWithAuthorIdSchema,
  createBookWithAuthorInfoSchema,
  updateBookSchema,
  patchBookSchema
} from "./book.schema";
import BooksService from "./books.service";

@injectable()
class BooksController {
  private booksService: BooksService;

  public constructor(booksService: BooksService) {
    this.booksService = booksService;
  }
  public get = async (req: Request, res: Response) => {
    const books = await this.booksService.getMany();
    res.json(books);
  };

  public getOne = async (req: Request, res: Response) => {
    const data = bookIdSchema.parse(req.params);
    const book = await this.booksService.getOne(data);
    res.json(book);
  };

  public create = async (req: Request, res: Response) => {
    const data = createBookWithAuthorIdSchema.parse(req.body);
    const book = await this.booksService.createWithAuthorId(data);
    res.json(book);
  };

  public createWithAuthorInfo = async (req: Request, res: Response) => {
    const data = createBookWithAuthorInfoSchema.parse(req.body);
    const book = await this.booksService.createWithAuthorInfo(data);
    res.json(book);
  };

  public update = async (req: Request, res: Response) => {
    const data = updateBookSchema.parse(req.body);
    const book = await this.booksService.update(data);
    res.json(book);
  };

  public patch = async (req: Request, res: Response) => {
    const data = patchBookSchema.parse(req.body);
    const book = await this.booksService.patch(data);
    res.json(book);
  };

  public remove = async (req: Request, res: Response) => {
    const data = bookIdSchema.parse(req.params);
    const book = await this.booksService.remove(data);
    res.json(book);
  };
}

export default BooksController;
