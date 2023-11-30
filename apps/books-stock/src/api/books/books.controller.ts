import { injectable } from 'inversify';
import { Request, Response } from 'express';
import {
  createBookWithAuthorIdSchema,
  createBookWithAuthorInfoSchema,
  patchBookSchema
} from './book.schema';
import BooksService from './books.service';
import { AppError, HttpStatusCode } from '../../utils/AppError';
import fs from 'fs';
import path from 'path';

@injectable()
class BooksController {
  private booksService: BooksService;

  public constructor(booksService: BooksService) {
    this.booksService = booksService;
  }
  public findAll = async (req: Request, res: Response) => {
    const books = await this.booksService.findAll();
    res.json(books);
  };

  public findOne = async (req: Request, res: Response) => {
    const book = await this.booksService.findOne({
      bookId: req.params.bookId
    });
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

  public createFromCSV = async (req: Request, res: Response) => {
    if (!req.file) {
      throw new AppError({
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: 'Please upload a CSV file.'
      });
    }

    const filePath = path.join(req.file.destination, req.file.filename);
    const fileName = req.file.originalname;
    const csvData = await this.booksService.readBooksFromCsv({ filePath });

    await this.booksService.createMany(csvData);

    fs.unlinkSync(filePath);

    res.status(HttpStatusCode.OK).send({
      message: `Upload/import the CSV data into database successfully: ${fileName}`
    });
  };

  public patch = async (req: Request, res: Response) => {
    const data = patchBookSchema.parse(req.body);
    const book = await this.booksService.patch({
      bookId: req.params.bookId,
      ...data
    });
    res.json(book);
  };

  public remove = async (req: Request, res: Response) => {
    const book = await this.booksService.remove({ bookId: req.params.bookId });
    res.json(book);
  };
}

export default BooksController;
