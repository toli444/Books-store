import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { ConsumerService } from '../kafka/consumer.service';
import { ProducerService } from '../kafka/producer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }])
  ],
  providers: [OrdersService, ConsumerService, ProducerService],
  controllers: [OrdersController]
})
export class OrdersModule {}
