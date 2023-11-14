import { app, prisma } from './server';

async function start() {
  await prisma.$connect();

  app.listen(process.env.PORT, () => {
    // console.log(`Server running at http://localhost:${port}`);
  });
}

start().catch(async (e) => {
  console.error(e);
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
