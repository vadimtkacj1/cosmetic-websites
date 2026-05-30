'use client';
import NavLink from './NavLink';
import { useSiteContent } from '@/components/i18n/LocaleProvider';

const DesktopNav = () => {
  const { nav } = useSiteContent();
  return (
    <nav className="hidden lg:flex flex-row gap-[24px] justify-center items-center" aria-label="Main navigation">
      <NavLink href="#hero">{nav.home}</NavLink>
      <NavLink href="#about">{nav.about}</NavLink>
      <NavLink href="#portfolio">{nav.portfolio}</NavLink>
      <NavLink href="#pricing">{nav.pricing}</NavLink>
      <NavLink href="#contact">{nav.contacts}</NavLink>
    </nav>
  )
}

export default DesktopNav;
