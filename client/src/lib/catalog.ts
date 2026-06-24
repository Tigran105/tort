import type { CatalogFilters } from '@/types';
import type { Cake, Category, Size } from '@/types/catalog';
import { fetchApi } from './api';

export async function getCategories(): Promise<Category[]> {
  return fetchApi<Category[]>('/categories?active=true');
}

export async function getSizes(): Promise<Size[]> {
  return fetchApi<Size[]>('/sizes?active=true');
}

export function buildCakesQuery(filters: CatalogFilters): string {
  const params = new URLSearchParams({ active: 'true' });

  if (filters.categoryId) {
    params.set('category', filters.categoryId);
  }
  if (filters.minPrice !== null) {
    params.set('minPrice', String(filters.minPrice));
  }
  if (filters.maxPrice !== null) {
    params.set('maxPrice', String(filters.maxPrice));
  }
  if (filters.search.trim()) {
    params.set('search', filters.search.trim());
  }

  return `/cakes?${params.toString()}`;
}

export async function getCakes(filters: CatalogFilters): Promise<Cake[]> {
  return fetchApi<Cake[]>(buildCakesQuery(filters));
}

export function getCategoryName(cake: Cake): string {
  if (typeof cake.category === 'string') {
    return '—';
  }
  return cake.category.name;
}
