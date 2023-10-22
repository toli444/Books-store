import { Container } from "inversify";
import BooksController from "./controllers/books.controller";
import BooksService from "./services/books.service";

export const container = new Container();

container.bind<BooksService>(BooksService).toSelf();
container.bind<BooksController>(BooksController).toSelf();
