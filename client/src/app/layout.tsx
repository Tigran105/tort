import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Տորթերի խանութ',
  description: 'Անհատական և պատրաստի տորթերի պատվեր',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hy" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-stone-50 font-sans text-stone-900">
        {children}
      </body>
    </html>
  );
}
