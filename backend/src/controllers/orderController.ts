import { Request, Response } from 'express';
import {
  Filling,
  Fruit,
  Nut,
  Order,
  OrderStatus,
  Size,
  Tier,
} from '../models';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/errorHandler';
import { notifyNewOrder } from '../services/notificationService';

export const getBuilderOptions = asyncHandler(async (_req: Request, res: Response) => {
  const [tiers, sizes, fillings, fruits, nuts] = await Promise.all([
    Tier.find({ isActive: true }).sort({ sortOrder: 1, level: 1 }),
    Size.find({ isActive: true }).sort({ sortOrder: 1 }),
    Filling.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }),
    Fruit.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }),
    Nut.find({ isActive: true }).sort({ sortOrder: 1, name: 1 }),
  ]);

  res.json({
    success: true,
    data: { tiers, sizes, fillings, fruits, nuts },
  });
});

export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const { status, orderType } = req.query;
  const filter: Record<string, unknown> = {};

  if (typeof status === 'string' && status.trim()) {
    filter.status = status;
  }

  if (typeof orderType === 'string' && orderType.trim()) {
    filter.orderType = orderType;
  }

  const orders = await Order.find(filter)
    .populate('customSelections.tier')
    .populate('customSelections.size')
    .populate('customSelections.filling')
    .populate('customSelections.fruit')
    .populate('customSelections.nut')
    .populate('cake')
    .sort({ createdAt: -1 });

  res.json({ success: true, data: orders });
});

export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id)
    .populate('customSelections.tier')
    .populate('customSelections.size')
    .populate('customSelections.filling')
    .populate('customSelections.fruit')
    .populate('customSelections.nut')
    .populate('cake');

  if (!order) {
    throw new AppError('Պատվերը չի գտնվել', 404);
  }

  res.json({ success: true, data: order });
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

  const order = await Order.create({
    orderType,
    customer,
    customSelections: orderType === 'custom' ? customSelections : undefined,
    cake: orderType === 'catalog' ? cake : undefined,
    quantity,
    deliveryDate,
    notes,
    totalPrice,
  });

  const populatedOrder = await Order.findById(order._id)
    .populate('customSelections.tier')
    .populate('customSelections.size')
    .populate('customSelections.filling')
    .populate('customSelections.fruit')
    .populate('customSelections.nut')
    .populate('cake');

  if (populatedOrder) {
    await notifyNewOrder(populatedOrder);
  }

  res.status(201).json({ success: true, data: populatedOrder ?? order });
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

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true },
  )
    .populate('customSelections.tier')
    .populate('customSelections.size')
    .populate('customSelections.filling')
    .populate('customSelections.fruit')
    .populate('customSelections.nut')
    .populate('cake');

  if (!order) {
    throw new AppError('Պատվերը չի գտնվել', 404);
  }

  res.json({ success: true, data: order });
});
