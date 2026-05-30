import { NextResponse } from 'next/server'
import { readPortfolioFile } from '@/lib/portfolio-store'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const file = readPortfolioFile(id)
  if (!file) {
    return new NextResponse('Not found', { status: 404 })
  }
  return new NextResponse(new Uint8Array(file.buffer), {
    headers: {
      'Content-Type': file.contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
