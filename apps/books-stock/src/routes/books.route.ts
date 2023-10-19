/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import * as BooksController from "../controllers/books.controller";
import validate from "../middlewares/validation.middleware";
import {
  createBookWithAuthorInfoSchema,
  createBookWithAuthorIdSchema,
  getOneBookSchema
} from "../schema/book.schema";

const router = express.Router();

router
  .get("/", BooksController.get)
  .get("/:bookId", validate(getOneBookSchema), BooksController.getOne)
  .post("/", validate(createBookWithAuthorIdSchema), BooksController.create)
  .post(
    "/with-author-info",
    validate(createBookWithAuthorInfoSchema),
    BooksController.createWithAuthorInfo
  )
  .put("/:id", BooksController.update)
  .delete("/:id", BooksController.remove);

export default router;
