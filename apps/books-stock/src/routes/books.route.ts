/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import * as BooksController from "../controllers/books.controller";

const router = express.Router();

router.get("/", BooksController.get);
router.get("/:id", BooksController.getOne);
router.post("/", BooksController.create);
router.put("/:id", BooksController.update);
router.delete("/:id", BooksController.remove);

export default router;
