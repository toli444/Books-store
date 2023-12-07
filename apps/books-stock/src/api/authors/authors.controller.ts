import { injectable } from 'inversify';
import { Request, Response } from 'express';
import AuthorsService from './authors.service';

@injectable()
class AuthorsController {
  private authorsService: AuthorsService;

  constructor(authorsService: AuthorsService) {
    this.authorsService = authorsService;
  }
  getBooks = async (req: Request, res: Response) => {
    const books = await this.authorsService.getBooks({
      authorId: req.params.authorId
    });
    res.json(books);
  };
}

export default AuthorsController;
