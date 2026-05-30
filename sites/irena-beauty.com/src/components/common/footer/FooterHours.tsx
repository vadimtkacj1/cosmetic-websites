'use client';
import { useSiteContent } from '@/components/i18n/LocaleProvider';

const FooterHours = () => {
  const { footer } = useSiteContent();
  return (
  <div className="flex flex-col gap-[24px] w-full sm:w-auto">
    <h3 className="text-xl sm:text-2xl font-semibold leading-2xl text-text-white" style={{ fontFamily: 'Nunito Sans' }}>
      {footer.hoursTitle}
    </h3>
    <ul className="flex flex-col gap-[14px]">
      <li>
        <span className="text-lg font-normal leading-xl text-text-white" style={{ fontFamily: 'Nunito Sans' }}>
          {footer.hours}
        </span>
      </li>
    </ul>
  </div>
  )
}

export default FooterHours;
