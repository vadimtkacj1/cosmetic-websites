'use client';
import { useEffect, useState } from 'react';
import { useBooking } from '@/components/booking/BookingContext';
import { useLocale } from '@/components/i18n/LocaleProvider';

const SESSION_KEY = 'discount_popup_dismissed';

export default function DiscountPopup() {
  const [visible, setVisible] = useState(false);
  const { openBooking } = useBooking();
  const { content, dir } = useLocale();
  const popup = content.discountPopup;

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) return;
    const t = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    setVisible(false);
    sessionStorage.setItem(SESSION_KEY, '1');
  };

  const handleBook = () => {
    close();
    openBooking();
  };

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[190] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[3px] animate-hero-fade"
      onClick={close}
    >
      <div
        dir={dir}
        onClick={e => e.stopPropagation()}
        className="relative w-full max-w-[340px] rounded-2xl overflow-hidden"
        style={{
          background: '#fdf8f2',
          boxShadow: '0 32px 64px -12px rgba(0,0,0,0.18), 0 0 0 1px rgba(194,160,90,0.12)',
        }}
      >
        {/* Gold top accent stripe */}
        <div
          className="h-[3px] w-full"
          style={{ background: 'linear-gradient(90deg, #b8913a 0%, #e8c96a 50%, #b8913a 100%)' }}
        />

        {/* Close */}
        <button
          onClick={close}
          aria-label="close"
          className="absolute top-3 end-3 z-10 w-[28px] h-[28px] flex items-center justify-center rounded-full text-[#a07c34] hover:bg-[#c2a05a]/10 transition-colors text-[14px] leading-none"
        >
          ✕
        </button>

        <div className="flex flex-col items-center gap-0 px-7 pt-7 pb-6 text-center">
          {/* Decorative divider top */}
          <div className="flex items-center gap-2 w-full mb-5">
            <div className="h-px flex-1" style={{ background: 'linear-gradient(to right, transparent, #c2a05a44)' }} />
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M6 0L7.2 4.8L12 6L7.2 7.2L6 12L4.8 7.2L0 6L4.8 4.8L6 0Z" fill="#c2a05a" fillOpacity="0.6" />
            </svg>
            <div className="h-px flex-1" style={{ background: 'linear-gradient(to left, transparent, #c2a05a44)' }} />
          </div>

          {/* Badge */}
          <div
            className="inline-flex items-center justify-center px-3 py-[3px] rounded-full mb-4"
            style={{ background: 'rgba(194,160,90,0.10)', border: '1px solid rgba(194,160,90,0.25)' }}
          >
            <span className="text-[9px] tracking-[0.22em] uppercase font-semibold" style={{ fontFamily: 'Nunito Sans', color: '#a07c34' }}>
              {popup.badge}
            </span>
          </div>

          {/* Big discount number */}
          <div className="relative mb-1">
            <p
              className="text-[76px] font-bold leading-none"
              style={{ fontFamily: 'Playfair Display', color: '#c2a05a', letterSpacing: '-0.02em' }}
            >
              {popup.discount}
            </p>
            {/* Subtle glow under the number */}
            <div
              className="absolute inset-x-0 bottom-0 h-8 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, rgba(194,160,90,0.15) 0%, transparent 70%)' }}
            />
          </div>

          {/* Title */}
          <p
            className="text-[18px] font-medium leading-snug mb-4"
            style={{ fontFamily: 'Playfair Display', color: '#2a1f0e' }}
          >
            {popup.title}
          </p>

          {/* Dashed coupon divider */}
          <div className="w-full flex items-center gap-0 mb-4">
            <div className="w-5 h-5 rounded-full flex-shrink-0 -ms-7" style={{ background: '#ede8e0' }} />
            <div
              className="flex-1 h-px border-t border-dashed"
              style={{ borderColor: 'rgba(194,160,90,0.3)' }}
            />
            <div className="w-5 h-5 rounded-full flex-shrink-0 -me-7" style={{ background: '#ede8e0' }} />
          </div>

          {/* Description */}
          <p
            className="text-[12.5px] leading-relaxed mb-5"
            style={{ fontFamily: 'Nunito Sans', color: '#7a6a55' }}
          >
            {popup.description}
          </p>

          {/* CTA button */}
          <button
            onClick={handleBook}
            className="w-full py-[13px] rounded-xl text-white text-[12px] tracking-[0.18em] uppercase transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            style={{
              fontFamily: 'Nunito Sans',
              background: 'linear-gradient(135deg, #1a1208 0%, #2e2010 100%)',
            }}
          >
            {popup.cta}
          </button>

          {/* Dismiss */}
          <button
            onClick={close}
            className="mt-3 text-[11px] underline underline-offset-2 transition-colors hover:opacity-80"
            style={{ fontFamily: 'Nunito Sans', color: '#b0a090' }}
          >
            {popup.dismiss}
          </button>
        </div>
      </div>
    </div>
  );
}
