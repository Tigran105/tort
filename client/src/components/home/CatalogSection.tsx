import CatalogFilters from '@/components/catalog/CatalogFilters';
import CakeGrid from '@/components/catalog/CakeGrid';
import HeroSection from '@/components/home/HeroSection';
import { ui } from '@/constants/ui';

export default function CatalogSection() {
  return (
    <>
      <HeroSection />
      <section id="catalog" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-rose-950">{ui.catalogTitle}</h2>
          <p className="mt-3 text-stone-600">{ui.catalogSubtitle}</p>
        </div>
        <CatalogFilters />
        <div className="mt-8">
          <CakeGrid />
        </div>
      </section>
    </>
  );
}
