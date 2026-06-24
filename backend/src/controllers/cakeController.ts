import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/errorHandler';
import { parseId, parseOptionalId } from '../utils/parseId';
import { buildSearchWhere } from '../utils/searchFilter';
import { prepareCakeData } from '../utils/entityData';
import { serializeCake } from '../utils/serializers';

export const getCakes = asyncHandler(async (req: Request, res: Response) => {
  const { search, category, minPrice, maxPrice, featured, active } = req.query;
  const searchWhere = typeof search === 'string' ? buildSearchWhere(search) : undefined;
  const categoryId = typeof category === 'string' ? parseOptionalId(category) : undefined;

  const cakes = await prisma.cake.findMany({
    where: {
      ...(active === 'true' ? { isActive: true } : {}),
      ...(featured === 'true' ? { isFeatured: true } : {}),
      ...(categoryId !== undefined ? { categoryId } : {}),
      ...(searchWhere ?? {}),
      ...(minPrice || maxPrice
        ? {
            price: {
              ...(minPrice ? { gte: Number(minPrice) } : {}),
              ...(maxPrice ? { lte: Number(maxPrice) } : {}),
            },
          }
        : {}),
    },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  res.json({ success: true, data: cakes.map(serializeCake) });
});

export const getCakeById = asyncHandler(async (req: Request, res: Response) => {
  const cake = await prisma.cake.findUnique({
    where: { id: parseId(req.params.id) },
    include: { category: true },
  });

  if (!cake) {
    throw new AppError('Տորթը չի գտնվել', 404);
  }

  res.json({ success: true, data: serializeCake(cake) });
});

export const createCake = asyncHandler(async (req: Request, res: Response) => {
  const cake = await prisma.cake.create({
    data: prepareCakeData(req.body),
    include: { category: true },
  });

  res.status(201).json({ success: true, data: serializeCake(cake) });
});

export const updateCake = asyncHandler(async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  const data =
    req.body.name !== undefined ||
    req.body.title !== undefined ||
    req.body.description !== undefined
      ? prepareCakeData({ ...req.body, category: req.body.category ?? req.body.categoryId })
      : {
          isFeatured: req.body.isFeatured,
          isActive: req.body.isActive,
          price: req.body.price !== undefined ? Number(req.body.price) : undefined,
          images: req.body.images,
          ingredients: req.body.ingredients,
        };

  try {
    const cake = await prisma.cake.update({
      where: { id },
      data,
      include: { category: true },
    });

    res.json({ success: true, data: serializeCake(cake) });
  } catch {
    throw new AppError('Տորթը չի գտնվել', 404);
  }
});

export const deleteCake = asyncHandler(async (req: Request, res: Response) => {
  const id = parseId(req.params.id);

  try {
    await prisma.cake.delete({ where: { id } });
  } catch {
    throw new AppError('Տորթը չի գտնվել', 404);
  }

  res.json({ success: true, message: 'Տորթը հաջողությամբ ջնջվել է' });
});
