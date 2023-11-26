import { Kafka, Producer, ProducerRecord } from 'kafkajs';
import { address as ipAddress } from 'ip';
import { injectable } from 'inversify';

const host = process.env.HOST_IP || ipAddress();

@injectable()
export default class ProducerService {
  private producer: Producer;

  constructor() {
    this.producer = this.createProducer();
  }

  init() {
    return this.producer.connect();
  }

  shutdown() {
    return this.producer.disconnect();
  }

  produce(record: ProducerRecord) {
    return this.producer.send(record);
  }

  private createProducer(): Producer {
    const kafka = new Kafka({
      clientId: 'books-store-events-processor',
      brokers: [`${host}:9092`]
    });

    return kafka.producer();
  }
}
