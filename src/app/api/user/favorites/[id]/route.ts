import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

// DELETE /api/user/favorites/[id] - Remove a favorite
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const saasId = params.id
    
    if (!saasId) {
      return NextResponse.json(
        { error: 'SaaS ID is required' },
        { status: 400 }
      )
    }

    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if favorite exists
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_saasId: {
          userId: user.id,
          saasId
        }
      }
    })
    
    if (!favorite) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      )
    }

    // Delete favorite
    await prisma.favorite.delete({
      where: {
        userId_saasId: {
          userId: user.id,
          saasId
        }
      }
    })

    return NextResponse.json(
      { message: 'Favorite removed successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error removing favorite:', error)
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    )
  }
} 