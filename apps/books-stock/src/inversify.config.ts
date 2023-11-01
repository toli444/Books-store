import { Container } from "inversify";
import BooksController from "./api/books/books.controller";
import BooksService from "./api/books/books.service";
import AuthController from "./api/auth/auth.controller";
import UsersService from "./api/users/users.service";

export const container = new Container();

container.bind<BooksService>(BooksService).toSelf();
container.bind<BooksController>(BooksController).toSelf();
container.bind<AuthController>(AuthController).toSelf();
container.bind<UsersService>(UsersService).toSelf();
