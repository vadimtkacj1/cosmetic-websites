'use client';
import Link from '../../ui/Link';

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    href={href}
    variant="default"
    text_font_size="text-base"
    text_font_family="Nunito Sans"
    text_font_weight="font-normal"
    text_line_height="leading-relaxed"
    text_color="text-header-link"
    className="text-base font-normal leading-relaxed text-header-link hover:text-header-linkHover transition-colors"
    style={{ fontFamily: 'Nunito Sans' }}
  >
    {children}
  </Link>
)

export default NavLink;
