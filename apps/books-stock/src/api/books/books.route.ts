/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import { container } from "../../inversify.config";
import BooksController from "./books.controller";
import { authorize } from "../../middlewares/auth.middleware";
import { UserRoles } from "../auth/auth.types";
import { upload } from "../../multer";

const router = express.Router();

const booksController = container.get(BooksController);

router
  .get("/", booksController.get)
  .get("/:bookId", booksController.getOne)
  .post("/", authorize(UserRoles.ADMIN), booksController.create)
  .post(
    "/with-author-info",
    authorize(UserRoles.ADMIN),
    booksController.createWithAuthorInfo
  )
  .post(
    "/from-csv",
    authorize(UserRoles.ADMIN),
    upload.single("file"),
    booksController.createFromCSV
  )
  .put("/:bookId", authorize(UserRoles.ADMIN), booksController.update)
  .patch("/:bookId", authorize(UserRoles.ADMIN), booksController.patch)
  .delete("/:bookId", authorize(UserRoles.ADMIN), booksController.remove);

export default router;
