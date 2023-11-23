import OrderCreatedEventConsumer from '../orders/orderCreated.eventConsumer';
import OrderProcessedEventProducer from '../orders/orderProcessed.eventProducer';

export const orderCreatedEventConsumer = new OrderCreatedEventConsumer();
export const orderProcessedEventProducer = new OrderProcessedEventProducer();
