import { siteConfig, getPhoneUrl } from '@/config/site';
import { ui } from '@/constants/ui';

export default function Footer() {
  return (
    <footer id="contact" className="mt-auto border-t border-rose-100 bg-rose-950 text-rose-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-3 lg:px-8">
        <section>
          <h2 className="text-lg font-semibold">{siteConfig.name}</h2>
          <p className="mt-3 text-sm leading-6 text-rose-100/90">{ui.footerAbout}</p>
        </section>
        <section>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-rose-200">
            {ui.footerContact}
          </h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a href={getPhoneUrl()} className="hover:text-white">
                {siteConfig.phone}
              </a>
            </li>
            <li>
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                Instagram
              </a>
            </li>
          </ul>
        </section>
        <section id="about">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-rose-200">
            {ui.footerAboutTitle}
          </h3>
          <p className="mt-3 text-sm leading-6 text-rose-100/90">{ui.footerAboutText}</p>
        </section>
      </div>
      <div className="border-t border-rose-900 px-4 py-4 text-center text-xs text-rose-200">
        © {new Date().getFullYear()} {siteConfig.name}
      </div>
    </footer>
  );
}
