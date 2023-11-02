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
import * as csv from "fast-csv";
import fs from "fs";
import { AppError, HttpStatusCode } from "../../utils/AppError";

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

  public createFromCSV = (req: Request, res: Response) => {
    if (!req.file) {
      throw new AppError({
        statusCode: HttpStatusCode.BAD_REQUEST,
        message: "Please upload a CSV file."
      });
    }

    const csvData: Array<{ name: string; authorId: number }> = [];
    const filePath = __basedir + "/uploads/" + req.file.filename;
    const fileName = req.file.originalname;

    fs.createReadStream(filePath)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => {
        throw error.message;
      })
      .on("data", ({ name, authorId }: { name: string; authorId: string }) => {
        csvData.push({ name, authorId: parseInt(authorId, 10) });
      })
      .on("end", () => {
        // insertMany csvData
        void this.booksService.createMany(csvData).then(() => {
          res.status(HttpStatusCode.OK).send({
            message: `Upload/import the CSV data into database successfully: ${fileName}`
          });
        });
      });
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
