import {
  Consumer,
  ConsumerSubscribeTopics,
  Kafka,
  EachMessagePayload
} from 'kafkajs';
import { address as ipAddress } from 'ip';

const host = process.env.HOST_IP || ipAddress();

export default class OrderCreatedEventConsumer {
  private kafkaConsumer: Consumer;

  public constructor() {
    this.kafkaConsumer = this.createConsumer();
  }

  public async start() {
    const topic: ConsumerSubscribeTopics = {
      topics: ['order-created'],
      fromBeginning: false
    };

    try {
      await this.kafkaConsumer.connect();
      await this.kafkaConsumer.subscribe(topic);

      await this.kafkaConsumer.run({
        eachMessage: async (messagePayload: EachMessagePayload) => {
          const { topic, partition, message } = messagePayload;
          const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
          console.log(`NEW EVENT: ${prefix} ${message.key}#${message.value}`);
          // PROCESS HERE;
        }
      });
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  public async shutdown() {
    await this.kafkaConsumer.disconnect();
  }

  private createConsumer(): Consumer {
    const kafka = new Kafka({
      clientId: 'books-store-events-processor',
      brokers: [`${host}:9092`]
    });

    return kafka.consumer({ groupId: 'consumer-group' });
  }
}
