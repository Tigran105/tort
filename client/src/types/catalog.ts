export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface Size {
  _id: string;
  code: 'S' | 'M' | 'L';
  name: string;
  guestRange: string;
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
