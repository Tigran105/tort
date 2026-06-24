import { ui } from '@/constants/ui';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-rose-50 via-amber-50 to-orange-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:py-24">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-rose-700">
            {ui.heroEyebrow}
          </p>
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-rose-950 sm:text-5xl">
            {ui.heroTitle}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-stone-700">{ui.heroDescription}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#catalog"
              className="rounded-full bg-rose-700 px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-rose-800"
            >
              {ui.heroCtaCatalog}
            </a>
            <a
              href="#contact"
              className="rounded-full border border-rose-200 bg-white px-6 py-3 text-sm font-semibold text-rose-900 transition hover:border-rose-300"
            >
              {ui.heroCtaContact}
            </a>
          </div>
        </div>
        <div className="relative mx-auto aspect-square w-full max-w-md">
          <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-rose-300 via-amber-200 to-orange-200 shadow-2xl" />
          <div className="absolute inset-6 rounded-[1.5rem] border border-white/60 bg-white/70 p-8 backdrop-blur">
            <div className="flex h-full flex-col justify-center text-center">
              <span className="text-6xl" aria-hidden="true">
                🎂
              </span>
              <p className="mt-4 text-xl font-semibold text-rose-900">{ui.heroCardTitle}</p>
              <p className="mt-2 text-sm text-stone-600">{ui.heroCardSubtitle}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
