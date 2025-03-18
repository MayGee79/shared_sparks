import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/handlers'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      // Not authenticated, redirect to sign in
      return NextResponse.redirect(new URL('/auth/signin', process.env.NEXTAUTH_URL || 'http://localhost:3000'))
    }

    // Check if user exists and has completed onboarding
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.redirect(new URL('/auth/signin', process.env.NEXTAUTH_URL || 'http://localhost:3000'))
    }

    // Check if user has completed onboarding
    const hasCompletedOnboarding = Boolean(
      user.firstName &&
      user.lastName &&
      user.industry &&
      user.role
    )

    if (hasCompletedOnboarding) {
      return NextResponse.redirect(new URL('/dashboard', process.env.NEXTAUTH_URL || 'http://localhost:3000'))
    } else {
      return NextResponse.redirect(new URL('/onboarding', process.env.NEXTAUTH_URL || 'http://localhost:3000'))
    }
  } catch (error) {
    console.error('Error in signin callback:', error)
    return NextResponse.redirect(new URL('/auth/error', process.env.NEXTAUTH_URL || 'http://localhost:3000'))
  }
} 