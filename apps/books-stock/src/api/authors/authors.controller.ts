import { injectable } from 'inversify';
import { Request, Response } from 'express';
import { authorIdSchema } from './author.schema';
import AuthorsService from './authors.service';

@injectable()
class AuthorsController {
  private authorsService: AuthorsService;

  public constructor(authorsService: AuthorsService) {
    this.authorsService = authorsService;
  }
  public getBooks = async (req: Request, res: Response) => {
    const data = authorIdSchema.parse(req.params);
    const books = await this.authorsService.getBooks(data);
    res.json(books);
  };
}

export default AuthorsController;
