import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { deletePortfolioMedia } from '@/lib/portfolio-store'

async function isAuthed(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get('admin_session')?.value === '1'
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id } = await params
  deletePortfolioMedia(id)
  return NextResponse.json({ ok: true })
}
