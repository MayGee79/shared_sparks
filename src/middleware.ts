import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Handle admin routes first
function handleAdminRoutes(request: NextRequest) {
  if (request.nextUrl.pathname === '/admin-login') {
    return NextResponse.next()
  }

  if (request.nextUrl.pathname.startsWith('/admin')) {
    const referer = request.headers.get('referer')
    if (referer?.includes('/admin-login')) {
      return NextResponse.next()
    }
    return NextResponse.redirect(new URL('/admin-login', request.url))
  }

  return null
}

export default withAuth(
  function middleware(request) {
    // Allow access to registration and auth pages
    if (
      request.nextUrl.pathname.startsWith('/auth/register') ||
      request.nextUrl.pathname.startsWith('/auth/login') ||
      request.nextUrl.pathname.startsWith('/auth/error')
    ) {
      return NextResponse.next()
    }

    // Check admin routes
    const adminResponse = handleAdminRoutes(request)
    if (adminResponse) {
      return adminResponse
    }

    return NextResponse.next()
  },
  {
    pages: {
      signIn: '/auth/login',
      error: '/auth/error',
      newUser: '/onboarding'
    },
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to registration and auth pages without a token
        if (
          req.nextUrl.pathname.startsWith('/auth/register') ||
          req.nextUrl.pathname.startsWith('/auth/login') ||
          req.nextUrl.pathname.startsWith('/auth/error')
        ) {
          return true
        }
        // Require token for all other protected routes
        return !!token
      }
    }
  }
)

export const config = {
  matcher: [
    '/admin/:path*', 
    '/admin-login',
    '/dashboard/:path*',
    '/profile/:path*',
    '/auth/:path*',  // Added auth paths to matcher
    '/onboarding'    // Added onboarding path to matcher
  ]
}