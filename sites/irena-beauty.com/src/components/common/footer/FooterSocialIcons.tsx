'use client';

const FooterSocialIcons = () => (
  <div className="flex flex-row gap-[12px] items-center">
    <a
      href="https://www.instagram.com/beautyiren/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Instagram"
      className="w-[24px] h-[24px] opacity-70 hover:opacity-100 transition-opacity"
    >
      <svg viewBox="0 0 24 24" width={24} height={24} fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    </a>
  </div>
)

export default FooterSocialIcons;
