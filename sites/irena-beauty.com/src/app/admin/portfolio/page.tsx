'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import AdminHeader from '@/components/admin/AdminHeader'
import { Trash2, Upload, Play } from 'lucide-react'
import { useAdminI18n } from '@/components/i18n/AdminLocaleProvider'

const gradient = 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)'

interface PortfolioItem {
  id: string
  type: 'photo' | 'video'
  src: string
  createdAt: string
}

export default function AdminPortfolioPage() {
  const { t, dir } = useAdminI18n()
  const tp = t.portfolio
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/portfolio', { cache: 'no-store' })
      if (res.ok) {
        const data = (await res.json()) as PortfolioItem[]
        setItems(Array.isArray(data) ? data : [])
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchItems()
  }, [fetchItems])

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    setError('')
    try {
      const form = new FormData()
      Array.from(files).forEach((f) => form.append('file', f))
      const res = await fetch('/api/admin/portfolio', { method: 'POST', body: form })
      if (!res.ok) {
        setError(tp.uploadError)
        return
      }
      await fetchItems()
    } catch {
      setError(tp.uploadError)
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm(tp.deleteConfirm)) return
    setDeletingId(id)
    try {
      await fetch(`/api/admin/portfolio/${encodeURIComponent(id)}`, { method: 'DELETE' })
      setItems((prev) => prev.filter((i) => i.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div dir={dir}>
      <AdminHeader
        title={tp.title}
        subtitle={loading ? undefined : `${items.length} ${tp.countSuffix}`}
      />

      <div className="p-4 md:p-8">
        <div className="flex flex-col gap-2 mb-5">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-[14px] font-bold hover:opacity-90 transition-opacity disabled:opacity-60"
              style={{ background: gradient }}
            >
              {uploading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  {tp.uploading}
                </>
              ) : (
                <>
                  <Upload size={18} strokeWidth={2} />
                  {tp.upload}
                </>
              )}
            </button>
            <input
              ref={inputRef}
              type="file"
              accept="image/*,video/*"
              multiple
              hidden
              onChange={(e) => handleUpload(e.target.files)}
            />
          </div>
          <p className="text-[12px] text-[#9ca3af]">{tp.hint}</p>
          {error && <p className="text-[13px] text-red-500">{error}</p>}
        </div>

        {!loading && items.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 py-16 text-center text-[#9ca3af] text-[14px]">
            {tp.empty}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative aspect-square rounded-lg overflow-hidden border border-gray-100 bg-gray-50"
            >
              {item.type === 'photo' ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.src} alt="" className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <>
                  <video src={item.src} muted playsInline preload="metadata" className="w-full h-full object-cover" />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90">
                      <Play size={16} className="ml-[2px] text-[#111827]" fill="currentColor" />
                    </span>
                  </span>
                </>
              )}

              <span className="absolute top-1.5 start-1.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-black/55 text-white">
                {item.type === 'photo' ? tp.photo : tp.video}
              </span>

              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                disabled={deletingId === item.id}
                className="absolute top-1.5 end-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity hover:bg-red-500 disabled:opacity-100"
                aria-label={t.common.delete}
              >
                {deletingId === item.id ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <Trash2 size={15} />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
