'use client';

import { useEffect, useState } from 'react';
import type { Category, Size } from '@/types/catalog';
import { getCategories, getSizes } from '@/lib/catalog';
import { useFilterStore } from '@/store/filterStore';
import { ui } from '@/constants/ui';

export default function CatalogFilters() {
  const { filters, setCategoryId, setSizeId, setMinPrice, setMaxPrice, setSearch, resetFilters } =
    useFilterStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);

  useEffect(() => {
    Promise.all([getCategories(), getSizes()])
      .then(([categoriesData, sizesData]) => {
        setCategories(categoriesData);
        setSizes(sizesData);
      })
      .catch(() => {
        setCategories([]);
        setSizes([]);
      });
  }, []);

  return (
    <div className="rounded-2xl border border-rose-100 bg-white p-4 shadow-sm sm:p-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <label className="flex flex-col gap-2 text-sm font-medium text-stone-700">
          {ui.search}
          <input
            type="search"
            value={filters.search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={ui.searchPlaceholder}
            className="rounded-xl border border-stone-200 px-3 py-2 outline-none ring-rose-200 focus:ring"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-stone-700">
          {ui.category}
          <select
            value={filters.categoryId ?? ''}
            onChange={(event) => setCategoryId(event.target.value || null)}
            className="rounded-xl border border-stone-200 px-3 py-2 outline-none ring-rose-200 focus:ring"
          >
            <option value="">{ui.allCategories}</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-stone-700">
          {ui.size}
          <select
            value={filters.sizeId ?? ''}
            onChange={(event) => setSizeId(event.target.value || null)}
            className="rounded-xl border border-stone-200 px-3 py-2 outline-none ring-rose-200 focus:ring"
          >
            <option value="">{ui.selectSize}</option>
            {sizes.map((size) => (
              <option key={size._id} value={size._id}>
                {size.name} ({size.guestRange})
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-stone-700">
          {ui.minPrice}
          <input
            type="number"
            min={0}
            value={filters.minPrice ?? ''}
            onChange={(event) =>
              setMinPrice(event.target.value ? Number(event.target.value) : null)
            }
            className="rounded-xl border border-stone-200 px-3 py-2 outline-none ring-rose-200 focus:ring"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-stone-700">
          {ui.maxPrice}
          <input
            type="number"
            min={0}
            value={filters.maxPrice ?? ''}
            onChange={(event) =>
              setMaxPrice(event.target.value ? Number(event.target.value) : null)
            }
            className="rounded-xl border border-stone-200 px-3 py-2 outline-none ring-rose-200 focus:ring"
          />
        </label>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={resetFilters}
          className="rounded-full px-4 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
        >
          {ui.resetFilters}
        </button>
      </div>
    </div>
  );
}
