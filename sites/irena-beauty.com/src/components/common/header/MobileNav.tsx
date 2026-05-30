'use client';
import Button from '../../ui/Button';
import NavLink from './NavLink';
import Logo from './Logo';
import { useBooking } from '@/components/booking/BookingContext';
import { useLocale } from '@/components/i18n/LocaleProvider';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';

const MobileNav = ({ open, onClose }: { open: boolean; onClose?: () => void }) => {
  const { openBooking } = useBooking();
  const { content: { nav, actions }, dir } = useLocale();
  return (
  <nav
    dir={dir}
    className={`${open ? 'flex' : 'hidden'} lg:hidden fixed inset-0 z-[60] bg-header-background flex-col overflow-y-auto`}
    aria-label="Mobile navigation"
  >
    <div className="flex flex-row justify-between items-center py-4 px-4 sm:px-6">
      <Logo />
      <button onClick={onClose} aria-label="Close menu" className="p-2">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <div className="flex flex-col gap-6 px-4 sm:px-6 pt-2 pb-8" onClick={onClose}>
      <NavLink href="#hero">{nav.home}</NavLink>
      <NavLink href="#about">{nav.about}</NavLink>
      <NavLink href="#portfolio">{nav.portfolio}</NavLink>
      <NavLink href="#pricing">{nav.pricing}</NavLink>
      <NavLink href="#contact">{nav.contacts}</NavLink>
      <div className="pt-1" onClick={(e) => e.stopPropagation()}>
        <LanguageSwitcher />
      </div>
      <Button
        text={actions.book}
        className="w-full mt-2 px-6 py-3"
        variant="primary"
        size="medium"
        padding="px-6 py-3"
        margin="mt-2"
        position="relative"
        layout_gap="gap-0"
        onClick={openBooking}
        text_font_size="text-base"
        text_font_family="Nunito Sans"
        text_font_weight="font-normal"
        text_line_height="leading-relaxed"
        text_color="text-text-white"
        fill_background_color="bg-primary-background"
      />
    </div>
  </nav>
  );
};

export default MobileNav;
