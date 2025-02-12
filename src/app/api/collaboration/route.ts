import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/lib/auth'

// Create a single PrismaClient instance
const prisma = new PrismaClient()

// Type-safe request handler
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

    const requests = await prisma.collaborationRequest.findMany({
      where: { receiverId: user.id, status: 'pending' },
      include: {
        sender: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    })

    return NextResponse.json(requests)
  } catch (error) {
    console.error('Error creating collaboration request:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// Send a collaboration request
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const data = await request.json()
    const { receiverId, message } = data

    const sender = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!sender) {
      return NextResponse.json({ error: 'Sender not found' }, { status: 404 })
    }

    const newRequest = await prisma.collaborationRequest.create({
      data: {
        senderId: sender.id,
        receiverId,
        message,
      },
    })

    return NextResponse.json(newRequest)
  } catch (error) {
    console.error('Error creating collaboration request:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
