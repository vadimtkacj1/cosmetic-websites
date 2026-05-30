import { Metadata } from 'next';
import { cookies } from 'next/headers';
import HomePage from '@/components/sections/HomePage';
import { LOCALE_COOKIE, normalizeLocale } from '@/lib/i18n/config';
import { readSiteContent } from '@/lib/site-content-store';
import { LocaleProvider } from '@/components/i18n/LocaleProvider';

export const metadata: Metadata = {
  title: 'GlamNails - Premium Nail Salon & Spa Services | Manicure, Pedicure & Nail Art',
  description: 'Transform your nails into stunning works of art at GlamNails. Expert nail services including professional pedicures, manicures, and artistic nail designs. Book your appointment today for luxurious nail care with experienced technicians in a welcoming atmosphere.',
  keywords: 'nail salon, manicure, pedicure, nail art, gel nails, acrylic nails, nail spa, nail designs, professional nail care, nail technician, beauty salon, GlamNails, nail polish, nail services, spa manicure',
  
  openGraph: {
    title: 'GlamNails - Premium Nail Salon & Spa Services',
    description: 'Transform your nails into stunning works of art at GlamNails. Expert nail services including professional pedicures, manicures, and artistic nail designs. Book your appointment today for luxurious nail care.',
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