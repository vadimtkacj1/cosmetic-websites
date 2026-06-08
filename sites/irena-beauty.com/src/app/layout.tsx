import React from 'react';
import Script from 'next/script';
import { cookies } from 'next/headers';
import '../styles/index.css';
import { dirFor, LOCALE_COOKIE, normalizeLocale } from '@/lib/i18n/config';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  title: {
    default: 'GlamNails',
    template: 'GlamNails | %s',
  },
  icons: {
    icon: '/favicon.ico',
  },
  description: 'Experience luxury nail care at GlamNails. Expert manicures, pedicures, and artistic nail designs. Book your appointment today for professional nail services, relaxing spa treatments, and stunning nail art in a welcoming atmosphere.',
  keywords: 'nail salon, manicure, pedicure, nail art, gel nails, acrylic nails, nail spa, nail designs, professional nail care, nail technician, beauty salon',
  
  openGraph: {
    type: 'website',
    title: {
      default: 'GlamNails',
      template: 'GlamNails | %s',
    },
    description: 'Transform your nails with GlamNails premium services. Expert nail technicians, luxurious treatments, and stunning nail designs. Book now for professional manicures, pedicures, and custom nail art.',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = normalizeLocale((await cookies()).get(LOCALE_COOKIE)?.value);
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  return (
    <html lang={locale} dir={dirFor(locale)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;500;600;700&family=Playfair+Display:wght@400;500;600&display=swap"
        />
        <link rel="preload" as="image" href={`${basePath}/images/Transparent BG.webp`} />
      </head>
      <body>{children}</body>
      <Script
        src="https://cdn.jsdelivr.net/npm/sienna-accessibility/dist/sienna-accessibility.umd.js"
        strategy="lazyOnload"
      />
    </html>
  );
}