import { NextResponse } from 'next/server'
import { getPortfolioMedia } from '@/lib/portfolio-store'

export const dynamic = 'force-dynamic'

export async function GET() {
  const media = getPortfolioMedia().map(({ type, src }) => ({ type, src }))
  return NextResponse.json(media)
}
