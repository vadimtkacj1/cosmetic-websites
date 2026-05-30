import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import { getSalonDataDir } from '@/lib/salon-data-dir'

const MANIFEST_FILE = path.join(getSalonDataDir(), 'portfolio.json')
const MEDIA_DIR = path.join(getSalonDataDir(), 'portfolio-media')
const PUBLIC_PHOTOS = path.join(process.cwd(), 'public', 'images', 'photos')
const PUBLIC_VIDEOS = path.join(process.cwd(), 'public', 'images', 'videos')

export interface PortfolioItem {
  id: string
  type: 'photo' | 'video'
  /** URL the public site loads directly (static path for seeded items, /api/portfolio/<id> for uploads). */
  src: string
  /** Stored filename inside MEDIA_DIR — present only for admin-uploaded items. */
  file?: string
  createdAt: string
}

const PHOTO_EXT = new Set(['.jpeg', '.jpg', '.png', '.webp', '.gif', '.avif'])
const VIDEO_EXT = new Set(['.mp4', '.webm', '.mov', '.m4v'])

const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': '.jpeg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
  'video/mp4': '.mp4',
  'video/webm': '.webm',
  'video/quicktime': '.mov',
}

const CONTENT_TYPE_BY_EXT: Record<string, string> = {
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.mov': 'video/quicktime',
  '.m4v': 'video/x-m4v',
}

/** Build the initial manifest from the static files shipped in public/images. */
function seedFromPublic(): PortfolioItem[] {
  const items: PortfolioItem[] = []
  const now = new Date().toISOString()
  const scan = (
    dir: string,
    urlBase: string,
    type: PortfolioItem['type'],
    extSet: Set<string>
  ) => {
    let names: string[]
    try {
      names = fs.readdirSync(dir)
    } catch {
      return
    }
    names
      .filter((n) => extSet.has(path.extname(n).toLowerCase()))
      .sort()
      .forEach((n) => {
        items.push({ id: randomUUID(), type, src: `${urlBase}/${n}`, createdAt: now })
      })
  }
  scan(PUBLIC_PHOTOS, '/images/photos', 'photo', PHOTO_EXT)
  scan(PUBLIC_VIDEOS, '/images/videos', 'video', VIDEO_EXT)
  return items
}

function syncWithDisk(items: PortfolioItem[]): PortfolioItem[] {
  const getStaticSrcs = (dir: string, urlBase: string, extSet: Set<string>): Set<string> => {
    try {
      const names = fs.readdirSync(dir).filter((n) => extSet.has(path.extname(n).toLowerCase()))
      return new Set(names.map((n) => `${urlBase}/${n}`))
    } catch {
      return new Set()
    }
  }

  const photoSrcs = getStaticSrcs(PUBLIC_PHOTOS, '/images/photos', PHOTO_EXT)
  const videoSrcs = getStaticSrcs(PUBLIC_VIDEOS, '/images/videos', VIDEO_EXT)
  const allStaticSrcs = new Set([...photoSrcs, ...videoSrcs])

  // Remove static items whose files no longer exist on disk
  const existingStaticSrcs = new Set(items.filter((i) => !i.file).map((i) => i.src))
  const filtered = items.filter((i) => i.file || allStaticSrcs.has(i.src))

  // Add new files found on disk that are not yet in the manifest
  const now = new Date().toISOString()
  const newPhotos: PortfolioItem[] = [...photoSrcs]
    .filter((src) => !existingStaticSrcs.has(src))
    .sort()
    .map((src) => ({ id: randomUUID(), type: 'photo', src, createdAt: now }))
  const newVideos: PortfolioItem[] = [...videoSrcs]
    .filter((src) => !existingStaticSrcs.has(src))
    .sort()
    .map((src) => ({ id: randomUUID(), type: 'video', src, createdAt: now }))

  if (newPhotos.length === 0 && newVideos.length === 0 && filtered.length === items.length) {
    return items
  }

  // Insert new photos before the first video block, new videos at the end of video block
  const firstVideoIdx = filtered.findIndex((i) => i.type === 'video' && !i.file)
  const insertIdx = firstVideoIdx === -1 ? filtered.length : firstVideoIdx
  const synced = [
    ...filtered.slice(0, insertIdx),
    ...newPhotos,
    ...filtered.slice(insertIdx),
    ...newVideos,
  ]
  writeManifest(synced)
  return synced
}

function readManifest(): PortfolioItem[] {
  try {
    if (!fs.existsSync(MANIFEST_FILE)) {
      const seeded = seedFromPublic()
      writeManifest(seeded)
      return seeded
    }
    const items = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf-8')) as PortfolioItem[]
    return syncWithDisk(items)
  } catch {
    return []
  }
}

function writeManifest(items: PortfolioItem[]): void {
  fs.mkdirSync(path.dirname(MANIFEST_FILE), { recursive: true })
  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(items, null, 2), 'utf-8')
}

export function getPortfolioMedia(): PortfolioItem[] {
  return readManifest()
}

export async function addPortfolioMedia(file: File): Promise<PortfolioItem> {
  const mime = file.type || ''
  const isVideo = mime.startsWith('video/')
  const isImage = mime.startsWith('image/')
  if (!isImage && !isVideo) {
    throw new Error('unsupported file type')
  }
  const ext = EXT_BY_MIME[mime] || path.extname(file.name).toLowerCase() || (isVideo ? '.mp4' : '.jpeg')
  const id = randomUUID()
  const filename = `${id}${ext}`
  fs.mkdirSync(MEDIA_DIR, { recursive: true })
  const buffer = Buffer.from(await file.arrayBuffer())
  fs.writeFileSync(path.join(MEDIA_DIR, filename), buffer)

  const item: PortfolioItem = {
    id,
    type: isVideo ? 'video' : 'photo',
    src: `/api/portfolio/${id}`,
    file: filename,
    createdAt: new Date().toISOString(),
  }
  const items = readManifest()
  items.push(item)
  writeManifest(items)
  return item
}

export function deletePortfolioMedia(id: string): void {
  const items = readManifest()
  const item = items.find((i) => i.id === id)
  if (item?.file) {
    try {
      fs.unlinkSync(path.join(MEDIA_DIR, item.file))
    } catch {
      // file already gone — ignore
    }
  }
  writeManifest(items.filter((i) => i.id !== id))
}

/** Read an uploaded file's bytes for the serving route. Returns null for unknown/static items. */
export function readPortfolioFile(id: string): { buffer: Buffer; contentType: string } | null {
  const item = readManifest().find((i) => i.id === id && i.file)
  if (!item?.file) return null
  const filePath = path.join(MEDIA_DIR, item.file)
  try {
    const buffer = fs.readFileSync(filePath)
    const contentType = CONTENT_TYPE_BY_EXT[path.extname(item.file).toLowerCase()] ?? 'application/octet-stream'
    return { buffer, contentType }
  } catch {
    return null
  }
}
