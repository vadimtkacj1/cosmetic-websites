'use client'

import type { ReactNode } from 'react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import { AdminMenuContext } from '@/components/admin/AdminMenuContext'
import { AdminLocaleProvider, useAdminI18n } from '@/components/i18n/AdminLocaleProvider'

function AdminShell({ children }: { children: ReactNode }) {
  const { dir } = useAdminI18n()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [desktopOpen, setDesktopOpen] = useState(true)
  const isRtl = dir === 'rtl'

  return (
    <AdminMenuContext.Provider value={{
      onBurger: () => {
        if (window.innerWidth >= 768) setDesktopOpen((v) => !v)
        else setMobileOpen(true)
      },
    }}>
      <div dir={dir} style={{ display: 'flex', minHeight: '100vh', background: '#f5f5f5' }}>
        <AdminSidebar
          mobileOpen={mobileOpen}
          onMobileClose={() => setMobileOpen(false)}
          desktopOpen={desktopOpen}
        />
        <div
          style={{
            flex: 1,
            minWidth: 0,
            transition: 'margin 0.25s ease',
          }}
          className={
            desktopOpen
              ? isRtl
                ? 'max-w-full md:mr-[248px]'
                : 'max-w-full md:ml-[248px]'
              : 'max-w-full'
          }
        >
          <main style={{ minHeight: '100vh' }}>
            {children}
          </main>
        </div>
      </div>
    </AdminMenuContext.Provider>
  )
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname === '/admin/login'

  return (
    <AdminLocaleProvider>
      {isLogin ? (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
          {children}
        </div>
      ) : (
        <AdminShell>{children}</AdminShell>
      )}
    </AdminLocaleProvider>
  )
}
