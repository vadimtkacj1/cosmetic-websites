'use client';
import Image from'next/image';
 import Button from'@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import { useParallax } from '@/hooks/useParallax';
import { useBooking } from '@/components/booking/BookingContext';
import { useSiteContent } from '@/components/i18n/LocaleProvider';

interface PromoCardProps {
  image: string
  title: string
  imagePosition: 'left' | 'right'
  imageAlt: string
  cta: string
}

const PromoCard = ({ image, title, imagePosition, imageAlt, cta }: PromoCardProps) => {
  const { ref, offset } = useParallax<HTMLDivElement>(0.08);
  const { openBooking } = useBooking();
  return (
  <div className="flex flex-col sm:flex-row justify-start items-center bg-secondary-background w-full overflow-hidden">
    {imagePosition === 'left' && (
      <div ref={ref} className="w-full sm:w-[48%] overflow-hidden">
        <div className="will-change-transform" style={{ transform: `translate3d(0, ${offset}px, 0) scale(1.06)` }}>
          <Image
            src={image}
            alt={imageAlt}
            width={268}
            height={284}
            className="w-full h-auto"
          />
        </div>
      </div>
    )}
    
    <div className="flex flex-col gap-[14px] justify-start items-start p-[19px] sm:p-[28px] md:p-[38px] w-full sm:w-[52%]">
      <div className="flex flex-col gap-[16px] sm:gap-[19px] md:gap-[22px] justify-start items-start w-full">
        <h3 className="text-[22px] sm:text-[27px] md:text-3xl font-semibold leading-[28px] sm:leading-[37px] md:leading-4xl text-start text-text-primary" style={{ fontFamily: 'Nunito Sans' }}>
          {title}
        </h3>

        <Button
          text={cta}
          className="w-full sm:w-auto px-[28px] py-[14px] rounded-xl"
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
          onClick={openBooking}
        />
      </div>
    </div>
    
    {imagePosition === 'right' && (
      <div ref={ref} className="w-full sm:w-[32%] hidden sm:block overflow-hidden">
        <div className="will-change-transform" style={{ transform: `translate3d(0, ${offset}px, 0) scale(1.06)` }}>
          <Image
            src={image}
            alt={imageAlt}
            width={268}
            height={284}
            className="w-full h-auto"
          />
        </div>
      </div>
    )}
  </div>
  );
};

const PROMO_IMAGES = ['/images/img_image_37.png', '/images/img_image_36.png']
const PROMO_POSITIONS = ['left', 'right'] as const

export default function PromotionalSection() {
  const { promos: promoContent } = useSiteContent();
  const promos = promoContent.items.map((item, i) => ({
    image: PROMO_IMAGES[i] ?? PROMO_IMAGES[0],
    title: item.title,
    imagePosition: PROMO_POSITIONS[i] ?? 'left',
    imageAlt: item.title,
    cta: promoContent.cta,
  }))

  return (
    <section className="w-full bg-secondary-light">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-[40px] sm:py-[60px] md:py-[80px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px] sm:gap-[18px] md:gap-[20px] max-w-[1142px] mx-auto">
          {promos.map((promo, index) => (
            <Reveal key={index} direction={index % 2 === 0 ? 'left' : 'right'} delay={index * 120}>
              <PromoCard {...promo} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}