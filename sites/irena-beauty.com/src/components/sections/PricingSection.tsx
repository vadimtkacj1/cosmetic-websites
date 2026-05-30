'use client';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { useBooking } from '@/components/booking/BookingContext';
import { useSiteContent } from '@/components/i18n/LocaleProvider';

interface PricingItem {
  title: string;
  price: string;
}

interface PricingCategory {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  imagePosition: 'left' | 'right';
  items: PricingItem[];
}

const formatPrice = (price: string, currency: string) => `${price} ${currency}`;

const PricingRow = ({ title, price, currency }: PricingItem & { currency: string }) => {
  return (
    <div
      className="group flex flex-row items-baseline gap-[12px] w-full"
    >
      <span
        className="text-[17px] sm:text-[17px] md:text-lg font-normal leading-relaxed text-start text-text-primary transition-colors group-hover:text-primary-background"
        style={{ fontFamily: 'Nunito Sans' }}
      >
        {title}
      </span>
      <span
        aria-hidden
        className="flex-1 border-b border-dotted border-text-secondary/40 translate-y-[-4px] group-hover:border-primary-background/50 transition-colors"
      />
      <span
        className="text-[17px] sm:text-[17px] md:text-lg font-semibold leading-relaxed text-end text-text-primary whitespace-nowrap transition-colors group-hover:text-primary-background"
        style={{ fontFamily: 'Nunito Sans' }}
      >
        {formatPrice(price, currency)}
      </span>
    </div>
  );
};

const CATEGORY_META: { id: string; image: string; imagePosition: 'left' | 'right' }[] = [
  { id: 'permanent', image: '/images/img_image_618x460.png', imagePosition: 'left' },
  { id: 'manicure', image: '/images/img_image_2.png', imagePosition: 'right' },
  { id: 'pedicure', image: '/images/img_image_400x558.png', imagePosition: 'left' },
];

const ParallaxImage = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <div className="relative overflow-hidden w-full aspect-[460/618]">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 1024px) 100vw, 460px"
        className="object-cover"
      />
    </div>
  );
};

const PricingBlock = ({
  category,
  index,
  eyebrow,
  cta,
  currency,
}: {
  category: PricingCategory;
  index: number;
  eyebrow: string;
  cta: string;
  currency: string;
}) => {
  const isImageLeft = category.imagePosition === 'left';
  const { openBooking } = useBooking();

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-[24px] sm:gap-[30px] md:gap-[40px] max-w-[1142px] mx-auto">
        <div
          className={`w-full lg:w-[40%] ${
            isImageLeft ? 'order-1' : 'order-1 lg:order-2'
          }`}
        >
          <div className="relative">
            <div
              aria-hidden
              className={`absolute -z-10 w-[60%] h-[55%] rounded-full opacity-50 blur-3xl ${
                isImageLeft ? '-top-8 -left-8' : '-top-8 -right-8'
              }`}
              style={{ background: 'radial-gradient(circle, rgba(168,132,63,0.35) 0%, transparent 70%)' }}
            />
            <ParallaxImage src={category.image} alt={category.imageAlt} />
          </div>
        </div>

        <div
          className={`flex flex-col gap-[20px] sm:gap-[30px] md:gap-[40px] justify-start items-start w-full lg:w-[55%] ${
            isImageLeft ? 'order-2' : 'order-2 lg:order-1'
          }`}
        >
          <div className="flex flex-col gap-[10px] sm:gap-[12px] md:gap-[14px] justify-start items-start w-full">
            <span
              className="text-[11px] sm:text-[12px] tracking-[0.32em] uppercase text-primary-background/80"
              style={{ fontFamily: 'Nunito Sans' }}
            >
              0{index + 1} — {eyebrow}
            </span>
            <h2
              className="text-[28px] sm:text-[36px] md:text-[48px] font-medium leading-[36px] sm:leading-[48px] md:leading-7xl text-start text-text-primary"
              style={{ fontFamily: 'Playfair Display' }}
            >
              {category.title}
            </h2>
            <p
              className="text-[17px] sm:text-[17px] md:text-lg font-normal leading-loose text-start text-text-secondary"
              style={{ fontFamily: 'Nunito Sans' }}
            >
              {category.subtitle}
            </p>
          </div>

          <div className="flex flex-col gap-[14px] sm:gap-[16px] md:gap-[18px] justify-start items-start w-full">
            {category.items.map((item, i) => (
              <PricingRow key={i} {...item} currency={currency} />
            ))}

            <Button
              text={cta}
              className="w-full sm:w-auto px-[28px] py-[14px] mt-[16px] sm:mt-[20px] md:mt-[24px] hover:opacity-90 hover:-translate-y-0.5 transition-all duration-300"
              text_font_size="text-base"
              text_font_family="Nunito Sans"
              text_font_weight="font-normal"
              text_line_height="leading-relaxed"
              text_color="text-text-white"
              fill_background_color="bg-primary-background"
              layout_width="w-auto"
              padding="px-[28px] py-[14px]"
              margin="mt-[16px] sm:mt-[20px] md:mt-[24px]"
              position="relative"
              layout_gap="gap-0"
              variant="filled"
              size="md"
              onClick={openBooking}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PricingSection() {
  const { pricing } = useSiteContent();
  const categories: PricingCategory[] = pricing.categories.map((cat, i) => {
    const meta = CATEGORY_META[i] ?? CATEGORY_META[0];
    return {
      id: meta.id,
      title: cat.title,
      subtitle: cat.subtitle,
      image: meta.image,
      imageAlt: cat.title,
      imagePosition: meta.imagePosition,
      items: cat.items,
    };
  });
  return (
    <section id="pricing" className="relative w-full bg-secondary-background overflow-hidden">
      {/* Soft decorative gradients */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[10%] -left-32 w-[420px] h-[420px] rounded-full opacity-40 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(194,160,90,0.30) 0%, transparent 70%)' }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[10%] -right-32 w-[480px] h-[480px] rounded-full opacity-35 blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(168,132,63,0.25) 0%, transparent 70%)' }}
      />

      <div className="relative w-full">
        <div className="flex flex-col gap-[80px] sm:gap-[120px] md:gap-[160px] py-[50px] sm:py-[75px] md:py-[100px]">
          {categories.map((category, index) => (
            <PricingBlock
              key={category.id}
              category={category}
              index={index}
              eyebrow={pricing.eyebrow}
              cta={pricing.cta}
              currency={pricing.currency}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
