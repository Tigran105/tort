import type {
  Category,
  Cake,
  Filling,
  Fruit,
  Nut,
  Order,
  Size,
  Tier,
} from '../generated/prisma/client';
import type {
  ApiCustomSelections,
  ApiOrder,
  OrderCustomer,
  StoredCustomSelections,
} from '../types/order';

function toDecimal(value: { toString(): string } | number | null | undefined): number | undefined {
  if (value === null || value === undefined) {
    return undefined;
  }

  return Number(value);
}

export function serializeNamedEntity(entity: {
  id: number;
  name: string;
  slug: string;
  sortOrder: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}) {
  return {
    _id: String(entity.id),
    name: entity.name,
    slug: entity.slug,
    sortOrder: entity.sortOrder,
    isActive: entity.isActive,
    ...(entity.createdAt ? { createdAt: entity.createdAt.toISOString() } : {}),
    ...(entity.updatedAt ? { updatedAt: entity.updatedAt.toISOString() } : {}),
  };
}

export function serializeCategory(category: Category) {
  return serializeNamedEntity(category);
}

export function serializeFruit(fruit: Fruit) {
  return {
    ...serializeNamedEntity(fruit),
    priceModifier: toDecimal(fruit.priceModifier) ?? 0,
  };
}

export function serializeNut(nut: Nut) {
  return {
    ...serializeNamedEntity(nut),
    priceModifier: toDecimal(nut.priceModifier) ?? 0,
  };
}

export function serializeFilling(filling: Filling) {
  return {
    ...serializeNamedEntity(filling),
    description: filling.description ?? undefined,
  };
}

export function serializeSize(size: Size) {
  return {
    _id: String(size.id),
    code: size.code,
    name: size.name,
    guestRange: size.guestsCount,
    slug: size.slug,
    sortOrder: size.sortOrder,
    isActive: size.isActive,
    basePrice: toDecimal(size.basePrice) ?? 0,
    ...(size.createdAt ? { createdAt: size.createdAt.toISOString() } : {}),
    ...(size.updatedAt ? { updatedAt: size.updatedAt.toISOString() } : {}),
  };
}

export function serializeTier(tier: Tier) {
  return {
    _id: String(tier.id),
    level: tier.count as 1 | 2 | 3,
    name: tier.name,
    slug: tier.slug,
    sortOrder: tier.sortOrder,
    isActive: tier.isActive,
    priceMultiplier: toDecimal(tier.priceMultiplier) ?? 1,
    ...(tier.createdAt ? { createdAt: tier.createdAt.toISOString() } : {}),
    ...(tier.updatedAt ? { updatedAt: tier.updatedAt.toISOString() } : {}),
  };
}

export function serializeCake(cake: Cake & { category?: Category | null }) {
  const images = Array.isArray(cake.images) ? (cake.images as string[]) : [];

  return {
    _id: String(cake.id),
    name: cake.title,
    slug: cake.slug,
    description: cake.description,
    price: toDecimal(cake.price) ?? 0,
    imageUrl: images[0],
    images,
    ingredients: cake.ingredients ?? undefined,
    category: cake.category
      ? serializeCategory(cake.category)
      : String(cake.categoryId),
    isFeatured: cake.isFeatured,
    isActive: cake.isActive,
    createdAt: cake.createdAt.toISOString(),
    updatedAt: cake.updatedAt.toISOString(),
  };
}

export function parseStoredCustomSelections(
  value: unknown,
): StoredCustomSelections | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const record = value as Record<string, unknown>;

  if (
    typeof record.tierId !== 'number' ||
    typeof record.sizeId !== 'number' ||
    typeof record.fillingId !== 'number' ||
    typeof record.fruitId !== 'number' ||
    typeof record.nutId !== 'number'
  ) {
    return null;
  }

  return {
    tierId: record.tierId,
    sizeId: record.sizeId,
    fillingId: record.fillingId,
    fruitId: record.fruitId,
    nutId: record.nutId,
  };
}

export function buildCustomSelectionsResponse(
  stored: StoredCustomSelections,
  lookup: {
    tiers: Map<number, Tier>;
    sizes: Map<number, Size>;
    fillings: Map<number, Filling>;
    fruits: Map<number, Fruit>;
    nuts: Map<number, Nut>;
  },
): ApiCustomSelections {
  const tier = lookup.tiers.get(stored.tierId);
  const size = lookup.sizes.get(stored.sizeId);
  const filling = lookup.fillings.get(stored.fillingId);
  const fruit = lookup.fruits.get(stored.fruitId);
  const nut = lookup.nuts.get(stored.nutId);

  return {
    tier: tier
      ? { _id: String(tier.id), name: tier.name, level: tier.count }
      : undefined,
    size: size
      ? {
          _id: String(size.id),
          name: size.name,
          code: size.code,
          guestRange: size.guestsCount,
        }
      : undefined,
    filling: filling
      ? { _id: String(filling.id), name: filling.name }
      : undefined,
    fruit: fruit ? { _id: String(fruit.id), name: fruit.name } : undefined,
    nut: nut ? { _id: String(nut.id), name: nut.name } : undefined,
  };
}

export function serializeOrder(
  order: Order,
  customSelections?: ApiCustomSelections,
  cake?: { id: number; title: string } | null,
): ApiOrder {
  const customer = order.userContactInfo as unknown as OrderCustomer;

  return {
    _id: String(order.id),
    orderType: order.orderType,
    customer,
    customSelections,
    cake: cake ? { _id: String(cake.id), name: cake.title } : undefined,
    quantity: order.quantity ?? undefined,
    deliveryDate: order.deliveryDate ?? undefined,
    notes: order.notes,
    totalPrice: toDecimal(order.totalPrice),
    status: order.status,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}
