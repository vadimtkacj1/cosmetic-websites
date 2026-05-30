'use client';
import Image from 'next/image';
import { useSiteContent } from '@/components/i18n/LocaleProvider';

interface ContactRowProps { icon: string; label: string; value: string; href: string }

const ContactRow = ({ icon, label, value, href }: ContactRowProps) => (
  <div className="flex flex-row gap-[12px] items-start">
    <Image src={icon} alt={label} width={24} height={24} className="w-[24px] h-[24px] mt-1 flex-shrink-0" />
    <div className="flex flex-col gap-[4px]">
      <span className="text-[15px] font-normal leading-snug text-text-secondary" style={{ fontFamily: 'Nunito Sans' }}>
        {label}
      </span>
      <a
        href={href}
        className="text-base font-normal leading-relaxed text-text-white hover:text-accent-DEFAULT transition-colors break-all"
        style={{ fontFamily: 'Nunito Sans' }}
      >
        {value}
      </a>
    </div>
  </div>
)

const FooterContacts = () => {
  const { footer, business } = useSiteContent();
  return (
  <div className="flex flex-col gap-[22px] w-full lg:w-[18%]">
    <h3 className="text-xl sm:text-2xl font-semibold leading-2xl text-text-white" style={{ fontFamily: 'Nunito Sans' }}>
      {footer.contactsTitle}
    </h3>
    <div className="flex flex-col gap-[22px]">
      <ContactRow
        icon="/images/img_vector_3.svg"
        label={footer.labelAddress}
        value={business.address}
        href="https://maps.google.com"
      />
      <ContactRow
        icon="/images/img_vector_4.svg"
        label={footer.labelPhone}
        value={business.phoneDisplay}
        href="tel:+972539594370"
      />
      <ContactRow
        icon="/images/img_vector_5.svg"
        label={footer.labelInstagram}
        value={business.instagramHandle}
        href="https://www.instagram.com/irena_beauty_time/"
      />
    </div>
  </div>
  )
}

export default FooterContacts;
