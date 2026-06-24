import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/errorHandler';
import { parseId } from '../utils/parseId';
import { buildSearchWhere } from '../utils/searchFilter';
import { prepareSizeData, prepareTierData } from '../utils/entityData';
import { serializeSize, serializeTier } from '../utils/serializers';

export const getSizes = asyncHandler(async (req: Request, res: Response) => {
  const { search, active } = req.query;
  const searchWhere = typeof search === 'string' ? buildSearchWhere(search) : undefined;

  const sizes = await prisma.size.findMany({
    where: {
      ...(active === 'true' ? { isActive: true } : {}),
      ...(searchWhere ?? {}),
    },
    orderBy: { sortOrder: 'asc' },
  });

  res.json({ success: true, data: sizes.map(serializeSize) });
});

export const getSizeById = asyncHandler(async (req: Request, res: Response) => {
  const size = await prisma.size.findUnique({
    where: { id: parseId(req.params.id) },
  });

  if (!size) {
    throw new AppError('Չափսը չի գտնվել', 404);
  }

  res.json({ success: true, data: serializeSize(size) });
});

export const createSize = asyncHandler(async (req: Request, res: Response) => {
  const size = await prisma.size.create({
    data: prepareSizeData(req.body),
  });

  res.status(201).json({ success: true, data: serializeSize(size) });
});

export const updateSize = asyncHandler(async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  const data =
    req.body.code !== undefined ||
    req.body.name !== undefined ||
    req.body.guestRange !== undefined
      ? prepareSizeData(req.body)
      : {
          sortOrder:
            req.body.sortOrder !== undefined ? Number(req.body.sortOrder) : undefined,
          isActive: req.body.isActive,
          basePrice: req.body.basePrice !== undefined ? Number(req.body.basePrice) : undefined,
        };

  try {
    const size = await prisma.size.update({
      where: { id },
      data,
    });

    res.json({ success: true, data: serializeSize(size) });
  } catch {
    throw new AppError('Չափսը չի գտնվել', 404);
  }
});

export const deleteSize = asyncHandler(async (req: Request, res: Response) => {
  const id = parseId(req.params.id);

  try {
    await prisma.size.delete({ where: { id } });
  } catch {
    throw new AppError('Չափսը չի գտնվել', 404);
  }

  res.json({ success: true, message: 'Չափսը հաջողությամբ ջնջվել է' });
});

export const getTiers = asyncHandler(async (req: Request, res: Response) => {
  const { search, active } = req.query;
  const searchWhere = typeof search === 'string' ? buildSearchWhere(search) : undefined;

  const tiers = await prisma.tier.findMany({
    where: {
      ...(active === 'true' ? { isActive: true } : {}),
      ...(searchWhere ?? {}),
    },
    orderBy: [{ sortOrder: 'asc' }, { count: 'asc' }],
  });

  res.json({ success: true, data: tiers.map(serializeTier) });
});

export const getTierById = asyncHandler(async (req: Request, res: Response) => {
  const tier = await prisma.tier.findUnique({
    where: { id: parseId(req.params.id) },
  });

  if (!tier) {
    throw new AppError('Հարկը չի գտնվել', 404);
  }

  res.json({ success: true, data: serializeTier(tier) });
});

export const createTier = asyncHandler(async (req: Request, res: Response) => {
  const tier = await prisma.tier.create({
    data: prepareTierData(req.body),
  });

  res.status(201).json({ success: true, data: serializeTier(tier) });
});

export const updateTier = asyncHandler(async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  const data =
    req.body.level !== undefined || req.body.name !== undefined
      ? prepareTierData(req.body)
      : {
          sortOrder:
            req.body.sortOrder !== undefined ? Number(req.body.sortOrder) : undefined,
          isActive: req.body.isActive,
          priceMultiplier:
            req.body.priceMultiplier !== undefined
              ? Number(req.body.priceMultiplier)
              : undefined,
        };

  try {
    const tier = await prisma.tier.update({
      where: { id },
      data,
    });

    res.json({ success: true, data: serializeTier(tier) });
  } catch {
    throw new AppError('Հարկը չի գտնվել', 404);
  }
});

export const deleteTier = asyncHandler(async (req: Request, res: Response) => {
  const id = parseId(req.params.id);

  try {
    await prisma.tier.delete({ where: { id } });
  } catch {
    throw new AppError('Հարկը չի գտնվել', 404);
  }

  res.json({ success: true, message: 'Հարկը հաջողությամբ ջնջվել է' });
});
