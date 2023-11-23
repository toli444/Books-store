import { Kafka, Producer } from 'kafkajs';
import { address as ipAddress } from 'ip';

const host = process.env.HOST_IP || ipAddress();
export default class OrderProcessedEventProducer {
  private producer: Producer;

  constructor() {
    this.producer = this.createProducer();
  }

  public async start() {
    try {
      await this.producer.connect();
    } catch (error) {
      console.log('Error connecting the producer: ', error);
    }
  }

  public async shutdown() {
    await this.producer.disconnect();
  }

  public async sendOrderProcessedEvent(orderId: string, order = 'Hello') {
    await this.producer.send({
      topic: 'order-created',
      messages: [{ key: orderId, value: order }]
    });
  }

  private createProducer(): Producer {
    const kafka = new Kafka({
      clientId: 'books-store-events-processor',
      brokers: [`${host}:9092`]
    });

    return kafka.producer();
  }
}
