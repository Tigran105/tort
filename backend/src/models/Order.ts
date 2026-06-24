import { Schema, model, Document, Types } from 'mongoose';

export type OrderType = 'custom' | 'catalog';
export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface IOrderCustomer {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface ICustomSelections {
  tier: Types.ObjectId;
  size: Types.ObjectId;
  filling: Types.ObjectId;
  fruit: Types.ObjectId;
  nut: Types.ObjectId;
}

export interface IOrder extends Document {
  orderType: OrderType;
  customer: IOrderCustomer;
  customSelections?: ICustomSelections;
  cake?: Types.ObjectId;
  quantity?: number;
  deliveryDate?: Date;
  notes?: string;
  totalPrice?: number;
  status: OrderStatus;
}

const orderSchema = new Schema<IOrder>(
  {
    orderType: {
      type: String,
      required: true,
      enum: ['custom', 'catalog'],
    },
    customer: {
      name: { type: String, required: true, trim: true },
      phone: { type: String, required: true, trim: true },
      email: { type: String, trim: true },
      address: { type: String, trim: true },
    },
    customSelections: {
      tier: { type: Schema.Types.ObjectId, ref: 'Tier' },
      size: { type: Schema.Types.ObjectId, ref: 'Size' },
      filling: { type: Schema.Types.ObjectId, ref: 'Filling' },
      fruit: { type: Schema.Types.ObjectId, ref: 'Fruit' },
      nut: { type: Schema.Types.ObjectId, ref: 'Nut' },
    },
    cake: { type: Schema.Types.ObjectId, ref: 'Cake' },
    quantity: { type: Number, min: 1 },
    deliveryDate: { type: Date },
    notes: { type: String, trim: true },
    totalPrice: { type: Number, min: 0 },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
  },
  { timestamps: true },
);

export const Order = model<IOrder>('Order', orderSchema);
