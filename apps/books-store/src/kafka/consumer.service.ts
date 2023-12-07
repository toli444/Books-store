import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import {
  Consumer,
  ConsumerSubscribeTopics,
  Kafka,
  ConsumerRunConfig
} from 'kafkajs';
import { address as ipAddress } from 'ip';
import { v4 as uuid } from 'uuid';

const host = process.env.HOST_IP || ipAddress();

@Injectable()
export class ConsumerService implements OnApplicationShutdown {
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

  private createConsumer(): Consumer {
    const kafka = new Kafka({
      clientId: 'books-store-events-processor',
      brokers: [`${host}:9092`]
    });

    return kafka.consumer({ groupId: `books-${uuid()}` });
  }

  async onApplicationShutdown() {
    await Promise.all(this.consumers.map((consumer) => consumer.disconnect()));
  }
}
