'use client';
import { useParallax } from '@/hooks/useParallax';
import { useInView } from '@/hooks/useInView';
import { useSiteContent } from '@/components/i18n/LocaleProvider';

const MAPS_QUERY = 'Sokol+41+Holon+Israel';
const PHONE_HREF = 'tel:+972539594370';
const INSTAGRAM_URL = 'https://www.instagram.com/irena_beauty_time/';
const WHATSAPP_HREF = 'https://wa.me/972539594370';

const MAP_EMBED_SRC = `https://www.google.com/maps?q=${MAPS_QUERY}&hl=ru&z=16&output=embed`;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${MAPS_QUERY}`;

const PinIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-7.06-7-12a7 7 0 1 1 14 0c0 4.94-7 12-7 12z" />
    <circle cx="12" cy="9" r="2.5" />
  </svg>
);

const PhoneIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M22 16.92v3a2 2 0 0 1-2.18 2 19.86 19.86 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.86 19.86 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.78.66 2.62a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.46-1.23a2 2 0 0 1 2.11-.45c.84.32 1.72.54 2.62.66A2 2 0 0 1 22 16.92z" />
  </svg>
);

const ClockIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <circle cx="12" cy="12" r="9" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 2" />
  </svg>
);

const InstagramIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const WhatsAppIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

interface ContactRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
  delay: number;
}

const ContactRow = ({ icon, label, value, href, external, delay }: ContactRowProps) => {
  const { ref, inView } = useInView<HTMLDivElement>();

  const inner = (
    <>
      <span className="flex-shrink-0 w-[44px] h-[44px] bg-secondary-light flex items-center justify-center text-primary-background group-hover:bg-primary-background group-hover:text-text-white transition-colors duration-300">
        {icon}
      </span>
      <div className="flex flex-col gap-[4px] pt-[2px]">
        <span
          className="text-[15px] font-normal leading-relaxed text-text-secondary"
          style={{ fontFamily: 'Nunito Sans' }}
        >
          {label}
        </span>
        <span
          className="text-[17px] sm:text-[17px] md:text-lg font-normal leading-xl text-text-primary group-hover:text-primary-background transition-colors break-words"
          style={{ fontFamily: 'Nunito Sans' }}
        >
          {value}
        </span>
      </div>
    </>
  );

  const cls = `group flex flex-row gap-[16px] items-start transition-all duration-700 ease-out hover:translate-x-1 ${
    inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
  }`;

  if (!href) {
    return (
      <div ref={ref} className={cls} style={{ transitionDelay: `${delay}ms` }}>
        {inner}
      </div>
    );
  }

  return (
    <a
      ref={ref as unknown as React.Ref<HTMLAnchorElement>}
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      className={cls}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {inner}
    </a>
  );
};

export default function ContactSection() {
  const { contact, business } = useSiteContent();
  const { ref: blob1Ref, offset: blob1Offset } = useParallax<HTMLDivElement>(0.25);
  const { ref: blob2Ref, offset: blob2Offset } = useParallax<HTMLDivElement>(-0.18);
  const { ref: cardRef, inView: cardInView } = useInView<HTMLDivElement>();
  const { ref: mapRef, inView: mapInView } = useInView<HTMLDivElement>();
  const { ref: headerRef, inView: headerInView } = useInView<HTMLDivElement>();

  return (
    <section id="contact" className="relative w-full bg-secondary-light overflow-hidden">
      {/* Parallax decorative blobs */}
      <div
        ref={blob1Ref}
        aria-hidden
        className="pointer-events-none absolute top-[10%] -left-32 w-[460px] h-[460px] rounded-full opacity-40 blur-3xl will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(194,160,90,0.32) 0%, transparent 70%)',
          transform: `translate3d(0, ${blob1Offset}px, 0)`,
        }}
      />
      <div
        ref={blob2Ref}
        aria-hidden
        className="pointer-events-none absolute bottom-[5%] -right-24 w-[420px] h-[420px] rounded-full opacity-35 blur-3xl will-change-transform"
        style={{
          background: 'radial-gradient(circle, rgba(168,132,63,0.28) 0%, transparent 70%)',
          transform: `translate3d(0, ${blob2Offset}px, 0)`,
        }}
      />

      <div className="relative w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-[40px] sm:py-[60px] md:py-[80px]">
        <div className="flex flex-col gap-[30px] sm:gap-[45px] md:gap-[60px] max-w-[1142px] mx-auto">
          {/* Header */}
          <div
            ref={headerRef}
            className={`flex flex-col gap-[14px] justify-start items-center max-w-[560px] mx-auto transition-all duration-1000 ease-out ${
              headerInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <h2
              className="text-[28px] sm:text-[36px] md:text-[48px] font-medium leading-[36px] sm:leading-[48px] md:leading-7xl text-center text-text-primary"
              style={{ fontFamily: 'Playfair Display' }}
            >
              {contact.title}
            </h2>
            <p
              className="text-[17px] sm:text-[17px] md:text-lg font-normal leading-loose text-center text-text-secondary"
              style={{ fontFamily: 'Nunito Sans' }}
            >
              {contact.subtitle}
            </p>
          </div>

          {/* Body */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px] sm:gap-[20px] md:gap-[24px] w-full">
            {/* Contacts card */}
            <div
              ref={cardRef}
              className={`flex flex-col gap-[28px] sm:gap-[32px] md:gap-[36px] bg-secondary-background p-[20px] sm:p-[30px] md:p-[40px] transition-all duration-1000 ease-out ${
                cardInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'
              }`}
            >
              <h3
                className="text-[22px] sm:text-[27px] md:text-3xl font-semibold leading-5xl text-text-primary"
                style={{ fontFamily: 'Nunito Sans' }}
              >
                {contact.title}
              </h3>

              <div className="flex flex-col gap-[22px] sm:gap-[24px]">
                <ContactRow
                  icon={<PinIcon className="w-5 h-5" />}
                  label={contact.labelAddress}
                  value={business.address}
                  href={MAP_LINK}
                  external
                  delay={0}
                />
                <ContactRow
                  icon={<PhoneIcon className="w-5 h-5" />}
                  label={contact.labelPhone}
                  value={business.phoneDisplay}
                  href={PHONE_HREF}
                  delay={80}
                />
                <ContactRow
                  icon={<InstagramIcon className="w-5 h-5" />}
                  label={contact.labelInstagram}
                  value={business.instagramHandle}
                  href={INSTAGRAM_URL}
                  external
                  delay={160}
                />
                <ContactRow
                  icon={<ClockIcon className="w-5 h-5" />}
                  label={contact.labelHours}
                  value={contact.hours}
                  delay={240}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-[12px] sm:gap-[16px] mt-auto">
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-[10px] bg-primary-background text-text-white px-[26px] py-[14px] rounded-xl hover:opacity-90 hover:-translate-y-0.5 transition-all duration-300"
                  style={{ fontFamily: 'Nunito Sans' }}
                >
                  <WhatsAppIcon className="w-[18px] h-[18px]" />
                  <span className="text-[15px] sm:text-[15px] md:text-base font-normal leading-relaxed">
                    {contact.whatsappCta}
                  </span>
                </a>
                <a
                  href={PHONE_HREF}
                  className="inline-flex items-center justify-center gap-[10px] border border-primary-background text-text-primary px-[26px] py-[14px] rounded-xl hover:bg-primary-background hover:text-text-white hover:-translate-y-0.5 transition-all duration-300"
                  style={{ fontFamily: 'Nunito Sans' }}
                >
                  <PhoneIcon className="w-[18px] h-[18px]" />
                  <span className="text-[15px] sm:text-[15px] md:text-base font-normal leading-relaxed">
                    {contact.callCta}
                  </span>
                </a>
              </div>
            </div>

            {/* Map */}
            <div
              ref={mapRef}
              className={`relative bg-secondary-background min-h-[340px] sm:min-h-[420px] lg:min-h-full overflow-hidden transition-all duration-1000 ease-out ${
                mapInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
              }`}
            >
              <iframe
                title="Студия Irena Beauty Time — карта"
                src={MAP_EMBED_SRC}
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              {/* Floating address tag */}
              <a
                href={MAP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-[16px] left-[16px] inline-flex items-center gap-[10px] px-[16px] py-[10px] bg-secondary-background hover:bg-primary-background text-text-primary hover:text-text-white shadow-md transition-colors duration-300"
                style={{ fontFamily: 'Nunito Sans' }}
              >
                <PinIcon className="w-4 h-4" />
                <span className="text-[12px] tracking-[0.1em] uppercase">{contact.openMaps}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
