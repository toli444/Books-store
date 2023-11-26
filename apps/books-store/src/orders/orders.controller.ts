import { Body, Controller, Post } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PlaceOrderDto } from './dtos/place-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  placeOrder(@Body() placeOrderDto: PlaceOrderDto) {
    return this.ordersService.placeOrder(placeOrderDto);
  }
}
