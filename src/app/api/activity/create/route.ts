import { NextResponse } from 'next/server'
import NextAuth, { getServerSession } from 'next-auth'
import { authOptions } from "@/lib/auth/handlers"  // Updated import path
import prisma from '@/lib/prisma'
import { z } from 'zod'

const handler = NextAuth(authOptions)

// Activity input validation schema
const activitySchema = z.object({
  title: z.string(),
  content: z.string().optional(),
})

// Removed duplicate exports of GET and POST

export async function POST(request: Request) {
  try {
    // Auth check
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Validate input
    const data = await request.json()
    const validatedData = activitySchema.parse(data)

    // Create activity with proper relation
    const newActivity = await prisma.activity.create({
      data: {
        ...validatedData,
        user: {
          connect: {
            id: session.user.id,
          }
        },
      },
    })

    return NextResponse.json(newActivity, { status: 201 })
  } catch (error) {
    console.error('Activity creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create activity' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
