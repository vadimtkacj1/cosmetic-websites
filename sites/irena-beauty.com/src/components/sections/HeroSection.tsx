'use client';

import Button from '@/components/ui/Button';
import { useParallax } from '@/hooks/useParallax';
import { useLocale } from '@/components/i18n/LocaleProvider';
import { useBooking } from '@/components/booking/BookingContext';

export default function HeroSection() {
  const { ref: bgRef, offset } = useParallax<HTMLDivElement>(0.18);
  const { content, dir } = useLocale();
  const hero = content.hero;
  const isRtl = dir === 'rtl';
  const { openBooking } = useBooking();

  const scrimDirection = isRtl ? 'to left' : 'to right';
  const imagePath = `${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/images/Transparent BG.png`;

  return (
    <section id="hero" className="relative w-full bg-secondary-light overflow-hidden">
      
      {/* Десктопний фон (Паралакс) — прихований на мобільних */}
      <div
        ref={bgRef}
        aria-hidden
        className="hidden md:block absolute -inset-y-[12%] inset-x-0 will-change-transform"
        style={{
          backgroundImage: `url('${imagePath}')`,
          // Изменено на contain, чтобы картинка уменьшилась и не растягивалась избыточно
          backgroundSize: 'auto 80%',
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat',
          transform: `translate3d(0, ${offset}px, 0)${isRtl ? ' scaleX(-1)' : ''}`,
        }}
      />
      {/* Основний контейнер */}
      <div className="relative w-full max-w-[1440px] mx-auto">
        {/* flex-col-reverse міняє місцями блоки на мобільці: спочатку картинка, потім текст */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between pt-0 pb-12 md:py-[174px] md:px-10">
          
          {/* Текстовий блок (тепер знизу на мобільних) */}
          <div className="flex flex-col gap-[16px] w-full max-w-[520px] px-5 sm:px-6 md:px-0 mt-8 md:mt-0 z-10 text-center md:text-start items-center md:items-start">
            <h1 
              className="text-[28px] sm:text-[36px] md:text-[48px] font-medium leading-[36px] sm:leading-[48px] md:leading-[63px] text-text-primary" 
              style={{ fontFamily: 'Playfair Display' }}
            >
              {hero.title}
            </h1>

            <div className="flex flex-col gap-[24px] sm:gap-[30px] md:gap-[40px] w-full items-center md:items-start">
              <p 
                className="text-[15px] sm:text-[16px] md:text-base font-normal leading-relaxed text-text-secondary max-w-[420px] md:max-w-none" 
                style={{ fontFamily: 'Nunito Sans' }}
              >
                {hero.subtitle}
              </p>

              {/* Кнопки з рамкою для другої кнопки */}
              <div className="flex flex-col sm:flex-row gap-[12px] w-full max-w-[320px] sm:max-w-none justify-center md:justify-start">
                <Button
                  text={hero.cta}
                  className="w-full sm:w-auto px-[28px] py-[14px] rounded-xl uppercase tracking-wider text-sm"
                  text_font_size="text-sm"
                  text_font_family="Nunito Sans"
                  text_font_weight="font-medium"
                  text_line_height="leading-relaxed"
                  text_color="text-text-white"
                  fill_background_color="bg-primary-background"
                  variant="primary"
                  size="medium"
                  onClick={() => {
                    const pricingSection = document.getElementById('pricing')
                    pricingSection?.scrollIntoView({ behavior: 'smooth' })
                  }}
                />
                <button
                  onClick={openBooking}
                  className="w-full sm:w-auto px-[28px] py-[14px] rounded-xl uppercase tracking-wider text-sm font-medium bg-transparent text-text-primary hover:bg-text-primary hover:text-white transition-all duration-200 focus:outline-none"
                  style={{ fontFamily: 'Nunito Sans', border: '2px solid #1d1d1e' }}
                >
                  {hero.cta2}
                </button>
              </div>

              {/* Social links */}
              <div className="flex flex-row gap-[20px] items-center justify-center md:justify-start">
                <a
                  href="https://www.instagram.com/beautyiren/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-text-primary opacity-70 hover:opacity-100 transition-opacity"
                >
                  <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="tel:0539594370"
                  aria-label="Phone"
                  className="text-text-primary opacity-70 hover:opacity-100 transition-opacity"
                >
                  <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.64 3.42 2 2 0 0 1 3.62 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.81a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=100066676083443"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-text-primary opacity-70 hover:opacity-100 transition-opacity"
                >
                  <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a
                  href="https://ul.waze.com/ul?q=Sokolov%2041%2C%20Holon%2C%20Israel&navigate=yes"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Waze"
                  className="text-text-primary opacity-70 hover:opacity-100 transition-opacity"
                >
                  <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="10" r="7" />
                    <circle cx="10" cy="9" r="1" fill="currentColor" stroke="none" />
                    <circle cx="14" cy="9" r="1" fill="currentColor" stroke="none" />
                    <path d="M9.5 12.5c.7.7 1.5 1 2.5 1s1.8-.3 2.5-1" strokeLinecap="round" />
                    <path d="M8 18l-2 3" strokeLinecap="round" />
                    <path d="M16 18l2 3" strokeLinecap="round" />
                    <path d="M9 21h6" strokeLinecap="round" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Мобільне зображення (тепер зверху на мобільних завдяки flex-col-reverse) */}
          <div className="block md:hidden w-full overflow-hidden rounded-b-[32px] shadow-sm">
            <img 
              src={imagePath} 
              alt="Nails and Beauty" 
              className={`w-full h-auto object-cover ${isRtl ? 'scaleX(-1)' : ''}`}
            />
          </div>

        </div>
      </div>
    </section>
  );
}