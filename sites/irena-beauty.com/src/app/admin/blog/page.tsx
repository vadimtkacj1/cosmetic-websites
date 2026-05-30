'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import AdminHeader from '@/components/admin/AdminHeader'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useAdminI18n } from '@/components/i18n/AdminLocaleProvider'

interface BlogPost {
  slug: string
  title: string
  excerpt: string
  image: string
  content: string
  createdAt: string
}

const gradient = 'linear-gradient(92.63deg, #1B1BB3 14.57%, #530FAD 99.27%)'

function formatCreatedAt(iso: string, intlLocale: string) {
  return new Intl.DateTimeFormat(intlLocale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export default function AdminBlogListPage() {
  const { t, locale } = useAdminI18n()
  const tbl = t.blog
  const intlLocale = locale === 'ru' ? 'ru-RU' : 'he-IL'
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null)

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/blog')
      if (res.ok) {
        const data = (await res.json()) as BlogPost[]
        setPosts(Array.isArray(data) ? data : [])
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handleDelete = async (slug: string) => {
    setDeleteSlug(slug)
    try {
      await fetch(`/api/admin/blog/${encodeURIComponent(slug)}`, { method: 'DELETE' })
      setPosts((prev) => prev.filter((p) => p.slug !== slug))
    } finally {
      setDeleteSlug(null)
    }
  }

  return (
    <div>
      <AdminHeader
        title={tbl.listTitle}
        subtitle={loading ? undefined : `${posts.length} ${tbl.countSuffix}`}
      />

      <div className="p-4 md:p-8">
        <div className="flex justify-between items-center mb-5 gap-3 flex-wrap">
          <Link
            href="/admin/blog/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-white text-[14px] font-bold hover:opacity-90 transition-opacity"
            style={{ background: gradient }}
          >
            <Plus size={18} strokeWidth={2} />
            {tbl.newPost}
          </Link>
          <button
            type="button"
            onClick={fetchPosts}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#d9d9d9] bg-white text-[14px] font-medium text-[#374151] hover:bg-gray-50 transition-colors disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-[#1B1BB3]/30 border-t-[#1B1BB3] rounded-full animate-spin" />
                {t.common.loading}
              </>
            ) : (
              t.common.refresh
            )}
          </button>
        </div>

        {!loading && posts.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 py-16 text-center text-[#9ca3af] text-[14px]">
            {tbl.empty}
          </div>
        )}

        <div className="flex flex-col gap-3 md:hidden">
          {posts.map((post) => (
            <div
              key={post.slug}
              className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm"
            >
              <div className="font-semibold text-[14px] text-[#111827] leading-snug mb-1">
                {post.title}
              </div>
              <div className="text-[12px] text-[#9ca3af] mb-3 font-mono break-all">
                {post.slug}
              </div>
              <div className="text-[11px] text-[#9ca3af] mb-3">
                {formatCreatedAt(post.createdAt, intlLocale)}
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/blog/${encodeURIComponent(post.slug)}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium text-[#1B1BB3] border border-[#1B1BB3]/30 rounded-lg hover:bg-[#eff6ff]"
                >
                  <Pencil size={13} />
                  {t.common.edit}
                </Link>
                <button
                  type="button"
                  onClick={() => handleDelete(post.slug)}
                  disabled={deleteSlug === post.slug}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-40"
                >
                  <Trash2 size={13} />
                  {t.common.delete}
                </button>
              </div>
            </div>
          ))}
        </div>

        {posts.length > 0 && (
          <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/60">
                  <th className="text-right px-6 py-3.5 text-[12px] font-semibold text-[#6b7280] uppercase tracking-wide">
                    {tbl.colTitle}
                  </th>
                  <th className="text-right px-4 py-3.5 text-[12px] font-semibold text-[#6b7280] uppercase tracking-wide">
                    slug
                  </th>
                  <th className="text-right px-4 py-3.5 text-[12px] font-semibold text-[#6b7280] uppercase tracking-wide">
                    {tbl.colCreated}
                  </th>
                  <th className="px-6 py-3.5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {posts.map((post) => (
                  <tr key={post.slug} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-[14px] text-[#111827]">{post.title}</div>
                    </td>
                    <td className="px-4 py-4 text-[12px] text-[#6b7280] font-mono max-w-[200px] truncate">
                      {post.slug}
                    </td>
                    <td className="px-4 py-4 text-[13px] text-[#9ca3af] whitespace-nowrap">
                      {formatCreatedAt(post.createdAt, intlLocale)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <Link
                          href={`/admin/blog/${encodeURIComponent(post.slug)}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-[#1B1BB3] border border-[#1B1BB3]/25 rounded-lg hover:bg-[#eff6ff]"
                        >
                          <Pencil size={13} />
                          {t.common.edit}
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(post.slug)}
                          disabled={deleteSlug === post.slug}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-red-500 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-40"
                        >
                          {deleteSlug === post.slug ? (
                            <span className="w-3 h-3 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                          ) : (
                            <Trash2 size={13} />
                          )}
                          {t.common.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
