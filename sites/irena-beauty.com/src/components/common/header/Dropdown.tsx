'use client';
import Image from 'next/image';
import NavLink from './NavLink';

export interface DropdownItem { label: string; href: string }

const Dropdown = ({ label, items }: { label: string; items: DropdownItem[] }) => (
  <div className="relative group px-[14px] py-[14px]">
    <button
      className="flex flex-row gap-[14px] justify-center items-center text-base font-normal leading-relaxed text-header-link hover:text-header-linkHover transition-colors"
      style={{ fontFamily: 'Nunito Sans' }}
      aria-haspopup="true"
      aria-expanded="false"
    >
      {label}
      <Image src="/images/img_vector_gray_600.svg" alt="dropdown" width={6} height={3} className="w-[6px] h-[3px]" />
    </button>
    <ul
      role="menu"
      className="hidden group-hover:block absolute top-full left-0 mt-2 bg-header-background border border-border-light rounded-sm shadow-lg min-w-[180px] z-50"
    >
      {items.map(({ label: itemLabel, href }) => (
        <li key={href} role="menuitem" className="px-4 py-2 hover:bg-secondary-light">
          <NavLink href={href}>{itemLabel}</NavLink>
        </li>
      ))}
    </ul>
  </div>
)

export default Dropdown;
