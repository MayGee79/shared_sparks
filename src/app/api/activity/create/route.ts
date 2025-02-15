import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

const handler = NextAuth(authOptions)

// Removed duplicate exports of GET and POST

export async function POST(request: Request) {
  const session = await getServerSession()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const data = await request.json()
  try {
    const newActivity = await prisma.activity.create({
      data: {
        ...data,
        userId: session.user.id,
      },
    })
    return NextResponse.json(newActivity, { status: 201 })
  } catch (error) {
    console.error('Activity creation error:', error)
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 })
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
