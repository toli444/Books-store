import { app, prisma } from './server';
import { container } from './config/inversify.config';
import ProducerService from './kafka/producer.service';
import ConsumerService from './kafka/consumer.service';
import OrdersService from './api/orders/orders.service';

const producerService = container.get(ProducerService);
const consumerService = container.get(ConsumerService);
const ordersService = container.get(OrdersService);

async function start() {
  await prisma.$connect();
  await producerService.init();
  await ordersService.init();

  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
  });
}

start().catch(async (e) => {
  console.error(e);
  await producerService.shutdown();
  await consumerService.shutdown();
  await prisma.$disconnect();
  process.exit(1);
});

process.on('uncaughtException', (error, origin) => {
  console.log('Uncaught exception:\n');
  console.log(error);
  console.log('Exception origin:\n');
  console.log(origin);
});
process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at:\n');
  console.log(promise);
  console.log('Reason:\n');
  console.log(reason);
});
