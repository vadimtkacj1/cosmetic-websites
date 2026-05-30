import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { LOCALES } from '@/lib/i18n/config'
import { SITE_CONTENT_DEFAULTS, type SiteContent } from '@/lib/i18n/site-content'
import { unflattenOnto, type Flat } from '@/lib/i18n/flatten'
import { readSiteContent, writeSiteContent, type ContentByLocale } from '@/lib/site-content-store'

async function isAuthed(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get('admin_session')?.value === '1'
}

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return NextResponse.json(readSiteContent())
}

/**
 * Body: `{ ru: Flat, he: Flat }` — flat dot-path → string maps from the editor.
 * Each is applied onto the code default template to guarantee a valid shape, then stored.
 */
export async function PUT(request: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  let body: Partial<Record<(typeof LOCALES)[number], Flat>>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const next = {} as ContentByLocale
  for (const locale of LOCALES) {
    const flat = body[locale]
    if (flat && typeof flat === 'object') {
      next[locale] = unflattenOnto<SiteContent>(SITE_CONTENT_DEFAULTS[locale], flat)
    } else {
      next[locale] = SITE_CONTENT_DEFAULTS[locale]
    }
  }

  writeSiteContent(next)
  return NextResponse.json(next)
}
