'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminHeader from '@/components/admin/AdminHeader'
import { useAdminI18n } from '@/components/i18n/AdminLocaleProvider'

const gradient = 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)'

export default function AdminBlogNewPage() {
  const { t } = useAdminI18n()
  const tbl = t.blog
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [image, setImage] = useState('')
  const [content, setContent] = useState('')
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const body: Record<string, string> = { title, excerpt, image, content }
      if (slug.trim()) body.slug = slug.trim()
      const res = await fetch('/api/admin/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : t.login.errorGeneric)
        return
      }
      router.push(`/admin/blog/${encodeURIComponent(data.slug as string)}`)
      router.refresh()
    } catch {
      setError(tbl.networkError)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <AdminHeader title={tbl.newTitle} />

      <div className="p-4 md:p-8 max-w-[720px]">
        <Link
          href="/admin/blog"
          className="inline-block text-[13px] text-[#1B1BB3] hover:underline mb-6"
        >
          {t.common.backToList}
        </Link>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-[#374151] mb-1.5">{tbl.fieldTitle}</label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#d9d9d9] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1B1BB3]/20 focus:border-[#1B1BB3] text-start"
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#374151] mb-1.5">
              {tbl.fieldSlug}
            </label>
            <input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder={tbl.fieldSlugPlaceholder}
              className="w-full px-4 py-2.5 border border-[#d9d9d9] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1B1BB3]/20 focus:border-[#1B1BB3] text-start font-mono text-[13px]"
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#374151] mb-1.5">{tbl.fieldExcerpt}</label>
            <textarea
              required
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#d9d9d9] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1B1BB3]/20 focus:border-[#1B1BB3] text-start resize-y min-h-[80px]"
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#374151] mb-1.5">
              {tbl.fieldImage}
            </label>
            <input
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder={tbl.fieldImagePlaceholder}
              className="w-full px-4 py-2.5 border border-[#d9d9d9] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1B1BB3]/20 focus:border-[#1B1BB3] text-start font-mono text-[13px]"
            />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-[#374151] mb-1.5">{tbl.fieldContent}</label>
            <textarea
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2.5 border border-[#d9d9d9] rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#1B1BB3]/20 focus:border-[#1B1BB3] text-start resize-y min-h-[120px]"
            />
          </div>

          {error && <p className="text-[13px] text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-white text-[14px] font-bold disabled:opacity-60 hover:opacity-90 transition-opacity"
            style={{ background: gradient }}
          >
            {loading ? t.common.saving : tbl.create}
          </button>
        </form>
      </div>
    </div>
  )
}
