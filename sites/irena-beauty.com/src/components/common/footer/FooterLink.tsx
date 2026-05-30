'use client';
import Link from '../../ui/Link';

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    variant="footer"
    text_font_size="text-lg"
    text_font_family="Nunito Sans"
    text_font_weight="font-normal"
    text_line_height="leading-xl"
    text_color="text-text-white"
    className="text-lg font-normal leading-xl text-text-white hover:text-accent-DEFAULT transition-colors"
    style={{ fontFamily: 'Nunito Sans' }}
  >
    {children}
  </Link>
)

export default FooterLink;
