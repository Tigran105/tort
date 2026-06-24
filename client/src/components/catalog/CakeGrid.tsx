'use client';

import { useEffect, useState } from 'react';
import type { Cake } from '@/types/catalog';
import { getCakes, getCategoryName } from '@/lib/catalog';
import { useFilterStore } from '@/store/filterStore';
import { ui } from '@/constants/ui';

export default function CakeGrid() {
  const filters = useFilterStore((state) => state.filters);
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadCakes() {
      setLoading(true);
      setError(false);
      try {
        const data = await getCakes(filters);
        if (!cancelled) {
          setCakes(data);
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setCakes([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    const timeout = setTimeout(loadCakes, 250);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [filters]);

  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-80 animate-pulse rounded-2xl bg-rose-100/70"
            aria-hidden="true"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-dashed border-rose-200 bg-white p-10 text-center text-stone-600">
        {ui.loadError}
      </div>
    );
  }

  if (cakes.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-rose-200 bg-white p-10 text-center text-stone-600">
        {ui.emptyResults}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {cakes.map((cake) => (
        <article
          key={cake._id}
          className="overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          <div className="relative aspect-[4/3] bg-gradient-to-br from-rose-100 via-amber-50 to-orange-100">
            {cake.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={cake.imageUrl}
                alt={cake.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-5xl" aria-hidden="true">
                🎂
              </div>
            )}
            {cake.isFeatured && (
              <span className="absolute left-3 top-3 rounded-full bg-rose-700 px-3 py-1 text-xs font-semibold text-white">
                {ui.featured}
              </span>
            )}
          </div>
          <div className="space-y-3 p-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-rose-700">
                {getCategoryName(cake)}
              </p>
              <h3 className="mt-1 text-lg font-semibold text-stone-900">{cake.name}</h3>
            </div>
            <p className="line-clamp-2 text-sm leading-6 text-stone-600">{cake.description}</p>
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-rose-900">
                {cake.price.toLocaleString('hy-AM')} դր
              </p>
              <button
                type="button"
                className="rounded-full bg-rose-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-800"
              >
                {ui.order}
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
