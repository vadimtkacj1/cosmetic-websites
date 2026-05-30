'use client';
import FooterLink from './FooterLink';
import { useSiteContent } from '@/components/i18n/LocaleProvider';

const FooterNavigation = () => {
  const { footer, nav } = useSiteContent();
  const links = [
    { label: nav.home, href: '#hero' },
    { label: nav.about, href: '#about' },
    { label: nav.portfolio, href: '#portfolio' },
    { label: nav.contacts, href: '#contact' },
  ];
  return (
  <div className="flex flex-col gap-[24px] w-full sm:w-[46%]">
    <h3 className="text-xl sm:text-2xl font-semibold leading-2xl text-text-white" style={{ fontFamily: 'Nunito Sans' }}>
      {footer.navTitle}
    </h3>
    <ul className="flex flex-col gap-[14px]">
      {links.map(({ label, href }) => (
        <li key={href}>
          <FooterLink href={href}>{label}</FooterLink>
        </li>
      ))}
    </ul>
  </div>
  )
}

export default FooterNavigation;
