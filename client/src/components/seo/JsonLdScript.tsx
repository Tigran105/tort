import { siteConfig } from '@/config/site';

export function JsonLdScript() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Bakery',
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    servesCuisine: 'Armenian bakery',
    inLanguage: 'hy',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
