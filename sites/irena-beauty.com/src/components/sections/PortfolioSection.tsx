'use client';
import { useState, useMemo, useEffect, useCallback } from 'react';
import Reveal from '@/components/ui/Reveal';
import { useInView } from '@/hooks/useInView';
import { useSiteContent } from '@/components/i18n/LocaleProvider';

type MediaItem = {
  type: 'photo' | 'video';
  src: string;
};

const MediaTile = ({ item, index, onOpen }: { item: MediaItem; index: number; onOpen: () => void }) => {
  const { ref, inView } = useInView<HTMLButtonElement>();
  return (
    <button
      ref={ref}
      onClick={onOpen}
      style={{ transitionDelay: `${(index % PAGE_SIZE) * 50}ms` }}
      className={`group relative mb-[12px] sm:mb-[16px] block w-full overflow-hidden rounded-sm bg-secondary-background break-inside-avoid cursor-pointer transition-all duration-700 ease-out ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      {item.type === 'photo' ? (
        <img
          src={item.src}
          alt={`Работа ${index + 1}`}
          loading="lazy"
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <>
          <video
            src={item.src}
            muted
            playsInline
            preload="metadata"
            className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-black/20 transition-colors group-hover:bg-black/30">
            <span className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-white/90 shadow-md">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-[3px] text-text-primary">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        </>
      )}
    </button>
  );
};

const PAGE_SIZE = 12;

type Filter = 'all' | 'photo' | 'video';

export default function PortfolioSection() {
  const { portfolio } = useSiteContent();
  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: portfolio.filterAll },
    { key: 'photo', label: portfolio.filterPhoto },
    { key: 'video', label: portfolio.filterVideo },
  ];
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

  useEffect(() => {
    let active = true;
    fetch(`${basePath}/api/public/portfolio`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data: MediaItem[]) => {
        if (active) setMedia(Array.isArray(data) ? data.map((d) => ({ ...d, src: `${basePath}${d.src}` })) : []);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const items = useMemo(() => {
    if (filter === 'photo') return media.filter((m) => m.type === 'photo');
    if (filter === 'video') return media.filter((m) => m.type === 'video');
    return media;
  }, [filter, media]);

  const shown = items.slice(0, visible);

  const changeFilter = (key: Filter) => {
    setFilter(key);
    setVisible(PAGE_SIZE);
  };

  const closeLightbox = useCallback(() => setLightbox(null), []);
  const prev = useCallback(
    () => setLightbox((i) => (i === null ? i : (i - 1 + items.length) % items.length)),
    [items.length]
  );
  const next = useCallback(
    () => setLightbox((i) => (i === null ? i : (i + 1) % items.length)),
    [items.length]
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [lightbox, closeLightbox, prev, next]);

  const active = lightbox !== null ? items[lightbox] : null;

  return (
    <section id="portfolio" className="w-full bg-secondary-light">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-[40px] sm:py-[60px] md:py-[80px]">
        <div className="flex flex-col gap-[24px] sm:gap-[36px] md:gap-[48px]">
          {/* Section Title */}
          <Reveal>
          <h2
            className="text-[28px] sm:text-[36px] md:text-[48px] font-medium leading-[36px] sm:leading-[48px] md:leading-7xl text-center text-text-primary"
            style={{ fontFamily: 'Playfair Display' }}
          >
            {portfolio.title}
          </h2>
          </Reveal>

          {/* Filter Tabs */}
          <div className="flex flex-row flex-wrap justify-center gap-[10px] sm:gap-[14px]">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => changeFilter(f.key)}
                className={`px-[20px] sm:px-[28px] py-[8px] sm:py-[10px] rounded-full text-[15px] sm:text-base font-semibold transition-colors duration-200 border ${
                  filter === f.key
                    ? 'bg-accent text-accent-foreground border-accent'
                    : 'bg-transparent text-text-primary border-border-light hover:bg-secondary-background'
                }`}
                style={{ fontFamily: 'Nunito Sans' }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Masonry Grid */}
          <div className="columns-2 md:columns-3 lg:columns-4 gap-[12px] sm:gap-[16px] [column-fill:_balance]">
            {shown.map((item, index) => (
              <MediaTile key={item.src} item={item} index={index} onOpen={() => setLightbox(index)} />
            ))}
          </div>

          {/* Show More */}
          {visible < items.length && (
            <div className="flex justify-center">
              <button
                onClick={() => setVisible((v) => v + PAGE_SIZE)}
                className="px-[32px] py-[12px] rounded-full bg-button-background text-button-text text-base font-semibold hover:bg-button-hover transition-colors duration-200"
                style={{ fontFamily: 'Nunito Sans' }}
              >
                {portfolio.showMore}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {active && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4"
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            onClick={closeLightbox}
            aria-label="Закрыть"
            className="absolute top-[16px] right-[16px] flex h-[44px] w-[44px] items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Предыдущее"
            className="absolute left-[12px] sm:left-[24px] flex h-[44px] w-[44px] items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Следующее"
            className="absolute right-[12px] sm:right-[24px] flex h-[44px] w-[44px] items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Media */}
          <div className="max-h-[88vh] max-w-[92vw]" onClick={(e) => e.stopPropagation()}>
            {active.type === 'photo' ? (
              <img
                src={active.src}
                alt="Работа"
                className="max-h-[88vh] max-w-[92vw] w-auto h-auto object-contain rounded-sm"
              />
            ) : (
              <video
                src={active.src}
                controls
                autoPlay
                playsInline
                className="max-h-[88vh] max-w-[92vw] w-auto h-auto object-contain rounded-sm"
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
