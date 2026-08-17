import { Metadata } from 'next';
import { cookies } from 'next/headers';
import HomePage from '@/components/sections/HomePage';
import { LOCALE_COOKIE, normalizeLocale } from '@/lib/i18n/config';
import { readSiteContent } from '@/lib/site-content-store';
import { LocaleProvider } from '@/components/i18n/LocaleProvider';

export const metadata: Metadata = {
  title: 'איפור קבוע ומניקור בחולון',
  description: 'אירנה — סטודיו לאיפור קבוע ושירותי מניקור בחולון. גבות, שפתיים וקו ריסים באיפור קבוע, מניקור ופדיקור מקצועיים.',
  keywords: 'איפור קבוע, מניקור, פדיקור, גבות, שפתיים, קו ריסים, חולון, אירנה',

  openGraph: {
    title: 'איפור קבוע ומניקור בחולון',
    description: 'אירנה — סטודיו לאיפור קבוע ושירותי מניקור בחולון. גבות, שפתיים וקו ריסים באיפור קבוע, מניקור ופדיקור מקצועיים.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Irena Beauty',
      },
    ],
  }
}

export default async function Page() {
  const locale = normalizeLocale((await cookies()).get(LOCALE_COOKIE)?.value)
  const contentByLocale = readSiteContent()
  return (
    <LocaleProvider initialLocale={locale} contentByLocale={contentByLocale}>
      <HomePage />
    </LocaleProvider>
  )
}