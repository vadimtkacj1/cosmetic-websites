'use client';
import Image from'next/image';
import Reveal from '@/components/ui/Reveal';
import { useBooking } from '@/components/booking/BookingContext';

import { useSiteContent } from '@/components/i18n/LocaleProvider';

interface FeatureCardProps {
  icon: string
  title: string
  description: string
  iconAlt: string
}

const FeatureCard = ({ icon, title, description, iconAlt }: FeatureCardProps) => (
  <div className="flex flex-col gap-[24px] justify-start items-center bg-secondary-background p-[18px] sm:p-[24px] md:p-[40px] h-full">
    <div className="flex flex-col gap-[24px] justify-start items-start w-full">
      <Image
        src={icon}
        alt={iconAlt}
        width={74}
        height={74}
        unoptimized
        className="w-[60px] h-[60px] sm:w-[67px] sm:h-[67px] md:w-[74px] md:h-[74px]"
      />

      <div className="flex flex-col gap-[12px] justify-start items-start w-full">
        <h3 className="text-[20px] sm:text-[21px] md:text-xl font-semibold leading-2xl text-start text-text-primary" style={{ fontFamily: 'Nunito Sans' }}>
          {title}
        </h3>
        <p className="text-[17px] sm:text-[17px] md:text-lg font-normal leading-loose text-start text-text-secondary" style={{ fontFamily: 'Nunito Sans' }}>
          {description}
        </p>
      </div>
    </div>
  </div>
)

const FEATURE_ICONS = [
  '/images/img_vector_white_a700.svg',
  '/images/img_vector_white_a700_74x74.svg',
  '/images/img_vector_74x74.svg',
  '/images/img_vector_1.svg',
]

export default function WhyChooseUsSection() {
  const { openBooking } = useBooking();
  const { why } = useSiteContent();
  const features: FeatureCardProps[] = why.features.map((f, i) => ({
    icon: FEATURE_ICONS[i] ?? FEATURE_ICONS[0],
    title: f.title,
    description: f.description,
    iconAlt: f.title,
  }));
  return (
    <section className="w-full bg-secondary-light">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-[40px] sm:py-[60px] md:py-[80px]">
        <div className="flex flex-col gap-[30px] sm:gap-[45px] md:gap-[60px] max-w-[1142px] mx-auto">
          {/* Section Header */}
          <Reveal className="flex flex-col gap-[14px] justify-start items-center max-w-[468px] mx-auto">
            <h2 className="text-[28px] sm:text-[36px] md:text-[48px] font-medium leading-[36px] sm:leading-[48px] md:leading-7xl text-center text-text-primary" style={{ fontFamily: 'Playfair Display' }}>
              {why.title}
            </h2>
            <p className="text-[17px] sm:text-[17px] md:text-lg font-normal leading-loose text-center text-text-secondary" style={{ fontFamily: 'Nunito Sans' }}>
              {why.subtitle}
            </p>
          </Reveal>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[16px] sm:gap-[20px] md:gap-[24px] w-full">
            {/* First Column */}
            <div className="flex flex-col gap-[16px] sm:gap-[20px] md:gap-[24px]">
              <Reveal direction="up" delay={0}><FeatureCard {...features[0]} /></Reveal>
              <Reveal direction="up" delay={120}><FeatureCard {...features[1]} /></Reveal>
            </div>

            {/* Second Column - Booking Card */}
            <Reveal direction="up" delay={80} className="flex flex-col gap-[16px] sm:gap-[20px] md:gap-[24px] bg-secondary-background p-[18px] sm:p-[24px] md:p-[18px]">
              <div className="flex flex-col gap-[24px] justify-start items-center pt-[22px] sm:pt-[33px] md:pt-[44px] px-[15px] sm:px-[22px] md:px-[30px]">
                <div className="flex flex-col gap-[10px] justify-start items-center w-full">
                  <h3 className="text-[22px] sm:text-[27px] md:text-3xl font-semibold leading-5xl text-center text-text-primary" style={{ fontFamily: 'Nunito Sans' }}>
                    {why.bookingTitle}
                  </h3>
                  <p className="text-[17px] sm:text-[17px] md:text-lg font-normal leading-loose text-center text-text-secondary" style={{ fontFamily: 'Nunito Sans' }}>
                    {why.bookingText}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openBooking}
                  className="flex flex-row justify-center items-center bg-primary-background px-[14px] py-[14px] rounded-xl hover:opacity-90 transition-opacity"
                >
                  <span className="text-[15px] sm:text-[15px] md:text-base font-normal leading-relaxed text-start text-text-white" style={{ fontFamily: 'Nunito Sans' }}>
                    {why.bookingCta}
                  </span>
                </button>
              </div>
              
              <Image
                src="/images/img_image_31.png"
                alt="Book appointment illustration"
                width={326}
                height={382}
                className="w-full h-auto"
              />
            </Reveal>

            {/* Third Column */}
            <div className="flex flex-col gap-[16px] sm:gap-[20px] md:gap-[24px]">
              <Reveal direction="up" delay={160}><FeatureCard {...features[2]} /></Reveal>
              <Reveal direction="up" delay={240}><FeatureCard {...features[3]} /></Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}