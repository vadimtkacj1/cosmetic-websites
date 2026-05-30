import fs from 'fs'
import path from 'path'
import { getSalonDataDir } from '@/lib/salon-data-dir'

const POSTS_FILE = path.join(getSalonDataDir(), 'blog-posts.json')

export interface BlogPost {
  slug: string
  title: string
  excerpt: string
  image: string
  content: string
  createdAt: string
}

function readPosts(): BlogPost[] {
  try {
    if (!fs.existsSync(POSTS_FILE)) return []
    return JSON.parse(fs.readFileSync(POSTS_FILE, 'utf-8')) as BlogPost[]
  } catch {
    return []
  }
}

function writePosts(posts: BlogPost[]): void {
  fs.mkdirSync(path.dirname(POSTS_FILE), { recursive: true })
  fs.writeFileSync(POSTS_FILE, JSON.stringify(posts, null, 2), 'utf-8')
}

function uniqueSlug(title: string, posts: BlogPost[], excludeSlug?: string): string {
  const fromTitle = title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9\u0590-\u05ff-]/gi, '')
    .replace(/^-+|-+$/g, '')
  const base = fromTitle || `post-${Date.now()}`
  const slugs = new Set(posts.filter((p) => p.slug !== excludeSlug).map((p) => p.slug))
  let s = base
  let i = 0
  while (slugs.has(s)) {
    i += 1
    s = `${base}-${i}`
  }
  return s
}

export function getAllPosts(): BlogPost[] {
  return [...readPosts()].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export function getPostBySlug(slug: string): BlogPost | null {
  return readPosts().find((p) => p.slug === slug) ?? null
}

export function createPost(body: {
  slug?: string
  title: string
  excerpt: string
  image: string
  content?: string
}): BlogPost {
  const title = String(body.title || '').trim()
  const excerpt = String(body.excerpt || '').trim()
  const image = String(body.image || '').trim()
  if (!title || !excerpt || !image) {
    throw new Error('title, excerpt, image are required')
  }
  const posts = readPosts()
  const rawSlug = body.slug?.trim() ?? ''
  const slug =
    rawSlug && !posts.some((p) => p.slug === rawSlug) ? rawSlug : uniqueSlug(title, posts)
  if (posts.some((p) => p.slug === slug)) {
    throw new Error('slug already exists')
  }
  const post: BlogPost = {
    slug,
    title,
    excerpt,
    image,
    content: String(body.content ?? '').trim(),
    createdAt: new Date().toISOString(),
  }
  posts.push(post)
  writePosts(posts)
  return post
}

export function updatePost(
  slug: string,
  body: Partial<Pick<BlogPost, 'title' | 'excerpt' | 'image' | 'content'>>
): BlogPost {
  const posts = readPosts()
  const idx = posts.findIndex((p) => p.slug === slug)
  if (idx === -1) throw new Error('post not found')
  const cur = posts[idx]
  const next: BlogPost = {
    ...cur,
    title: body.title !== undefined ? String(body.title).trim() : cur.title,
    excerpt: body.excerpt !== undefined ? String(body.excerpt).trim() : cur.excerpt,
    image: body.image !== undefined ? String(body.image).trim() : cur.image,
    content: body.content !== undefined ? String(body.content).trim() : cur.content,
  }
  if (!next.title || !next.excerpt || !next.image) {
    throw new Error('title, excerpt, image are required')
  }
  posts[idx] = next
  writePosts(posts)
  return next
}

export function deletePost(slug: string): void {
  const posts = readPosts().filter((p) => p.slug !== slug)
  writePosts(posts)
}
