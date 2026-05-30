'use client'

import { Menu } from 'lucide-react'
import { useAdminMenu } from './AdminMenuContext'
import { useAdminI18n } from '@/components/i18n/AdminLocaleProvider'

export default function AdminHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  const { onBurger } = useAdminMenu()
  const { t } = useAdminI18n()

  return (
    <header style={{
      height: 56,
      background: '#fff',
      borderBottom: '1px solid #e5e7eb',
      boxShadow: '0 1px 0 rgba(0,0,0,0.03)',
      position: 'sticky',
      top: 0,
      zIndex: 10,
      display: 'flex',
      alignItems: 'center',
      padding: '0 24px',
      gap: 12,
    }}>
      <button
        onClick={onBurger}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', padding: 4, display: 'flex' }}
      >
        <Menu size={20} />
      </button>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', lineHeight: 1.2 }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 1 }}>{subtitle}</div>}
      </div>

      <div style={{ fontSize: 13, color: '#9ca3af', fontWeight: 500 }}>{t.brand}</div>
    </header>
  )
}
