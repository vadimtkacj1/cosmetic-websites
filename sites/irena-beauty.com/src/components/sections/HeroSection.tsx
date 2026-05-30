'use client';

import Button from '@/components/ui/Button';
import { useParallax } from '@/hooks/useParallax';
import { useLocale } from '@/components/i18n/LocaleProvider';

export default function HeroSection() {
  const { ref: bgRef, offset } = useParallax<HTMLDivElement>(0.18);
  const { content, dir } = useLocale();
  const hero = content.hero;
  const isRtl = dir === 'rtl';

  // The background subject (hands) sits on the right; text aligns to the writing
  // direction's start. In RTL the text moves right onto the subject, so mirror the
  // image and flip the readability scrim to keep the text over the lighter side.
  const scrimDirection = isRtl ? 'to left' : 'to right';

  return (
    <section id="hero" className="relative w-full bg-secondary-light overflow-hidden">
      {/* Parallax background layer */}
      <div
        ref={bgRef}
        aria-hidden
        className="absolute -inset-y-[12%] inset-x-0 will-change-transform"
        style={{
          backgroundImage: "url('/images/img_.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          transform: `translate3d(0, ${offset}px, 0)${isRtl ? ' scaleX(-1)' : ''}`,
        }}
      />

      {/* Readability scrim — fades the section bg from the text side to transparent */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(${scrimDirection}, #f8efe8 0%, rgba(248,239,232,0.85) 30%, rgba(248,239,232,0.35) 60%, rgba(248,239,232,0) 85%)`,
        }}
      />

      <div className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-6">
        <div className="flex flex-col justify-center items-start py-[72px] sm:py-[130px] md:py-[174px] ps-0 sm:ps-[60px] md:ps-[80px] pe-0 sm:pe-[42px] md:pe-[56px]">
          <div className="flex flex-col gap-[14px] w-full max-w-[520px]">
            <h1 className="text-[30px] sm:text-[36px] md:text-[48px] font-medium leading-[38px] sm:leading-[48px] md:leading-[63px] text-start text-text-primary animate-hero-fade [animation-delay:100ms]" style={{ fontFamily: 'Playfair Display' }}>
              {hero.title}
            </h1>

            <div className="flex flex-col gap-[20px] sm:gap-[30px] md:gap-[40px]">
              <p className="text-[16px] sm:text-[16px] md:text-base font-normal leading-normal text-start text-text-secondary animate-hero-fade [animation-delay:300ms]" style={{ fontFamily: 'Nunito Sans' }}>
                {hero.subtitle}
              </p>

              <div className="animate-hero-fade [animation-delay:500ms]">
              <Button
                text={hero.cta}
                className="w-auto px-[28px] py-[14px]"
                text_font_size="text-base"
                text_font_family="Nunito Sans"
                text_font_weight="font-normal"
                text_line_height="leading-relaxed"
                text_color="text-text-white"
                fill_background_color="bg-primary-background"
                layout_width="w-auto"
                padding="px-[28px] py-[14px]"
                margin="m-0"
                position="relative"
                layout_gap="gap-0"
                variant="primary"
                size="md"
                onClick={() => {
                  const aboutSection = document.getElementById('about')
                  aboutSection?.scrollIntoView({ behavior: 'smooth' })
                }}
              />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}