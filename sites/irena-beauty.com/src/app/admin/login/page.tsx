'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAdminI18n } from '@/components/i18n/AdminLocaleProvider'
import AdminLanguageSwitcher from '@/components/i18n/AdminLanguageSwitcher'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { t, dir } = useAdminI18n()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (res.ok) {
        router.replace('/admin/blog')
        router.refresh()
        return
      }

      await res.json().catch(() => ({}))
      setError(res.status === 401 ? t.login.wrongPassword : t.login.errorGeneric)
    } catch {
      setError(t.login.errorNetwork)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[380px] mx-4" dir={dir}>
      <div className="flex justify-center mb-4">
        <AdminLanguageSwitcher />
      </div>
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center mb-8">
          <Image src="/icons/white-logo.svg" alt="Admin panel" width={48} height={48} unoptimized
            className="invert mb-3" />
          <h1 className="text-[20px] font-bold text-[#111827]">{t.brand}</h1>
          <p className="text-[13px] text-[#6b7280] mt-1">{t.login.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[13px] font-medium text-[#374151] mb-1.5">
              {t.login.passwordLabel}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.login.passwordPlaceholder}
              required
              className="w-full px-4 py-2.5 border border-[#d9d9d9] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1B1BB3]/30 focus:border-[#1B1BB3] text-start"
            />
          </div>

          {error && (
            <p className="text-[13px] text-red-500 text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg text-white text-[14px] font-bold disabled:opacity-60 transition-opacity hover:opacity-90"
            style={{ background: 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)' }}
          >
            {loading ? t.login.submitting : t.login.submit}
          </button>
        </form>
      </div>
    </div>
  )
}
