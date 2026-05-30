import fs from 'fs'
import path from 'path'
import { getSalonDataDir } from '@/lib/salon-data-dir'
import { LOCALES, type Locale } from '@/lib/i18n/config'
import { SITE_CONTENT_DEFAULTS, type SiteContent } from '@/lib/i18n/site-content'

const CONTENT_FILE = path.join(getSalonDataDir(), 'site-content.json')

export type ContentByLocale = Record<Locale, SiteContent>

/**
 * Deep-merge `override` onto `base`. Arrays are replaced wholesale when present in
 * the override (so reordering / removing items works), otherwise the base array is kept.
 */
function deepMerge<T>(base: T, override: unknown): T {
  if (override === null || override === undefined) return base
  if (Array.isArray(base)) {
    return (Array.isArray(override) ? override : base) as T
  }
  if (typeof base === 'object' && typeof override === 'object') {
    const out: Record<string, unknown> = { ...(base as Record<string, unknown>) }
    for (const [key, value] of Object.entries(override as Record<string, unknown>)) {
      if (key in out) {
        out[key] = deepMerge(out[key], value)
      }
    }
    return out as T
  }
  // Primitive leaf: take the override.
  return (override as T) ?? base
}

function readOverrides(): Partial<Record<Locale, unknown>> {
  if (!fs.existsSync(CONTENT_FILE)) return {}
  try {
    return JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf-8')) as Partial<Record<Locale, unknown>>
  } catch {
    return {}
  }
}

/** Defaults merged with any admin overrides — the canonical site text for both locales. */
export function readSiteContent(): ContentByLocale {
  const overrides = readOverrides()
  const result = {} as ContentByLocale
  for (const locale of LOCALES) {
    result[locale] = deepMerge(SITE_CONTENT_DEFAULTS[locale], overrides[locale])
  }
  return result
}

export function readSiteContentFor(locale: Locale): SiteContent {
  return readSiteContent()[locale]
}

export function writeSiteContent(content: ContentByLocale): void {
  fs.mkdirSync(path.dirname(CONTENT_FILE), { recursive: true })
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf-8')
}
