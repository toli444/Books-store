import { Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  get() {
    return this.ordersService.placeOrder(
      `${getRandomInt(100000)}`,
      `Hello ${getRandomInt(100000)}`
    );
  }
}
