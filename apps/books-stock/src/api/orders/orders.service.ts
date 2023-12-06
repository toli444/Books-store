import { injectable } from 'inversify';
import ConsumerService from '../../kafka/consumer.service';
import ProducerService from '../../kafka/producer.service';
import BooksService from '../books/books.service';
import { AppError, HttpStatusCode } from '../../utils/AppError';
import { Order } from './order.type';
import { prisma } from '../../server';

@injectable()
class OrdersService {
  private consumerService: ConsumerService;

  private producerService: ProducerService;

  private booksService: BooksService;

  public constructor(
    consumerService: ConsumerService,
    producerService: ProducerService,
    booksService: BooksService
  ) {
    this.consumerService = consumerService;
    this.producerService = producerService;
    this.booksService = booksService;
  }

  async init() {
    await this.consumerService.consume(
      { topics: ['order-created'] },
      {
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const order = JSON.parse(message.value?.toString() || '');

            console.log('NEW ORDER CREATED: ', {
              value: order,
              offset: message.offset.toString(),
              timestamp: message.timestamp.toString(),
              topic: topic.toString(),
              partition: partition.toString()
            });

            await this.processOrder(order);
          } catch (e) {
            throw new AppError({
              statusCode: HttpStatusCode.BAD_REQUEST,
              message: 'Can not process order.'
            });
          }
        }
      }
    );
  }

  async decrementQuantityOfItems(itemsIds: Array<string>) {
    return prisma.stockStatus.updateMany({
      where: {
        id: { in: itemsIds }
      },
      data: {
        quantity: {
          decrement: 1
        }
      }
    });
  }

  async processOrder(order: Order) {
    const orderedBooks = await this.booksService.findByIds(order.items);

    if (
      orderedBooks.length !== order.items.length ||
      orderedBooks.some(
        (orderedBook) =>
          !orderedBook.stockStatus || orderedBook.stockStatus.quantity === 0
      )
    ) {
      return this.producerService.produce({
        topic: 'order-processed',
        messages: [
          {
            key: order.id,
            value: JSON.stringify({
              id: order.id,
              items: order.items,
              status: 'DECLINED',
              message: 'Some of the ordered products are missing.'
            })
          }
        ]
      });
    }

    await this.decrementQuantityOfItems(
      orderedBooks.map((orderedBooks) => orderedBooks.stockStatus!.id)
    );

    await this.producerService.produce({
      topic: 'order-processed',
      messages: [
        {
          key: order.id,
          value: JSON.stringify({
            id: order.id,
            items: order.items,
            status: 'PROCESSED'
          })
        }
      ]
    });
  }
}

export default OrdersService;
