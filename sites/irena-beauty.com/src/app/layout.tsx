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
  metadataBase: new URL('https://irena-beauty.com'),
  title: {
    default: 'Irena Beauty | איפור קבוע ומניקור בחולון',
    template: '%s | Irena Beauty',
  },
  icons: {
    icon: '/favicon.ico',
  },
  description: 'אירנה — סטודיו לאיפור קבוע ושירותי מניקור בחולון. גבות, שפתיים וקו ריסים באיפור קבוע, מניקור ופדיקור מקצועיים.',
  keywords: 'איפור קבוע, מניקור, פדיקור, גבות, שפתיים, קו ריסים, חולון, אירנה',

  openGraph: {
    type: 'website',
    siteName: 'Irena Beauty',
    locale: 'he_IL',
    title: {
      default: 'Irena Beauty | איפור קבוע ומניקור בחולון',
      template: '%s | Irena Beauty',
    },
    description: 'אירנה — סטודיו לאיפור קבוע ושירותי מניקור בחולון. גבות, שפתיים וקו ריסים באיפור קבוע, מניקור ופדיקור מקצועיים.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Irena Beauty',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Irena Beauty',
    description: 'אירנה — סטודיו לאיפור קבוע ושירותי מניקור בחולון. גבות, שפתיים וקו ריסים באיפור קבוע, מניקור ופדיקור מקצועיים.',
    images: ['/images/og-image.jpg'],
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