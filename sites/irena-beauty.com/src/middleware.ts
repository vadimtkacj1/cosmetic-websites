import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuthed = request.cookies.get('admin_session')?.value === '1'
  const isLogin = pathname === '/admin/login'

  if (isLogin) {
    if (isAuthed) {
      return NextResponse.redirect(new URL('/admin/blog', request.url))
    }
    return NextResponse.next()
  }

  if (!isAuthed) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
