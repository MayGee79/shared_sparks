import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient, Prisma } from '@prisma/client'
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

    // Use type assertion for the model name
    const requests = await (prisma as any).CollaborationRequest.findMany({
      where: { receiverId: user.id, status: 'pending' },
      include: {
        sender: {
          select: {
            name: true,
          },
        },
      },
    })

    return NextResponse.json(requests)
  } catch (error) {
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

    // Use type assertion here too
    const newRequest = await (prisma as any).CollaborationRequest.create({
      data: {
        senderId: sender.id,
        receiverId,
        message,
      },
    })

    return NextResponse.json(newRequest)
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
