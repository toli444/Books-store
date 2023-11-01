/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import { container } from "../../inversify.config";
import BooksController from "./books.controller";
import { authorize } from "../../middlewares/auth.middleware";
import { UserRoles } from "../auth/auth.types";

const router = express.Router();

const booksController = container.get(BooksController);

router
  .get("/", booksController.get)
  .get("/:bookId", booksController.getOne)
  .post("/", authorize(UserRoles.CUSTOMER), booksController.create)
  .post(
    "/with-author-info",
    authorize(UserRoles.CUSTOMER),
    booksController.createWithAuthorInfo
  )
  .put("/:bookId", authorize(UserRoles.CUSTOMER), booksController.update)
  .patch("/:bookId", authorize(UserRoles.CUSTOMER), booksController.patch)
  .delete("/:bookId", authorize(UserRoles.CUSTOMER), booksController.remove);

export default router;
