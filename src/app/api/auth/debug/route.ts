import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    baseUrl: process.env.NEXTAUTH_URL,
    providers: {
      github: !!process.env.GITHUB_ID,
      google: !!process.env.GOOGLE_CLIENT_ID
    }
  })
} 