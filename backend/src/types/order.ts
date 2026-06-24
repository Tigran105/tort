export type OrderType = 'custom' | 'catalog';
export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface OrderCustomer {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface StoredCustomSelections {
  tierId: number;
  sizeId: number;
  fillingId: number;
  fruitId: number;
  nutId: number;
}

export interface ApiCustomSelections {
  tier?: { _id: string; name: string; level?: number };
  size?: { _id: string; name: string; code?: string; guestRange?: string };
  filling?: { _id: string; name: string };
  fruit?: { _id: string; name: string };
  nut?: { _id: string; name: string };
}

export interface ApiCakeSummary {
  _id: string;
  name: string;
}

export interface ApiOrder {
  _id: string;
  orderType: OrderType;
  customer: OrderCustomer;
  customSelections?: ApiCustomSelections;
  cake?: ApiCakeSummary;
  quantity?: number;
  deliveryDate?: Date;
  notes?: string | null;
  totalPrice?: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}
