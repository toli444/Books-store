import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PlaceOrderDto } from './dtos/place-order.dto';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { User } from '../users/types/user.type';
import { Request } from 'express';

@Controller('/me/orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  get(@Req() req: Request) {
    const user = req.user as User;

    return this.ordersService.findAllForCustomer(user._id);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  getOne(@Req() req: Request) {
    const user = req.user as User;

    return this.ordersService.findAllForCustomer(user._id);
  }

  @Post()
  placeOrder(@Body() placeOrderDto: PlaceOrderDto) {
    return this.ordersService.placeOrder(placeOrderDto);
  }
}
