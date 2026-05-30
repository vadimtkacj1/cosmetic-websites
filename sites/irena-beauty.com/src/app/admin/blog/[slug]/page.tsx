'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import AdminHeader from '@/components/admin/AdminHeader'
import { useAdminI18n } from '@/components/i18n/AdminLocaleProvider'

const gradient = 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)'

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  image: string
  content: string
  createdAt: string
}

export default function AdminBlogEditPage() {
  const { t } = useAdminI18n()
  const tbl = t.blog
  const params = useParams()
  const router = useRouter()
  const slugParam = typeof params.slug === 'string' ? params.slug : params.slug?.[0] ?? ''

  const [post, setPost] = useState<BlogPost | null>(null)
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [image, setImage] = useState('')
  const [content, setContent] = useState('')
  const [loadError, setLoadError] = useState('')
  const [saveError, setSaveError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    if (!slugParam) return
    setLoading(true)
    setLoadError('')
    try {
      const res = await fetch(`/api/admin/blog/${encodeURIComponent(slugParam)}`)
      if (!res.ok) {
        setLoadError(res.status === 404 ? tbl.notFound : tbl.loadError)
        setPost(null)
        return
      }
      const data = (await res.json()) as BlogPost
      setPost(data)
      setTitle(data.title)
      setExcerpt(data.excerpt)
      setImage(data.image)
      setContent(data.content)
    } catch {
      setLoadError(tbl.networkError)
      setPost(null)
    } finally {
      setLoading(false)
    }
  }, [slugParam])

  useEffect(() => {
    load()
  }, [load])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!slugParam) return
    setSaving(true)
    setSaveError('')
    try {
      const res = await fetch(`/api/admin/blog/${encodeURIComponent(slugParam)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, excerpt, image, content }),
      })
      const data = await res.json()
      if (!res.ok) {
        setSaveError(typeof data.error === 'string' ? data.error : t.login.errorGeneric)
        return
      }
      setPost(data as BlogPost)
      router.refresh()
    } catch {
      setSaveError(tbl.networkError)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div>
        <AdminHeader title={tbl.editTitle} />
        <div className="p-8 text-center text-[#9ca3af] text-[14px]">{t.common.loading}</div>
      </div>
    )
  }

  if (loadError || !post) {
    return (
      <div>
        <AdminHeader title={tbl.editTitle} />
        <div className="p-8">
          <p className="text-red-500 text-[14px] mb-4">{loadError || tbl.notFound}</p>
          <Link href="/admin/blog" className="text-[#1B1BB3] text-[14px] hover:underline">
            {t.common.backToList}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div>
      <AdminHeader title={tbl.editTitle} subtitle={post.slug} />

      <div className="p-4 md:p-8 max-w-[720px]">
        <Link
          href="/admin/blog"
          className="inline-block text-[13px] text-[#1B1BB3] hover:underline mb-6"
        >
          {t.common.backToList}
        </Link>

        <form onSubmit={handleSave} className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm space-y-4">
          <div className="text-[12px] text-[#9ca3af] font-mono break-all">slug: {post.slug}</div>

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
            <label className="block text-[13px] font-medium text-[#374151] mb-1.5">{tbl.fieldImage}</label>
            <input
              required
              value={image}
              onChange={(e) => setImage(e.target.value)}
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

          {saveError && <p className="text-[13px] text-red-500">{saveError}</p>}

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-lg text-white text-[14px] font-bold disabled:opacity-60 hover:opacity-90 transition-opacity"
            style={{ background: gradient }}
          >
            {saving ? t.common.saving : t.common.saveChanges}
          </button>
        </form>
      </div>
    </div>
  )
}
