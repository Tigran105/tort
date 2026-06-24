import { Request, Response } from 'express';
import { Category } from '../models';
import { createSearchRegex } from '../utils/searchText';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/errorHandler';

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const { search, active } = req.query;
  const filter: Record<string, unknown> = {};

  if (active === 'true') {
    filter.isActive = true;
  }

  if (typeof search === 'string' && search.trim()) {
    filter.searchText = createSearchRegex(search);
  }

  const categories = await Category.find(filter).sort({ sortOrder: 1, name: 1 });
  res.json({ success: true, data: categories });
});

export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    throw new AppError('Կատեգորիան չի գտնվել', 404);
  }

  res.json({ success: true, data: category });
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.create(req.body);
  res.status(201).json({ success: true, data: category });
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    throw new AppError('Կատեգորիան չի գտնվել', 404);
  }

  res.json({ success: true, data: category });
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  if (!category) {
    throw new AppError('Կատեգորիան չի գտնվել', 404);
  }

  res.json({ success: true, message: 'Կատեգորիան հաջողությամբ ջնջվել է' });
});
