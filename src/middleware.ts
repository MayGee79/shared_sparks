import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Define public paths that don't require authentication
  const isPublicPath = path === '/signin' || 
                        path === '/signup' || 
                        path === '/admin-login' ||
                        path.startsWith('/api/auth') ||
                        path === '/' ||
                        path.startsWith('/saas') ||
                        path.startsWith('/_next') ||
                        path.startsWith('/favicon')
  
  // Define admin paths that require admin privileges
  const isAdminPath = path.startsWith('/admin')
  
  // Get the session token
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET
  })

  // If it's a public path, allow the request
  if (isPublicPath) {
    return NextResponse.next()
  }

  // If user is not logged in and trying to access a protected route, redirect to signin
  if (!token && !isPublicPath) {
    const url = new URL('/signin', request.url)
    url.searchParams.set('callbackUrl', encodeURI(request.url))
    return NextResponse.redirect(url)
  }

  // If user is trying to access admin routes but doesn't have admin role
  if (isAdminPath && token && token.role !== 'ADMIN') {
    // Redirect to admin login with unauthorized error
    const url = new URL('/admin-login', request.url)
    url.searchParams.set('error', 'unauthorized')
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    '/((?!api/public|_next/static|_next/image|favicon.ico).*)',
    '/admin/:path*'
  ],
}