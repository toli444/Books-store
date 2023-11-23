import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as process from 'process';
import OrderCreatedEventProducer from './orders/orderCreated.eventProducer';
import OrderProcessedEventConsumer from './orders/orderProcessed.eventConsumer';

const orderProcessedEventConsumer = new OrderProcessedEventConsumer();
const orderCreatedEventProducer = new OrderCreatedEventProducer();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  );

  await orderProcessedEventConsumer.start();
  await orderCreatedEventProducer.start();

  await app.listen(process.env.PORT);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
