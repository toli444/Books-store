import { app, prisma } from './server';
import {
  orderProcessedEventProducer,
  orderCreatedEventConsumer
} from './config/kafka.config';

async function start() {
  await prisma.$connect();
  await orderCreatedEventConsumer.start();
  await orderProcessedEventProducer.start();

  app.listen(process.env.PORT, () => {
    // console.log(`Server running at http://localhost:${port}`);
  });
}

start().catch(async (e) => {
  console.error(e);
  await orderCreatedEventConsumer.shutdown();
  await orderProcessedEventProducer.shutdown();
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
