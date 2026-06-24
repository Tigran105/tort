import { buildSearchText, slugify } from './searchText';
import { parseOptionalId } from './parseId';
import { AppError } from '../middleware/errorHandler';

export function prepareNamedEntityData(body: Record<string, unknown>) {
  const name = String(body.name ?? '').trim();

  if (!name) {
    throw new AppError('Անվանումը պարտադիր է', 400);
  }

  return {
    name,
    slug: slugify(name),
    searchText: buildSearchText(name),
    sortOrder: Number(body.sortOrder ?? 0),
    isActive: body.isActive !== false,
  };
}

export function prepareSizeData(body: Record<string, unknown>) {
  const code = String(body.code ?? '').trim() as 'S' | 'M' | 'L';
  const name = String(body.name ?? '').trim();
  const guestRange = String(body.guestRange ?? body.guestsCount ?? '').trim();

  if (!code || !name || !guestRange) {
    throw new AppError('Պարտադիր դաշտերը լրացված չեն', 400);
  }

  return {
    code,
    name,
    guestsCount: guestRange,
    slug: slugify(`${code}-${name}`),
    searchText: buildSearchText(code, name, guestRange),
    sortOrder: Number(body.sortOrder ?? 0),
    isActive: body.isActive !== false,
    basePrice: Number(body.basePrice ?? 0),
  };
}

export function prepareTierData(body: Record<string, unknown>) {
  const level = Number(body.level ?? body.count);
  const name = String(body.name ?? '').trim();

  if (![1, 2, 3].includes(level) || !name) {
    throw new AppError('Պարտադիր դաշտերը լրացված չեն', 400);
  }

  return {
    count: level,
    name,
    slug: slugify(name),
    searchText: buildSearchText(name, String(level)),
    sortOrder: Number(body.sortOrder ?? 0),
    isActive: body.isActive !== false,
    priceMultiplier: Number(body.priceMultiplier ?? 1),
  };
}

export function prepareCakeData(body: Record<string, unknown>) {
  const name = String(body.name ?? body.title ?? '').trim();
  const description = String(body.description ?? '').trim();
  const categoryId = parseOptionalId(body.category ?? body.categoryId);

  if (!name || !description || categoryId === undefined) {
    throw new AppError('Պարտադիր դաշտերը լրացված չեն', 400);
  }

  const imageUrl = body.imageUrl ? String(body.imageUrl) : undefined;
  const images = Array.isArray(body.images)
    ? body.images
    : imageUrl
      ? [imageUrl]
      : [];

  return {
    title: name,
    description,
    price: Number(body.price ?? 0),
    images,
    ingredients: body.ingredients ?? undefined,
    categoryId,
    slug: slugify(name),
    searchText: buildSearchText(name, description),
    isFeatured: body.isFeatured === true,
    isActive: body.isActive !== false,
  };
}

export function mapIncomingCustomSelections(body: Record<string, unknown>) {
  const tierId = parseOptionalId(body.tier);
  const sizeId = parseOptionalId(body.size);
  const fillingId = parseOptionalId(body.filling);
  const fruitId = parseOptionalId(body.fruit);
  const nutId = parseOptionalId(body.nut);

  if (!tierId || !sizeId || !fillingId || !fruitId || !nutId) {
    throw new AppError('Ընտրեք բոլոր տարբերակները', 400);
  }

  return { tierId, sizeId, fillingId, fruitId, nutId };
}
