'use client';
import Button from '../../ui/Button';
import { useBooking } from '@/components/booking/BookingContext';
import { useSiteContent } from '@/components/i18n/LocaleProvider';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';

const DesktopActions = () => {
  const { openBooking } = useBooking();
  const { actions } = useSiteContent();
  return (
  <div className="hidden lg:flex flex-row gap-[12px] items-center ms-[36px]">
    <LanguageSwitcher />
    <Button
      text={actions.book}
      className="ms-[20px] px-[28px] py-[14px] rounded-xl"
      variant="primary"
      size="medium"
      padding="px-[28px] py-[14px]"
      margin="ms-[20px]"
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
  );
};

export default DesktopActions;
