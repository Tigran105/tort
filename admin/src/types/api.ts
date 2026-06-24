export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface NamedEntity {
  _id: string;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Category extends NamedEntity {}

export interface Fruit extends NamedEntity {}

export interface Nut extends NamedEntity {}

export interface Filling extends NamedEntity {}

export interface Size {
  _id: string;
  code: 'S' | 'M' | 'L';
  name: string;
  guestRange: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Tier {
  _id: string;
  level: 1 | 2 | 3;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Cake {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl?: string;
  category: Category | string;
  isFeatured: boolean;
  isActive: boolean;
}

export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type OrderType = 'custom' | 'catalog';

export interface OrderCustomer {
  name: string;
  phone: string;
  email?: string;
  address?: string;
}

export interface Order {
  _id: string;
  orderType: OrderType;
  customer: OrderCustomer;
  customSelections?: {
    tier?: NamedEntity;
    size?: Size;
    filling?: NamedEntity;
    fruit?: NamedEntity;
    nut?: NamedEntity;
  };
  cake?: Cake;
  quantity?: number;
  deliveryDate?: string;
  notes?: string;
  totalPrice?: number;
  status: OrderStatus;
  createdAt?: string;
}

export type NamedResourceKey = 'categories' | 'fruits' | 'nuts' | 'fillings';
