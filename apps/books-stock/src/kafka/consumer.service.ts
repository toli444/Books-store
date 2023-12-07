import {
  Consumer,
  ConsumerSubscribeTopics,
  Kafka,
  ConsumerRunConfig
} from 'kafkajs';
import { address as ipAddress } from 'ip';
import { injectable } from 'inversify';
import { v4 as uuid } from 'uuid';

const host = process.env.HOST_IP || ipAddress();

@injectable()
export default class ConsumerService {
  private readonly consumers: Consumer[];

  constructor() {
    this.consumers = [];
  }

  async consume(topics: ConsumerSubscribeTopics, config: ConsumerRunConfig) {
    const consumer = this.createConsumer();
    await consumer.connect();
    await consumer.subscribe(topics);
    await consumer.run(config);
    this.consumers.push(consumer);
  }

  shutdown() {
    return Promise.all(this.consumers.map((consumer) => consumer.disconnect()));
  }

  private createConsumer(): Consumer {
    const kafka = new Kafka({
      clientId: 'books-store-events-processor',
      brokers: [`${host}:9092`]
    });

    return kafka.consumer({ groupId: `books-${uuid()}` });
  }
}
