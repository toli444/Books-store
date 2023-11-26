import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConsumerService } from '../kafka/consumer.service';
import { ProducerService } from '../kafka/producer.service';

@Injectable()
export class OrdersService implements OnModuleInit {
  constructor(
    private readonly consumerService: ConsumerService,
    private readonly producerService: ProducerService
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

  placeOrder(orderId: string, order = 'Hello') {
    return this.producerService.produce({
      topic: 'order-created',
      messages: [{ key: orderId, value: order }]
    });
  }
}
