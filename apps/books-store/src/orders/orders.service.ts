import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from '../kafka/consumer.service';
import { ProducerService } from '../kafka/producer.service';
import { PlaceOrderDto } from './dtos/place-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
        // UPDATE ORDER STATUS

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

  findOne(orderId: Types.ObjectId) {
    return this.orderModel.findById(orderId);
  }

  findAllForCustomer(customerId: Types.ObjectId) {
    return this.orderModel.find({ creator: { _id: customerId } });
  }

  async placeOrder(customerId: Types.ObjectId, placeOrderDto: PlaceOrderDto) {
    const createdOrder = new this.orderModel({
      creator: customerId,
      ...placeOrderDto
    });

    const order = await createdOrder.save();

    await this.producerService.produce({
      topic: 'order-created',
      messages: [
        {
          key: order._id.toString(),
          value: JSON.stringify({
            id: order._id,
            status: order.status,
            items: order.items
          })
        }
      ]
    });

    return order;
  }
}
