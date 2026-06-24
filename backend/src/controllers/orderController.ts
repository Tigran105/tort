import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/errorHandler';
import { parseId, parseOptionalId } from '../utils/parseId';
import { mapIncomingCustomSelections } from '../utils/entityData';
import {
  serializeFilling,
  serializeFruit,
  serializeNut,
  serializeSize,
  serializeTier,
} from '../utils/serializers';
import { enrichOrder, enrichOrders } from '../services/orderEnrichment';
import { notifyNewOrder } from '../services/notificationService';
import type { OrderStatus } from '../types/order';

export const getBuilderOptions = asyncHandler(async (_req: Request, res: Response) => {
  const [tiers, sizes, fillings, fruits, nuts] = await Promise.all([
    prisma.tier.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { count: 'asc' }],
    }),
    prisma.size.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.filling.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    }),
    prisma.fruit.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    }),
    prisma.nut.findMany({
      where: { isActive: true },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    }),
  ]);

  res.json({
    success: true,
    data: {
      tiers: tiers.map(serializeTier),
      sizes: sizes.map(serializeSize),
      fillings: fillings.map(serializeFilling),
      fruits: fruits.map(serializeFruit),
      nuts: nuts.map(serializeNut),
    },
  });
});

export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const { status, orderType } = req.query;

  const orders = await prisma.order.findMany({
    where: {
      ...(typeof status === 'string' && status.trim() ? { status: status as OrderStatus } : {}),
      ...(typeof orderType === 'string' && orderType.trim()
        ? { orderType: orderType as 'custom' | 'catalog' }
        : {}),
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ success: true, data: await enrichOrders(orders) });
});

export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const order = await prisma.order.findUnique({
    where: { id: parseId(req.params.id) },
  });

  if (!order) {
    throw new AppError('Պատվերը չի գտնվել', 404);
  }

  res.json({ success: true, data: await enrichOrder(order) });
});

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { orderType, customer, customSelections, cake, quantity, deliveryDate, notes, totalPrice } =
    req.body;

  if (!orderType || !customer?.name || !customer?.phone) {
    throw new AppError('Պարտադիր դաշտերը լրացված չեն', 400);
  }

  if (orderType === 'custom') {
    const selectionLabels: Record<string, string> = {
      tier: 'հարկ',
      size: 'չափս',
      filling: 'միջուկ',
      fruit: 'մրգեր',
      nut: 'ընդեղեն',
    };

    for (const [field, label] of Object.entries(selectionLabels)) {
      if (!customSelections?.[field as keyof typeof customSelections]) {
        throw new AppError(`Ընտրեք ${label}ը`, 400);
      }
    }
  }

  if (orderType === 'catalog' && !cake) {
    throw new AppError('Ընտրեք տորթ', 400);
  }

  const order = await prisma.order.create({
    data: {
      orderType,
      userContactInfo: customer,
      customSelections:
        orderType === 'custom'
          ? mapIncomingCustomSelections(customSelections)
          : undefined,
      cakeId: orderType === 'catalog' ? parseOptionalId(cake) : undefined,
      quantity: quantity !== undefined ? Number(quantity) : undefined,
      deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined,
      notes,
      totalPrice: totalPrice !== undefined ? Number(totalPrice) : undefined,
    },
  });

  const populatedOrder = await enrichOrder(order);
  await notifyNewOrder(populatedOrder);

  res.status(201).json({ success: true, data: populatedOrder });
});

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body as { status?: OrderStatus };
  const allowedStatuses: OrderStatus[] = [
    'pending',
    'confirmed',
    'completed',
    'cancelled',
  ];

  if (!status || !allowedStatuses.includes(status)) {
    throw new AppError('Սխալ կարգավիճակ', 400);
  }

  try {
    const order = await prisma.order.update({
      where: { id: parseId(req.params.id) },
      data: { status },
    });

    res.json({ success: true, data: await enrichOrder(order) });
  } catch {
    throw new AppError('Պատվերը չի գտնվել', 404);
  }
});
