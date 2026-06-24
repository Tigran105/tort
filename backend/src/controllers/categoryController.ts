import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/errorHandler';
import { parseId } from '../utils/parseId';
import { buildSearchWhere } from '../utils/searchFilter';
import { prepareNamedEntityData } from '../utils/entityData';
import { serializeCategory } from '../utils/serializers';

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const { search, active } = req.query;
  const searchWhere = typeof search === 'string' ? buildSearchWhere(search) : undefined;

  const categories = await prisma.category.findMany({
    where: {
      ...(active === 'true' ? { isActive: true } : {}),
      ...(searchWhere ?? {}),
    },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
  });

  res.json({ success: true, data: categories.map(serializeCategory) });
});

export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const category = await prisma.category.findUnique({
    where: { id: parseId(req.params.id) },
  });

  if (!category) {
    throw new AppError('Կատեգորիան չի գտնվել', 404);
  }

  res.json({ success: true, data: serializeCategory(category) });
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await prisma.category.create({
    data: prepareNamedEntityData(req.body),
  });

  res.status(201).json({ success: true, data: serializeCategory(category) });
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const id = parseId(req.params.id);
  const data =
    req.body.name !== undefined
      ? prepareNamedEntityData(req.body)
      : {
          sortOrder:
            req.body.sortOrder !== undefined ? Number(req.body.sortOrder) : undefined,
          isActive: req.body.isActive,
        };

  try {
    const category = await prisma.category.update({
      where: { id },
      data,
    });

    res.json({ success: true, data: serializeCategory(category) });
  } catch {
    throw new AppError('Կատեգորիան չի գտնվել', 404);
  }
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const id = parseId(req.params.id);

  try {
    await prisma.category.delete({ where: { id } });
  } catch {
    throw new AppError('Կատեգորիան չի գտնվել', 404);
  }

  res.json({ success: true, message: 'Կատեգորիան հաջողությամբ ջնջվել է' });
});
