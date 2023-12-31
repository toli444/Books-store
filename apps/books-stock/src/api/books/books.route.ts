/* eslint-disable @typescript-eslint/no-misused-promises */
import express from 'express';
import BooksController from './books.controller';
import { authorize } from '../../middlewares/auth.middleware';
import { UserRoles } from '../auth/auth.types';
import { container } from '../../config/inversify.config';
import { upload } from '../../config/multer.config';

const router = express.Router();

const booksController = container.get(BooksController);

router
  .get('/', booksController.findAll)
  .get('/:bookId', booksController.findOne)
  .post('/', authorize(UserRoles.ADMIN), booksController.create)
  .post(
    '/with-author-info',
    authorize(UserRoles.ADMIN),
    booksController.createWithAuthorInfo
  )
  .post(
    '/from-csv',
    authorize(UserRoles.ADMIN),
    upload.single('file'),
    booksController.createFromCSV
  )
  .patch('/:bookId', authorize(UserRoles.ADMIN), booksController.patch)
  .delete('/:bookId', authorize(UserRoles.ADMIN), booksController.remove);

export default router;
