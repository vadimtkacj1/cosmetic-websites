'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Bell, CalendarDays, Clock, FileText, HelpCircle, Images, Languages, LogOut, Megaphone, X } from 'lucide-react'
import { useAdminI18n } from '@/components/i18n/AdminLocaleProvider'
import AdminLanguageSwitcher from '@/components/i18n/AdminLanguageSwitcher'
import type { AdminStrings } from '@/lib/i18n/admin-strings'

const SIDEBAR_BG = '#0f172a'
const BORDER_SUBTLE = 'rgba(255,255,255,0.06)'
const BORDER_MID = 'rgba(255,255,255,0.08)'

function buildLinks(t: AdminStrings) {
  return [
    { href: '/admin/bookings', label: t.nav.bookings, icon: CalendarDays, exact: false },
    { href: '/admin/slots', label: t.nav.slots, icon: Clock, exact: false },
    { href: '/admin/messenger', label: t.nav.messenger, icon: Megaphone, exact: true },
    { href: '/admin/notifications', label: t.nav.telegram, icon: Bell, exact: true },
    { href: '/admin/content', label: t.nav.content, icon: Languages, exact: false },
    { href: '/admin/portfolio', label: t.nav.portfolio, icon: Images, exact: false },
    { href: '/admin/blog', label: t.nav.posts, icon: FileText, exact: false },
    { href: '/admin/help', label: t.nav.help, icon: HelpCircle, exact: true },
  ]
}

function SideMenu({ pathname, t }: { pathname: string; t: AdminStrings }) {
  return (
    <nav style={{ padding: '8px 8px' }} className="flex flex-col gap-0.5">
      {buildLinks(t).map(({ href, label, icon: Icon, exact }) => {
        const active = exact
          ? pathname === href
          : pathname.startsWith(href) && pathname !== '/admin/blog/new'
        return (
          <Link
            key={href}
            href={href}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '9px 14px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 500,
              transition: 'all 0.15s',
              background: active ? 'linear-gradient(92.63deg,#1B1BB3 14.57%,#530FAD 99.27%)' : 'transparent',
              color: active ? '#fff' : 'rgba(255,255,255,0.55)',
            }}
            onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = '#fff'; if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)' }}
            onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.55)'; if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            <Icon size={16} strokeWidth={2} />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

function SidebarInner({ onClose, pathname, onLogout, t }: { onClose?: () => void; pathname: string; onLogout: () => void; t: AdminStrings }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: SIDEBAR_BG }}>
      {/* Close button — mobile only */}
      {onClose && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '12px 12px 0' }}>
          <button
            onClick={onClose}
            style={{ color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer', padding: 6, borderRadius: 6 }}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {/* Logo */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: onClose ? '8px 12px 20px' : '20px 12px 16px' }}>
        <Image src="/icons/white-logo.svg" alt="Admin panel" width={120} height={40} unoptimized style={{ objectFit: 'contain' }} />
      </div>

      {/* Language switcher */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 12px 12px' }}>
        <AdminLanguageSwitcher />
      </div>

      {/* Menu */}
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <SideMenu pathname={pathname} t={t} />
      </div>

      {/* Footer: logout */}
      <div style={{ padding: '14px 8px 20px', borderTop: `1px solid ${BORDER_MID}` }}>
        <button
          onClick={onLogout}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '9px 14px',
            borderRadius: 8,
            fontSize: 14,
            color: 'rgba(255,255,255,0.45)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)'; (e.currentTarget as HTMLElement).style.background = 'none' }}
        >
          <LogOut size={16} strokeWidth={2} />
          {t.common.logout}
        </button>
      </div>
    </div>
  )
}

export default function AdminSidebar({ mobileOpen, onMobileClose, desktopOpen = true }: { mobileOpen?: boolean; onMobileClose?: () => void; desktopOpen?: boolean }) {
  const pathname = usePathname()
  const router = useRouter()
  const { t, dir } = useAdminI18n()
  const isRtl = dir === 'rtl'

  const logout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
  }

  const sideAnchor = isRtl ? { right: 0 } : { left: 0 }
  const offHidden = isRtl ? 'translateX(100%)' : 'translateX(-100%)'

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside style={{
        width: 248,
        flexShrink: 0,
        height: '100vh',
        background: SIDEBAR_BG,
        position: 'fixed',
        top: 0,
        bottom: 0,
        ...sideAnchor,
        zIndex: 20,
        borderLeft: isRtl ? `1px solid ${BORDER_SUBTLE}` : 'none',
        borderRight: isRtl ? 'none' : `1px solid ${BORDER_SUBTLE}`,
        transform: desktopOpen ? 'translateX(0)' : offHidden,
        transition: 'transform 0.25s ease',
      }} className="hidden md:block">
        <SidebarInner pathname={pathname} onLogout={logout} t={t} />
      </aside>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <>
          <div
            onClick={onMobileClose}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 30 }}
          />
          <aside style={{
            position: 'fixed',
            top: 0,
            bottom: 0,
            ...sideAnchor,
            width: 288,
            zIndex: 40,
            background: SIDEBAR_BG,
          }}>
            <SidebarInner pathname={pathname} onClose={onMobileClose} onLogout={logout} t={t} />
          </aside>
        </>
      )}
    </>
  )
}
