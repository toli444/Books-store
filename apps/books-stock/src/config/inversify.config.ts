import { Container } from 'inversify';
import BooksController from '../api/books/books.controller';
import BooksService from '../api/books/books.service';
import AuthController from '../api/auth/auth.controller';
import UsersService from '../api/users/users.service';
import JwtStrategy from '../api/auth/jwt.strategy';
import AuthorsController from '../api/authors/authors.controller';
import AuthorsService from '../api/authors/authors.service';
import ProducerService from '../kafka/producer.service';
import ConsumerService from '../kafka/consumer.service';
import OrdersService from '../api/orders/orders.service';

export const container = new Container({ skipBaseClassChecks: true });

container.bind<BooksController>(BooksController).toSelf();
container.bind<BooksService>(BooksService).toSelf();
container.bind<AuthController>(AuthController).toSelf();
container.bind<UsersService>(UsersService).toSelf();
container.bind<JwtStrategy>(JwtStrategy).toSelf();
container.bind<AuthorsController>(AuthorsController).toSelf();
container.bind<AuthorsService>(AuthorsService).toSelf();
container.bind<ConsumerService>(ConsumerService).toSelf().inSingletonScope();
container.bind<ProducerService>(ProducerService).toSelf().inSingletonScope();
container.bind<OrdersService>(OrdersService).toSelf().inSingletonScope();
