'use client';
import { useState, useRef } from 'react';
import Reveal from '@/components/ui/Reveal';
import { useLocale } from '@/components/i18n/LocaleProvider';

interface TestimonialCardProps {
  image: string
  name: string
  location: string
  testimonial: string
  imageAlt: string
}

const TestimonialCard = ({ image, name, location, testimonial, imageAlt }: TestimonialCardProps) => (
  <div className="flex flex-col sm:flex-row gap-[16px] sm:gap-[20px] md:gap-[24px] justify-start items-start bg-secondary-background p-[20px] sm:p-[30px] md:p-[40px] w-full">
    <img
      src={image}
      alt={imageAlt}
      className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[120px] md:h-[120px] rounded-full mx-auto sm:mx-0 flex-shrink-0 object-cover"
    />
    <div className="flex flex-col gap-[20px] sm:gap-[30px] md:gap-[40px] justify-start items-center w-full">
      <p className="text-[17px] sm:text-[17px] md:text-lg font-normal leading-loose text-start text-text-secondary" style={{ fontFamily: 'Nunito Sans' }}>
        {testimonial}
      </p>
      <div className="flex flex-row justify-between items-center w-full">
        <div className="flex flex-col gap-[6px] sm:gap-[7px] md:gap-[8px] justify-start items-start">
          <h3 className="text-[20px] sm:text-[21px] md:text-xl font-semibold leading-2xl text-start text-text-primary" style={{ fontFamily: 'Nunito Sans' }}>
            {name}
          </h3>
          <p className="text-[17px] sm:text-[17px] md:text-lg font-normal leading-xl text-start text-text-secondary" style={{ fontFamily: 'Nunito Sans' }}>
            {location}
          </p>
        </div>
      </div>
    </div>
  </div>
)

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
const TESTIMONIAL_IMAGES = [`${BASE}/images/img_image_120x120.png`, `${BASE}/images/img_image_3.png`, `${BASE}/images/img_image_4.png`]

export default function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const { content, dir } = useLocale()
  const testimonialsContent = content.testimonials
  const isRtl = dir === 'rtl'

  const testimonials = testimonialsContent.items.map((t, i) => ({
    image: TESTIMONIAL_IMAGES[i] ?? TESTIMONIAL_IMAGES[0],
    name: t.name,
    location: t.location,
    testimonial: t.text,
    imageAlt: t.name,
  }))

  const prev = () => setCurrentIndex(i => (i - 1 + testimonials.length) % testimonials.length)
  const next = () => setCurrentIndex(i => (i + 1) % testimonials.length)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) {
      if (diff > 0) isRtl ? prev() : next()
      else isRtl ? next() : prev()
    }
  }

  return (
    <section className="w-full bg-secondary-light">
      <div className="w-full">
        <div className="flex flex-col gap-[30px] sm:gap-[45px] md:gap-[60px] justify-center items-center py-[40px] sm:py-[60px] md:py-[80px]">
          <Reveal>
          <h2 className="text-[28px] sm:text-[36px] md:text-[48px] font-medium leading-[36px] sm:leading-[48px] md:leading-7xl text-center text-text-primary px-4" style={{ fontFamily: 'Playfair Display' }}>
            {testimonialsContent.title}
          </h2>
          </Reveal>

          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6">
            <Reveal delay={120} className="max-w-[1142px] mx-auto">
              {/* Slider */}
              {/* dir="ltr" isolates slider from RTL so translateX always works physically */}
              <div
                dir="ltr"
                className="overflow-hidden"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {testimonials.map((testimonial, index) => (
                    <div key={index} dir={dir} className="w-full flex-shrink-0">
                      <TestimonialCard {...testimonial} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center mt-[20px] sm:mt-[24px]">
                <button
                  onClick={isRtl ? next : prev}
                  className="p-[10px] sm:p-[12px] bg-secondary-background hover:bg-primary-background hover:text-white transition-colors rounded-full shadow"
                  aria-label="previous"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <div className="flex gap-[10px]">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`w-[10px] h-[10px] rounded-full transition-colors ${
                        i === currentIndex ? 'bg-primary-background' : 'bg-gray-300'
                      }`}
                      aria-label={`${i + 1}`}
                    />
                  ))}
                </div>

                <button
                  onClick={isRtl ? prev : next}
                  className="p-[10px] sm:p-[12px] bg-secondary-background hover:bg-primary-background hover:text-white transition-colors rounded-full shadow"
                  aria-label="next"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
