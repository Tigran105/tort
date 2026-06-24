import { Request, Response } from 'express';
import { Cake } from '../models';
import { createSearchRegex } from '../utils/searchText';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/errorHandler';

export const getCakes = asyncHandler(async (req: Request, res: Response) => {
  const { search, category, minPrice, maxPrice, featured, active } = req.query;
  const filter: Record<string, unknown> = {};

  if (active === 'true') {
    filter.isActive = true;
  }

  if (typeof category === 'string' && category.trim()) {
    filter.category = category;
  }

  if (featured === 'true') {
    filter.isFeatured = true;
  }

  if (typeof search === 'string' && search.trim()) {
    filter.searchText = createSearchRegex(search);
  }

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) {
      (filter.price as Record<string, number>).$gte = Number(minPrice);
    }
    if (maxPrice) {
      (filter.price as Record<string, number>).$lte = Number(maxPrice);
    }
  }

  const cakes = await Cake.find(filter)
    .populate('category', 'name slug')
    .sort({ createdAt: -1 });

  res.json({ success: true, data: cakes });
});

export const getCakeById = asyncHandler(async (req: Request, res: Response) => {
  const cake = await Cake.findById(req.params.id).populate('category', 'name slug');

  if (!cake) {
    throw new AppError('Տորթը չի գտնվել', 404);
  }

  res.json({ success: true, data: cake });
});

export const createCake = asyncHandler(async (req: Request, res: Response) => {
  const cake = await Cake.create(req.body);
  res.status(201).json({ success: true, data: cake });
});

export const updateCake = asyncHandler(async (req: Request, res: Response) => {
  const cake = await Cake.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('category', 'name slug');

  if (!cake) {
    throw new AppError('Տորթը չի գտնվել', 404);
  }

  res.json({ success: true, data: cake });
});

export const deleteCake = asyncHandler(async (req: Request, res: Response) => {
  const cake = await Cake.findByIdAndDelete(req.params.id);

  if (!cake) {
    throw new AppError('Տորթը չի գտնվել', 404);
  }

  res.json({ success: true, message: 'Տորթը հաջողությամբ ջնջվել է' });
});
