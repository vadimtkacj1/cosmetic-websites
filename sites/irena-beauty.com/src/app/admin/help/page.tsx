'use client'

import AdminHeader from '@/components/admin/AdminHeader'
import { useAdminI18n } from '@/components/i18n/AdminLocaleProvider'

export default function AdminHelpPage() {
  const { t, dir } = useAdminI18n()
  const th = t.help

  return (
    <div className="min-w-0 max-w-full" dir={dir}>
      <AdminHeader title={th.title} />
      <div className="p-4 md:p-8 max-w-[640px] text-start">
        <h1 className="text-[22px] font-bold text-[#0f172a] mb-1">{th.title}</h1>
        <p className="text-[14px] text-[#64748b] mb-6">{th.subtitle}</p>

        <nav className="mb-8 p-4 rounded-xl bg-slate-50 border border-slate-100 text-[14px]">
          <p className="font-semibold text-[#334155] mb-2">{th.onThisPage}</p>
          <ul className="space-y-1.5">
            {th.sections.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="text-[#4f46e5] hover:underline">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="space-y-8">
          {th.sections.map((s) => (
            <section key={s.id} id={s.id} className="scroll-mt-20">
              <h2 className="text-[17px] font-semibold text-[#0f172a] mb-3 pb-2 border-b border-slate-200">
                {s.title}
              </h2>
              <ul className="list-disc ps-5 space-y-2 text-[14px] text-[#475569] leading-relaxed">
                {s.body.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
