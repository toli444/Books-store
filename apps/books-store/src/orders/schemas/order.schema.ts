import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from '../../users/schemas/user.schema';
import { OrderStatuses } from '../types/order.types';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  customer: User;

  @Prop()
  items: string[];

  @Prop({ type: String, enum: OrderStatuses, default: OrderStatuses.NEW })
  status: OrderStatuses;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
