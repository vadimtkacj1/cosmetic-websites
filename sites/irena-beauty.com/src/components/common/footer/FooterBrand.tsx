'use client';
import Image from 'next/image';
import FooterSocialIcons from './FooterSocialIcons';
import { useSiteContent } from '@/components/i18n/LocaleProvider';

const FooterBrand = () => {
  const { footer } = useSiteContent();
  return (
  <div className="flex flex-col gap-[24px] w-full lg:w-[32%]">
    <Image
      src="/logo.png"
      alt="GlamNails Logo"
      width={52}
      height={50}
      className="w-[56px] sm:w-[64px] md:w-[72px] h-auto"
    />
    <p className="text-[15px] sm:text-base font-normal leading-normal text-text-secondary" style={{ fontFamily: 'Nunito Sans' }}>
      {footer.brandText}
    </p>
    <FooterSocialIcons />
  </div>
  )
}

export default FooterBrand;
