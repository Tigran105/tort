import { prisma } from '../lib/prisma';
import type { Order } from '../generated/prisma/client';
import {
  buildCustomSelectionsResponse,
  parseStoredCustomSelections,
  serializeOrder,
} from '../utils/serializers';
import type { ApiOrder, StoredCustomSelections } from '../types/order';

async function loadSelectionLookups(selectionsList: StoredCustomSelections[]) {
  const tierIds = new Set<number>();
  const sizeIds = new Set<number>();
  const fillingIds = new Set<number>();
  const fruitIds = new Set<number>();
  const nutIds = new Set<number>();

  for (const selections of selectionsList) {
    tierIds.add(selections.tierId);
    sizeIds.add(selections.sizeId);
    fillingIds.add(selections.fillingId);
    fruitIds.add(selections.fruitId);
    nutIds.add(selections.nutId);
  }

  const [tiers, sizes, fillings, fruits, nuts] = await Promise.all([
    tierIds.size
      ? prisma.tier.findMany({ where: { id: { in: [...tierIds] } } })
      : [],
    sizeIds.size
      ? prisma.size.findMany({ where: { id: { in: [...sizeIds] } } })
      : [],
    fillingIds.size
      ? prisma.filling.findMany({ where: { id: { in: [...fillingIds] } } })
      : [],
    fruitIds.size
      ? prisma.fruit.findMany({ where: { id: { in: [...fruitIds] } } })
      : [],
    nutIds.size ? prisma.nut.findMany({ where: { id: { in: [...nutIds] } } }) : [],
  ]);

  return {
    tiers: new Map(tiers.map((item) => [item.id, item])),
    sizes: new Map(sizes.map((item) => [item.id, item])),
    fillings: new Map(fillings.map((item) => [item.id, item])),
    fruits: new Map(fruits.map((item) => [item.id, item])),
    nuts: new Map(nuts.map((item) => [item.id, item])),
  };
}

export async function enrichOrders(orders: Order[]): Promise<ApiOrder[]> {
  const storedSelections = orders
    .map((order) => parseStoredCustomSelections(order.customSelections))
    .filter((value): value is StoredCustomSelections => value !== null);

  const cakeIds = orders
    .map((order) => order.cakeId)
    .filter((id): id is number => id !== null);

  const [lookup, cakes] = await Promise.all([
    loadSelectionLookups(storedSelections),
    cakeIds.length
      ? prisma.cake.findMany({
          where: { id: { in: cakeIds } },
          select: { id: true, title: true },
        })
      : [],
  ]);

  const cakeMap = new Map(cakes.map((cake) => [cake.id, cake]));

  return orders.map((order) => {
    const stored = parseStoredCustomSelections(order.customSelections);
    const customSelections = stored
      ? buildCustomSelectionsResponse(stored, lookup)
      : undefined;
    const cake = order.cakeId ? cakeMap.get(order.cakeId) ?? null : null;

    return serializeOrder(order, customSelections, cake);
  });
}

export async function enrichOrder(order: Order): Promise<ApiOrder> {
  const [result] = await enrichOrders([order]);
  return result;
}
