import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ConsumerService } from '../kafka/consumer.service';
import { ProducerService } from '../kafka/producer.service';

@Module({
  providers: [OrdersService, ConsumerService, ProducerService],
  controllers: [OrdersController]
})
export class OrdersModule {}
