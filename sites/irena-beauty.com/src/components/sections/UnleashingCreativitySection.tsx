'use client';
import Image from 'next/image';
import { useRef, useState } from 'react';
import Reveal from '@/components/ui/Reveal';
import { useParallax } from '@/hooks/useParallax';
import { useSiteContent } from '@/components/i18n/LocaleProvider';

const VideoCard = ({ title, subtitle, src }: { title: string; subtitle: string; src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const handleEnter = () => {
    const v = videoRef.current;
    if (v) {
      v.play().then(() => setPlaying(true)).catch(() => {});
    }
  };
  const handleLeave = () => {
    const v = videoRef.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
      setPlaying(false);
    }
  };

  return (
    <div
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="relative w-full aspect-video bg-[#1d1d1e] flex flex-col items-center justify-center gap-[14px] overflow-hidden group cursor-pointer rounded-[4px] transition-transform duration-500 hover:scale-[1.01] hover:shadow-lg"
    >
      <video
        ref={videoRef}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${playing ? 'opacity-0' : 'bg-black/40'}`}
      />
      <div className={`absolute top-5 left-5 z-10 flex items-center gap-[8px] transition-opacity duration-300 ${playing ? 'opacity-0' : 'opacity-90'}`}>
        <span className="text-[10px] tracking-[0.25em] uppercase text-white/90" style={{ fontFamily: 'Nunito Sans' }}>
          {subtitle}
        </span>
      </div>
      <div className={`relative z-10 w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] rounded-full border border-white/20 bg-black/10 backdrop-blur-sm flex items-center justify-center transition-all duration-500 group-hover:bg-[#c2a05a] group-hover:border-[#c2a05a] group-hover:scale-105 ${playing ? 'opacity-0' : 'opacity-100'}`}>
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6 text-white transition-colors duration-300 ml-[2px]"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      <div className={`relative z-10 flex flex-col items-center gap-[6px] text-center px-4 transition-opacity duration-300 ${playing ? 'opacity-0' : 'opacity-100'}`}>
        <span className="text-white text-[15px] sm:text-base font-medium tracking-wide" style={{ fontFamily: 'Playfair Display', fontStyle: 'italic' }}>
          {title}
        </span>
      </div>
    </div>
  );
};

const SectionEyebrow = ({ label }: { label: string }) => (
  <div className="flex items-center gap-[10px]">
    <span className="text-[11px] sm:text-[12px] tracking-[0.25em] uppercase text-[#c2a05a] font-semibold" style={{ fontFamily: 'Nunito Sans' }}>
      // {label}
    </span>
  </div>
);

const ValueChip = ({ children }: { children: React.ReactNode }) => (
  <span
    className="inline-flex items-center justify-center px-[16px] py-[10px] rounded-md border border-text-primary/10 bg-white/60 backdrop-blur-sm text-[13px] sm:text-[13px] tracking-[0.02em] text-text-primary/90 font-medium transition-colors duration-300 hover:border-[#c2a05a]/40"
    style={{ fontFamily: 'Nunito Sans' }}
  >
    {children}
  </span>
);

