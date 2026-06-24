import { Request, Response } from 'express';
import { Size, Tier } from '../models';
import { createSearchRegex } from '../utils/searchText';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/errorHandler';

export const getSizes = asyncHandler(async (req: Request, res: Response) => {
  const { search, active } = req.query;
  const filter: Record<string, unknown> = {};

  if (active === 'true') {
    filter.isActive = true;
  }

  if (typeof search === 'string' && search.trim()) {
    filter.searchText = createSearchRegex(search);
  }

  const sizes = await Size.find(filter).sort({ sortOrder: 1 });
  res.json({ success: true, data: sizes });
});

export const getSizeById = asyncHandler(async (req: Request, res: Response) => {
  const size = await Size.findById(req.params.id);

  if (!size) {
    throw new AppError('Չափսը չի գտնվել', 404);
  }

  res.json({ success: true, data: size });
});

export const createSize = asyncHandler(async (req: Request, res: Response) => {
  const size = await Size.create(req.body);
  res.status(201).json({ success: true, data: size });
});

export const updateSize = asyncHandler(async (req: Request, res: Response) => {
  const size = await Size.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!size) {
    throw new AppError('Չափսը չի գտնվել', 404);
  }

  res.json({ success: true, data: size });
});

export const deleteSize = asyncHandler(async (req: Request, res: Response) => {
  const size = await Size.findByIdAndDelete(req.params.id);

  if (!size) {
    throw new AppError('Չափսը չի գտնվել', 404);
  }

  res.json({ success: true, message: 'Չափսը հաջողությամբ ջնջվել է' });
});

export const getTiers = asyncHandler(async (req: Request, res: Response) => {
  const { search, active } = req.query;
  const filter: Record<string, unknown> = {};

  if (active === 'true') {
    filter.isActive = true;
  }

  if (typeof search === 'string' && search.trim()) {
    filter.searchText = createSearchRegex(search);
  }

  const tiers = await Tier.find(filter).sort({ sortOrder: 1, level: 1 });
  res.json({ success: true, data: tiers });
});

export const getTierById = asyncHandler(async (req: Request, res: Response) => {
  const tier = await Tier.findById(req.params.id);

  if (!tier) {
    throw new AppError('Հարկը չի գտնվել', 404);
  }

  res.json({ success: true, data: tier });
});

export const createTier = asyncHandler(async (req: Request, res: Response) => {
  const tier = await Tier.create(req.body);
  res.status(201).json({ success: true, data: tier });
});

export const updateTier = asyncHandler(async (req: Request, res: Response) => {
  const tier = await Tier.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!tier) {
    throw new AppError('Հարկը չի գտնվել', 404);
  }

  res.json({ success: true, data: tier });
});

export const deleteTier = asyncHandler(async (req: Request, res: Response) => {
  const tier = await Tier.findByIdAndDelete(req.params.id);

  if (!tier) {
    throw new AppError('Հարկը չի գտնվել', 404);
  }

  res.json({ success: true, message: 'Հարկը հաջողությամբ ջնջվել է' });
});
