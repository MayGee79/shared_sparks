import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth/handlers'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const data = await req.json()
    
    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        bio: data.bio,
        industry: data.industry,
        role: data.role,
        expertise: data.expertise,
        skills: data.skills,
        interests: data.interests,
        goals: data.goals,
        linkedin: data.linkedin,
        github: data.github,
        twitter: data.twitter,
        allowCollaboration: data.allowCollaboration,
        profileVisibility: data.profileVisibility,
        notificationPrefs: data.notificationPrefs,
      },
    })

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error('Error updating user profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 