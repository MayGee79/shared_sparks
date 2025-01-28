import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const profile = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true
      }
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    
    const profile = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.fullName,
        bio: data.bio,
        // Removing location since it's not a valid field in the UserUpdateInput type
        industry: data.industry,
        role: data.role,
        expertise: data.expertise,
        skills: data.skills,
        interests: data.interests,
        goals: data.goals,
        twitter: data.twitter,
        linkedin: data.linkedin,
        github: data.github,
        allowCollaboration: data.allowCollaboration,
        profileVisibility: data.profileVisibility,
        notificationPrefs: data.notificationPrefs
      }
    })

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
