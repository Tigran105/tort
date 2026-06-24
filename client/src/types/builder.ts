import type { Size } from './catalog';

export interface BuilderNamedOption {
  _id: string;
  name: string;
}

export interface BuilderTier extends BuilderNamedOption {
  level: number;
}

export interface BuilderOptions {
  tiers: BuilderTier[];
  sizes: Size[];
  fillings: BuilderNamedOption[];
  fruits: BuilderNamedOption[];
  nuts: BuilderNamedOption[];
}

export interface CustomOrderPayload {
  orderType: 'custom';
  customer: {
    name: string;
    phone: string;
    email?: string;
  };
  customSelections: {
    tier: string;
    size: string;
    filling: string;
    fruit: string;
    nut: string;
  };
  deliveryDate?: string;
  notes?: string;
}
