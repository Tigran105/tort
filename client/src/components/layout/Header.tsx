import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { ui } from '@/constants/ui';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-rose-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold tracking-tight text-rose-900">
          {siteConfig.name}
        </Link>
        <nav
          aria-label="Հիմնական նavigation"
          className="hidden gap-6 text-sm font-medium text-stone-700 md:flex"
        >
          <a href="#catalog" className="transition hover:text-rose-700">
            {ui.navCatalog}
          </a>
          <Link href="/builder" className="transition hover:text-rose-700">
            {ui.heroCardTitle}
          </Link>
          <a href="#about" className="transition hover:text-rose-700">
            {ui.navAbout}
          </a>
          <a href="#contact" className="transition hover:text-rose-700">
            {ui.navContact}
          </a>
        </nav>
      </div>
    </header>
  );
}
