import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import StickyContacts from '@/components/contact/StickyContacts';
import CakeBuilderWizard from '@/components/builder/CakeBuilderWizard';
import { siteConfig } from '@/config/site';
import { builderUi } from '@/constants/builder';

export const metadata: Metadata = {
  title: builderUi.pageTitle,
  description: siteConfig.description,
};

export default function BuilderPage() {
  return (
    <>
      <Header />
      <main>
        <CakeBuilderWizard />
      </main>
      <Footer />
      <StickyContacts />
    </>
  );
}
