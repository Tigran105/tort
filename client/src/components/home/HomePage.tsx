import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StickyContacts from '@/components/contact/StickyContacts';
import CatalogSection from '@/components/home/CatalogSection';

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <CatalogSection />
      </main>
      <Footer />
      <StickyContacts />
    </>
  );
}
