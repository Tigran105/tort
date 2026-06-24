import { Model } from 'mongoose';
import { Request, Response } from 'express';
import { createSearchRegex } from '../utils/searchText';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/errorHandler';

interface NamedDocument {
  _id: unknown;
  name: string;
  searchText?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export function createNamedAttributeController<T extends NamedDocument>(
  Model: Model<T>,
  notFoundMessage: string,
) {
  const getAll = asyncHandler(async (req: Request, res: Response) => {
    const { search, active } = req.query;
    const filter: Record<string, unknown> = {};

    if (active === 'true') {
      filter.isActive = true;
    }

    if (typeof search === 'string' && search.trim()) {
      filter.searchText = createSearchRegex(search);
    }

    const items = await Model.find(filter).sort({ sortOrder: 1, name: 1 });
    res.json({ success: true, data: items });
  });

  const getById = asyncHandler(async (req: Request, res: Response) => {
    const item = await Model.findById(req.params.id);

    if (!item) {
      throw new AppError(notFoundMessage, 404);
    }

    res.json({ success: true, data: item });
  });

  const create = asyncHandler(async (req: Request, res: Response) => {
    const item = await Model.create(req.body);
    res.status(201).json({ success: true, data: item });
  });

  const update = asyncHandler(async (req: Request, res: Response) => {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      throw new AppError(notFoundMessage, 404);
    }

    res.json({ success: true, data: item });
  });

  const remove = asyncHandler(async (req: Request, res: Response) => {
    const item = await Model.findByIdAndDelete(req.params.id);

    if (!item) {
      throw new AppError(notFoundMessage, 404);
    }

    res.json({ success: true, message: 'Հաջողությամբ ջնջվել է' });
  });

  return { getAll, getById, create, update, remove };
}
