'use client';
import { useSiteContent } from '@/components/i18n/LocaleProvider';

const FooterBottom = () => {
  const { footer } = useSiteContent();
  return (
  <div className="w-full border-t border-border-light">
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-6">
      <div className="flex flex-row justify-center items-center">
        <div className="flex flex-row gap-[10px] items-center">
          <div className="w-[14px] h-[14px] bg-primary-background rounded-sm" />
          <p className="text-[15px] sm:text-base font-normal leading-relaxed text-text-light" style={{ fontFamily: 'Nunito Sans' }}>
            {footer.copyright}
          </p>
        </div>
      </div>
    </div>
  </div>
  )
}

export default FooterBottom;
