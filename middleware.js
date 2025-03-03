import { NextResponse } from 'next/server'

export function middleware(request) {
  // Return early if for auth-related paths
  const { pathname } = request.nextUrl
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }
  
  return NextResponse.next()
} 