import { Metadata } from 'next';
import { cookies } from 'next/headers';
import { LOCALE_COOKIE, normalizeLocale } from '@/lib/i18n/config';
import { readSiteContent } from '@/lib/site-content-store';
import { LocaleProvider } from '@/components/i18n/LocaleProvider';
import LegalPage from '@/components/common/LegalPage';

export const metadata: Metadata = {
  title: 'הצהרת נגישות | Beauty Irena',
  description: 'הצהרת הנגישות של אתר irena-beauty.com',
};

export default async function AccessibilityPage() {
  const locale = normalizeLocale((await cookies()).get(LOCALE_COOKIE)?.value);
  const contentByLocale = readSiteContent();

  return (
    <LocaleProvider initialLocale={locale} contentByLocale={contentByLocale}>
      <LegalPage
        title="הצהרת נגישות"
        lastUpdated="עודכן לאחרונה: מאי 2026"
        intro="אתר irena-beauty.com מחויב להנגיש את תכניו לכלל המשתמשים, לרבות אנשים עם מוגבלויות, בהתאם לתקן הישראלי ת״י 5568 (WCAG 2.1 ברמה AA) ולדרישות תיקון 35 לחוק שוויון זכויות לאנשים עם מוגבלות."
        sections={[
          {
            title: 'רמת הנגישות באתר',
            items: [
              'האתר עומד ברמת נגישות AA של תקן WCAG 2.1.',
              {
                subtitle: 'בין ההתאמות שבוצעו:',
                items: [
                  'תיאורי ALT לתמונות.',
                  'ניגודיות צבעים עומדת בדרישות התקן.',
                  'האתר ניתן לגלישה באמצעות מקלדת.',
                  'שפת האתר מוגדרת כראוי (עברית / רוסית).',
                  'מבנה כותרות היררכי ותקין (H1–H4).',
                ],
              },
            ],
          },
          {
            title: 'כלי הנגישות',
            items: [
              'באתר מוטמע כלי נגישות המאפשר: הגדלת גופן, שינוי ניגודיות, גווני אפור, והדגשת קישורים.',
            ],
          },
          {
            title: 'פניות בנושא נגישות',
            items: [
              'נתקלת בבעיית נגישות? אנחנו מעוניינים לשמוע ולתקן.',
              'ניתן לפנות אלינו בכל אחד מהאמצעים המפורטים בסעיף הקשר להלן.',
            ],
          },
        ]}
        contact={{
          title: 'רכז/ת נגישות',
          lines: [
            'שם: אירנה',
            'טלפון: 053-9594370',
            'אתר: https://irena-beauty.com',
          ],
        }}
      />
    </LocaleProvider>
  );
}
