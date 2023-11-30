import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { PlaceOrderDto } from './dtos/place-order.dto';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { User, UserRoles } from '../users/types/user.type';
import { Request } from 'express';
import { convertStringToObjectId } from '../utils';

@Controller('me/orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {
    this.ordersService = ordersService;
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  get(@Req() req: Request) {
    const user = req.user as User;

    return this.ordersService.findAllForCustomer(user._id);
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  async getOne(@Req() req: Request, @Param('id') orderId: string) {
    const user = req.user as User;

    const order = await this.ordersService.findOne(
      convertStringToObjectId(orderId)
    );

    if (!order) {
      throw new NotFoundException();
    }

    if (user.role === UserRoles.ADMIN || user._id.equals(order.creator)) {
      return order;
    }

    throw new NotFoundException();
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  placeOrder(@Req() req: Request, @Body() placeOrderDto: PlaceOrderDto) {
    const user = req.user as User;

    return this.ordersService.placeOrder(user._id, placeOrderDto);
  }
}
