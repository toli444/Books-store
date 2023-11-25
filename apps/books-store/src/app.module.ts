import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { BooksModule } from './books/books.module';
import { KafkaModule } from './kafka/kafka.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    UsersModule,
    BooksModule,
    KafkaModule,
    OrdersModule
  ]
})
export class AppModule {}
