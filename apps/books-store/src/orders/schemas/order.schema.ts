import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { OrderStatuses } from '../types/order.types';

export type OrderDocument = HydratedDocument<Order>;

@Schema()
export class Order {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  creator: Types.ObjectId;

  @Prop({ required: true })
  items: string[];

  @Prop({ type: String, enum: OrderStatuses, default: OrderStatuses.NEW })
  status: OrderStatuses;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
