'use client';
import FooterBrand from './footer/FooterBrand';
import FooterNavigation from './footer/FooterNavigation';
import FooterHours from './footer/FooterHours';
import FooterContacts from './footer/FooterContacts';
import FooterBottom from './footer/FooterBottom';
import { useLocale } from '@/components/i18n/LocaleProvider';

const Footer = () => {
  const { dir } = useLocale();
  return (
  <footer className="w-full bg-footer-background">
    <div className="w-full">
      <div dir={dir} className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-12 md:py-16 lg:py-20">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8 lg:gap-12">
          <FooterBrand />
          <div className="flex flex-col sm:flex-row justify-between gap-8 sm:gap-12 lg:gap-16 w-full lg:w-[38%]">
            <FooterNavigation />
            <FooterHours />
          </div>
          <FooterContacts />
        </div>
      </div>
      <FooterBottom />
    </div>
  </footer>
  );
};

export default Footer;
