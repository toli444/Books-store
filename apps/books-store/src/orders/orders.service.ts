import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from '../kafka/consumer.service';
import { ProducerService } from '../kafka/producer.service';
import { PlaceOrderDto } from './dtos/place-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';

@Injectable()
export class OrdersService implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly producerService: ProducerService,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>
  ) {}

  async onModuleInit() {
    await this.consumerService.consume(
      { topics: ['order-processed'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          console.log({
            value: message.value.toString(),
            offset: message.offset.toString(),
            timestamp: message.timestamp.toString(),
            topic: topic.toString(),
            partition: partition.toString()
          });
        }
      }
    );
  }

  async placeOrder(placeOrderDto: PlaceOrderDto) {
    // const createdOrder = new this.orderModel(placeOrderDto);
    //
    // return createdOrder.save();
    // return this.producerService.produce({
    //   topic: 'order-created',
    //   messages: [{ key: orderId, value: order }]
    // });
  }
}
