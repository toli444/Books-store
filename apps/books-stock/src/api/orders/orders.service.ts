import { injectable } from 'inversify';
import ConsumerService from '../../kafka/consumer.service';
import ProducerService from '../../kafka/producer.service';

@injectable()
class OrdersService {
  private consumerService: ConsumerService;

  private producerService: ProducerService;

  public constructor(
    consumerService: ConsumerService,
    producerService: ProducerService
  ) {
    this.consumerService = consumerService;
    this.producerService = producerService;
  }

  async init() {
    await this.consumerService.consume(
      { topics: ['order-created'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          console.log({
            value: message.value?.toString(),
            offset: message.offset.toString(),
            timestamp: message.timestamp.toString(),
            topic: topic.toString(),
            partition: partition.toString()
          });
        }
      }
    );
  }

  processOrder(orderId: string, order = 'Hello') {
    return this.producerService.produce({
      topic: 'order-processed',
      messages: [{ key: orderId, value: order }]
    });
  }
}

export default OrdersService;
