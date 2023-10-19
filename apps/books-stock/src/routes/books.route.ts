/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import * as BooksController from "../controllers/books.controller";
import validate from "../middlewares/validation.middleware";
import {
  createBookWithAuthorInfoSchema,
  createBookWithAuthorIdSchema,
  bookIdSchema,
  updateBookSchema,
  patchBookSchema
} from "../schema/book.schema";

const router = express.Router();

router
  .get("/", BooksController.get)
  .get("/:bookId", validate(bookIdSchema), BooksController.getOne)
  .post("/", validate(createBookWithAuthorIdSchema), BooksController.create)
  .post(
    "/with-author-info",
    validate(createBookWithAuthorInfoSchema),
    BooksController.createWithAuthorInfo
  )
  .put("/:bookId", validate(updateBookSchema), BooksController.update)
  .patch("/:bookId", validate(patchBookSchema), BooksController.patch)
  .delete("/:bookId", validate(bookIdSchema), BooksController.remove);

export default router;
