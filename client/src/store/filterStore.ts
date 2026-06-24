import { create } from 'zustand';
import type { CatalogFilters } from '@/types';

interface FilterState {
  filters: CatalogFilters;
  setCategoryId: (categoryId: string | null) => void;
  setSizeId: (sizeId: string | null) => void;
  setMinPrice: (minPrice: number | null) => void;
  setMaxPrice: (maxPrice: number | null) => void;
  setSearch: (search: string) => void;
  resetFilters: () => void;
}

const initialFilters: CatalogFilters = {
  categoryId: null,
  sizeId: null,
  minPrice: null,
  maxPrice: null,
  search: '',
};

export const useFilterStore = create<FilterState>((set) => ({
  filters: initialFilters,
  setCategoryId: (categoryId) =>
    set((state) => ({
      filters: { ...state.filters, categoryId },
    })),
  setSizeId: (sizeId) =>
    set((state) => ({
      filters: { ...state.filters, sizeId },
    })),
  setMinPrice: (minPrice) =>
    set((state) => ({
      filters: { ...state.filters, minPrice },
    })),
  setMaxPrice: (maxPrice) =>
    set((state) => ({
      filters: { ...state.filters, maxPrice },
    })),
  setSearch: (search) =>
    set((state) => ({
      filters: { ...state.filters, search },
    })),
  resetFilters: () => set({ filters: initialFilters }),
}));
