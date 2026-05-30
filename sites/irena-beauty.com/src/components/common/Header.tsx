'use client';
import { useState } from 'react';
import Logo from './header/Logo';
import DesktopNav from './header/DesktopNav';
import DesktopActions from './header/DesktopActions';
import MobileMenuButton from './header/MobileMenuButton';
import MobileNav from './header/MobileNav';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="w-full sticky top-0 z-50">
      <div className="w-full bg-header-background shadow-md">
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6">
          {/* Force LTR so element positions (logo / nav / actions) stay identical across locales */}
          <div dir="ltr" className="flex flex-row justify-between items-center py-4 md:py-6">
            <Logo />
            <DesktopNav />
            <DesktopActions />
            <MobileMenuButton open={menuOpen} onToggle={() => setMenuOpen(v => !v)} />
          </div>
          <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
        </div>
      </div>
    </header>
  )
}

export default Header;
