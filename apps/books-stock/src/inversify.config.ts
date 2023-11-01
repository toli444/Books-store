import { Container } from "inversify";
import BooksController from "./api/books/books.controller";
import BooksService from "./api/books/books.service";
import AuthController from "./api/auth/auth.controller";
import UsersService from "./api/users/users.service";
import JwtStrategy from "./api/auth/jwt.strategy";

export const container = new Container({ skipBaseClassChecks: true });

container.bind<BooksService>(BooksService).toSelf();
container.bind<BooksController>(BooksController).toSelf();
container.bind<AuthController>(AuthController).toSelf();
container.bind<UsersService>(UsersService).toSelf();
container.bind<JwtStrategy>(JwtStrategy).toSelf();
