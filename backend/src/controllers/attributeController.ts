import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../middleware/errorHandler';
import { parseId } from '../utils/parseId';
import { buildSearchWhere } from '../utils/searchFilter';
import { prepareNamedEntityData } from '../utils/entityData';
import {
  serializeFilling,
  serializeFruit,
  serializeNut,
} from '../utils/serializers';

type NamedAttributeModel = 'fruit' | 'nut' | 'filling';

function buildListWhere(search: unknown, active: unknown) {
  const searchWhere =
    typeof search === 'string' ? buildSearchWhere(search) : undefined;

  return {
    ...(active === 'true' ? { isActive: true } : {}),
    ...(searchWhere ?? {}),
  };
}

export function createNamedAttributeController(
  model: NamedAttributeModel,
  notFoundMessage: string,
) {
  const getAll = asyncHandler(async (req: Request, res: Response) => {
    const where = buildListWhere(req.query.search, req.query.active);

    if (model === 'fruit') {
      const items = await prisma.fruit.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      });
      res.json({ success: true, data: items.map(serializeFruit) });
      return;
    }

    if (model === 'nut') {
      const items = await prisma.nut.findMany({
        where,
        orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
      });
      res.json({ success: true, data: items.map(serializeNut) });
      return;
    }

    const items = await prisma.filling.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
    res.json({ success: true, data: items.map(serializeFilling) });
  });

  const getById = asyncHandler(async (req: Request, res: Response) => {
    const id = parseId(req.params.id);

    if (model === 'fruit') {
      const item = await prisma.fruit.findUnique({ where: { id } });
      if (!item) throw new AppError(notFoundMessage, 404);
      res.json({ success: true, data: serializeFruit(item) });
      return;
    }

    if (model === 'nut') {
      const item = await prisma.nut.findUnique({ where: { id } });
      if (!item) throw new AppError(notFoundMessage, 404);
      res.json({ success: true, data: serializeNut(item) });
      return;
    }

    const item = await prisma.filling.findUnique({ where: { id } });
    if (!item) throw new AppError(notFoundMessage, 404);
    res.json({ success: true, data: serializeFilling(item) });
  });

  const create = asyncHandler(async (req: Request, res: Response) => {
    const data = prepareNamedEntityData(req.body);

    if (model === 'fruit') {
      const item = await prisma.fruit.create({ data });
      res.status(201).json({ success: true, data: serializeFruit(item) });
      return;
    }

    if (model === 'nut') {
      const item = await prisma.nut.create({ data });
      res.status(201).json({ success: true, data: serializeNut(item) });
      return;
    }

    const item = await prisma.filling.create({ data });
    res.status(201).json({ success: true, data: serializeFilling(item) });
  });

  const update = asyncHandler(async (req: Request, res: Response) => {
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
      if (model === 'fruit') {
        const item = await prisma.fruit.update({ where: { id }, data });
        res.json({ success: true, data: serializeFruit(item) });
        return;
      }

      if (model === 'nut') {
        const item = await prisma.nut.update({ where: { id }, data });
        res.json({ success: true, data: serializeNut(item) });
        return;
      }

      const item = await prisma.filling.update({ where: { id }, data });
      res.json({ success: true, data: serializeFilling(item) });
    } catch {
      throw new AppError(notFoundMessage, 404);
    }
  });

  const remove = asyncHandler(async (req: Request, res: Response) => {
    const id = parseId(req.params.id);

    try {
      if (model === 'fruit') {
        await prisma.fruit.delete({ where: { id } });
      } else if (model === 'nut') {
        await prisma.nut.delete({ where: { id } });
      } else {
        await prisma.filling.delete({ where: { id } });
      }
    } catch {
      throw new AppError(notFoundMessage, 404);
    }

    res.json({ success: true, message: 'Հաջողությամբ ջնջվել է' });
  });

  return { getAll, getById, create, update, remove };
}
