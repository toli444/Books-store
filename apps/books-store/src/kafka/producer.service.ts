import {
  Injectable,
  OnApplicationShutdown,
  OnModuleInit
} from '@nestjs/common';
import { Kafka, Producer, ProducerRecord } from 'kafkajs';
import { address as ipAddress } from 'ip';

const host = process.env.HOST_IP || ipAddress();

@Injectable()
export class ProducerService implements OnModuleInit, OnApplicationShutdown {
  private producer: Producer;

  constructor() {
    this.producer = this.createProducer();
  }

  async onModuleInit() {
    await this.producer.connect();
  }

  async onApplicationShutdown() {
    await this.producer.disconnect();
  }

  public async produce(record: ProducerRecord) {
    await this.producer.send(record);
  }

  private createProducer(): Producer {
    const kafka = new Kafka({
      clientId: 'books-store-events-processor',
      brokers: [`${host}:9092`]
    });

    return kafka.producer();
  }
}
