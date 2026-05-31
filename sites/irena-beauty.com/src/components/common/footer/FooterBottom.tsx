'use client';
import { useSiteContent } from '@/components/i18n/LocaleProvider';
import { useLocale } from '@/components/i18n/LocaleProvider';

const POLICY_LINKS = [
  { labelRu: 'Политика конфиденциальности', labelHe: 'מדיניות פרטיות', href: '/privacy' },
  { labelRu: 'Условия использования',       labelHe: 'תנאי שימוש',       href: '/terms'   },
  { labelRu: 'Политика доступности',        labelHe: 'מדיניות נגישות',   href: '/accessibility' },
];

const FooterBottom = () => {
  const { footer } = useSiteContent();
  const { locale } = useLocale();
  const isHe = locale === 'he';

  return (
    <div className="w-full border-t border-border-light">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-5 flex flex-col items-center gap-3">

        {/* Policy links */}
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1">
          {POLICY_LINKS.map(({ labelRu, labelHe, href }) => (
            <a
              key={href}
              href={href}
              className="text-[13px] text-white/70 hover:text-white transition-colors underline underline-offset-2 decoration-white/30"
              style={{ fontFamily: 'Nunito Sans' }}
            >
              {isHe ? labelHe : labelRu}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <div className="flex flex-row gap-[10px] items-center">
          <div className="w-[14px] h-[14px] bg-primary-background rounded-sm" />
          <p className="text-[15px] sm:text-base font-normal leading-relaxed text-text-light" style={{ fontFamily: 'Nunito Sans' }}>
            {footer.copyright}
          </p>
        </div>

        {/* Built by Aiterra */}
        <a
          href="https://aiterra.co.il/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[12px] text-white/40 hover:text-white/70 transition-colors"
          style={{ fontFamily: 'Nunito Sans' }}
        >
          {isHe ? 'נבנה על ידי' : 'Сделано'}{' '}
          <span className="font-semibold tracking-wide">Aiterra</span>
        </a>

      </div>
    </div>
  );
};

export default FooterBottom;
