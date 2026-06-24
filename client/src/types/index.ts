export type BuilderStep = 'tier' | 'size' | 'filling' | 'fruit-nut' | 'summary';

export interface BuilderSelections {
  tierId: string | null;
  sizeId: string | null;
  fillingId: string | null;
  fruitId: string | null;
  nutId: string | null;
}

export interface BuilderContact {
  name: string;
  phone: string;
  email: string;
  deliveryDate: string;
  notes: string;
}

export interface CatalogFilters {
  categoryId: string | null;
  sizeId: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  search: string;
}

export const BUILDER_STEPS: BuilderStep[] = [
  'tier',
  'size',
  'filling',
  'fruit-nut',
  'summary',
];

export const BUILDER_STEP_LABELS: Record<BuilderStep, string> = {
  tier: 'Հարկեր',
  size: 'Չափսեր',
  filling: 'Միջուկ',
  'fruit-nut': 'Մրգեր / Ընդեղեն',
  summary: 'Ամփոփում և կոնտակտներ',
};
