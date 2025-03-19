import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth.config'
import prisma from '@/lib/prisma'

// GET handler to check if a SaaS is favorited by the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ favorited: false }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const saasId = searchParams.get('saasId')
    
    if (!saasId) {
      return NextResponse.json(
        { error: 'SaaS ID is required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    const favorite = await prisma.saasFavorite.findFirst({
      where: {
        userId: user.id,
        saasId,
      },
    })

    return NextResponse.json({ favorited: !!favorite })
  } catch (error) {
    console.error('Error checking favorite status:', error)
    return NextResponse.json(
      { error: 'Failed to check favorite status' },
      { status: 500 }
    )
  }
}

// POST handler to toggle favorite status
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be logged in' },
        { status: 401 }
      )
    }

    const { saasId } = await request.json()
    
    if (!saasId) {
      return NextResponse.json(
        { error: 'SaaS ID is required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if the SaaS exists
    const saas = await prisma.saas.findUnique({
      where: { id: saasId },
    })

    if (!saas) {
      return NextResponse.json(
        { error: 'SaaS not found' },
        { status: 404 }
      )
    }

    // Check if already favorited
    const existingFavorite = await prisma.saasFavorite.findFirst({
      where: {
        userId: user.id,
        saasId,
      },
    })

    let favorited = false

    if (existingFavorite) {
      // Remove favorite
      await prisma.saasFavorite.delete({
        where: {
          id: existingFavorite.id,
        },
      })
      favorited = false
    } else {
      // Add favorite
      await prisma.saasFavorite.create({
        data: {
          userId: user.id,
          saasId,
        },
      })
      favorited = true
    }

    return NextResponse.json({ favorited })
  } catch (error) {
    console.error('Error toggling favorite status:', error)
    return NextResponse.json(
      { error: 'Failed to update favorite status' },
      { status: 500 }
    )
  }
} 