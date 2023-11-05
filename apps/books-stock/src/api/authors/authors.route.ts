/* eslint-disable @typescript-eslint/no-misused-promises */
import express from "express";
import { container } from "../../config/inversify.config";
import AuthorsController from "./authors.controller";

const router = express.Router();

const authorsController = container.get(AuthorsController);

router.get("/:authorId/books", authorsController.getBooks);

export default router;
