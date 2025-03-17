import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/handlers'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user has completed onboarding
    const hasCompletedOnboarding = Boolean(
      user.firstName &&
      user.lastName &&
      user.industry &&
      user.role
    )

    return NextResponse.json({
      hasCompletedOnboarding,
      profile: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        industry: user.industry,
        role: user.role,
        bio: user.bio,
        expertise: user.expertise,
        skills: user.skills,
        interests: user.interests,
        goals: user.goals,
      }
    })
  } catch (error) {
    console.error('Error fetching user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 