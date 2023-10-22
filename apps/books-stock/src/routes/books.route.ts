/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import validate from "../middlewares/validation.middleware";
import {
  createBookWithAuthorInfoSchema,
  createBookWithAuthorIdSchema,
  bookIdSchema,
  updateBookSchema,
  patchBookSchema
} from "../schema/book.schema";
import { container } from "../inversify.config";
import BooksController from "../controllers/books.controller";

const router = express.Router();

const booksController = container.get<BooksController>(BooksController);

router
  .get("/", booksController.get)
  .get("/:bookId", validate(bookIdSchema), booksController.getOne)
  .post("/", validate(createBookWithAuthorIdSchema), booksController.create)
  .post(
    "/with-author-info",
    validate(createBookWithAuthorInfoSchema),
    booksController.createWithAuthorInfo
  )
  .put("/:bookId", validate(updateBookSchema), booksController.update)
  .patch("/:bookId", validate(patchBookSchema), booksController.patch)
  .delete("/:bookId", validate(bookIdSchema), booksController.remove);

export default router;