export default function UnleashingCreativitySection() {
  const { ref: portraitRef, offset: portraitOffset } = useParallax<HTMLDivElement>(0.05);
  const { about } = useSiteContent();

  return (
    <section id="about" className="relative w-full bg-secondary-light overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute top-12 left-12 w-[500px] h-[500px] rounded-full opacity-20 blur-[80px]"
        style={{ background: '#c2a05a' }}
      />

      <div className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-8 py-[80px] sm:py-[100px] md:py-[140px]">
        <div className="flex flex-col gap-[60px] sm:gap-[80px] md:gap-[110px] max-w-[1140px] mx-auto">

          {/* Заголовок */}
          <Reveal className="flex flex-col items-center gap-[16px] text-center max-w-[760px] mx-auto">
            <SectionEyebrow label={about.eyebrow} />
            <h2
              className="text-[38px] sm:text-[42px] md:text-[52px] font-normal leading-[1.15] text-text-primary tracking-tight"
              style={{ fontFamily: 'Playfair Display' }}
            >
              {about.greetingPrefix}{' '}
              <span className="italic block sm:inline text-[#c2a05a] sm:text-text-primary">
                {about.name}
              </span>
            </h2>
            <p
              className="text-[17px] sm:text-[17px] md:text-lg font-normal leading-[1.75] text-text-secondary/90 mt-2"
              style={{ fontFamily: 'Nunito Sans' }}
            >
              {about.intro}
            </p>
          </Reveal>

          {/* Блок з фото та текстом */}
          <div className="flex flex-col lg:flex-row gap-[48px] md:gap-[64px] lg:gap-[80px] items-center lg:items-start">
            
            {/* Фотографія */}
            <Reveal direction="left" className="relative w-full sm:w-[80%] md:w-[65%] lg:w-[42%] flex-shrink-0">
              <div className="relative overflow-hidden rounded-[4px] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] bg-stone-200">
                <div
                  className="will-change-transform"
                  style={{ transform: `translate3d(0, ${portraitOffset}px, 0) scale(1.05)` }}
                >
                  <Image
                    src="/images/img_image_28.png"
                    alt={about.name}
                    width={520}
                    height={680}
                    className="w-full h-auto block object-cover aspect-[3/4]"
                  />
                </div>
              </div>
              
              {/* Картка студії */}
              <div className="absolute -bottom-4 -right-2 sm:-bottom-6 sm:-right-4 bg-white border border-stone-100 px-[20px] py-[16px] sm:px-[24px] sm:py-[20px] min-w-[200px] rounded-[2px] shadow-sm">
                <div className="flex flex-col gap-[2px]">
                  <span className="text-[9px] tracking-[0.2em] uppercase text-text-secondary/70" style={{ fontFamily: 'Nunito Sans' }}>
                    {about.studioLabel}
                  </span>
                  <span className="text-[15px] sm:text-[16px] text-text-primary font-medium" style={{ fontFamily: 'Playfair Display', fontStyle: 'italic' }}>
                    {about.studioName}
                  </span>
                </div>
              </div>
            </Reveal>

            {/* Текстова історія */}
            <Reveal direction="right" delay={120} className="flex flex-col gap-[32px] w-full lg:w-[58%] lg:pt-4">
              {/* ТУТ ЛІНІЮ ПРИБРАНО, ЗАЛИШИВСЯ ПРОСТО ЧИСТИЙ КУРСИВНИЙ БЛОК */}
              <p
                className="text-[20px] sm:text-[20px] md:text-[22px] font-normal leading-[1.5] text-text-primary italic tracking-wide"
                style={{ fontFamily: 'Playfair Display' }}
              >
                {about.quote}
              </p>

              <div className="flex flex-col gap-[20px]">
                <p className="text-[16px] sm:text-[16px] md:text-[17px] font-normal leading-[1.8] text-text-secondary/90" style={{ fontFamily: 'Nunito Sans' }}>
                  {about.story1}
                </p>
                <p className="text-[16px] sm:text-[16px] md:text-[17px] font-normal leading-[1.8] text-text-secondary/90" style={{ fontFamily: 'Nunito Sans' }}>
                  {about.story2}
                </p>
              </div>

              {/* Теги / Фішки */}
              <div className="flex flex-wrap gap-[8px] pt-2">
                {about.chips.map((chip) => (
                  <ValueChip key={chip}>{chip}</ValueChip>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Велика цитата */}
          <Reveal className="relative max-w-[800px] mx-auto text-center px-4 sm:px-6 pt-8">
            <p
              className="text-[23px] sm:text-[26px] md:text-[30px] leading-[1.45] text-text-primary font-normal tracking-wide"
              style={{ fontFamily: 'Playfair Display', fontStyle: 'italic' }}
            >
              {about.pullQuote}
            </p>
            <div className="mt-6 flex items-center justify-center gap-[8px]">
              <span className="text-[10px] tracking-[0.25em] uppercase text-text-secondary/80" style={{ fontFamily: 'Nunito Sans' }}>
                — {about.signature}
              </span>
            </div>
          </Reveal>

          {/* Відео-блок */}
          <Reveal className="flex flex-col gap-[32px] w-full pt-4">
            <div className="flex flex-col items-center gap-[8px] text-center">
              <span className="text-[10px] tracking-[0.25em] uppercase text-text-secondary/70" style={{ fontFamily: 'Nunito Sans' }}>
                {about.galleryEyebrow}
              </span>
              <h3
                className="text-[28px] sm:text-[30px] md:text-[34px] font-normal text-text-primary"
                style={{ fontFamily: 'Playfair Display' }}
              >
                {about.galleryTitle}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px] md:gap-[24px]">
              <VideoCard title={about.videos[0]?.title ?? ''} subtitle={about.videos[0]?.subtitle ?? ''} src="/images/videos/video_01.mp4" />
              <VideoCard title={about.videos[1]?.title ?? ''} subtitle={about.videos[1]?.subtitle ?? ''} src="/images/videos/video_40.mp4" />
            </div>
          </Reveal>

        </div>
      </div>
    </section>
 
);
}