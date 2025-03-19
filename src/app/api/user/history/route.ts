import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

// GET /api/user/history - Get user view history
export async function GET(request: NextRequest) {
  try {
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

    // Parse query parameters
    const searchParams = new URL(request.url).searchParams
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    // Get view history with pagination
    const history = await prisma.viewHistory.findMany({
      where: { userId: user.id },
      include: {
        saas: {
          select: {
            id: true,
            name: true,
            description: true,
            logo: true,
            category: true,
            pricingModel: true,
            website: true,
            averageRating: true,
            tags: true,
            _count: {
              select: {
                reviews: true,
                favorites: true
              }
            }
          }
        }
      },
      orderBy: { viewedAt: 'desc' },
      skip,
      take: limit
    })

    // Get total count
    const totalCount = await prisma.viewHistory.count({
      where: { userId: user.id }
    })

    return NextResponse.json({
      history,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    console.error('Error getting view history:', error)
    return NextResponse.json(
      { error: 'Failed to get view history' },
      { status: 500 }
    )
  }
}

// Schema for validating view history tracking
const historySchema = z.object({
  saasId: z.string().min(1, 'SaaS ID is required')
})

// POST /api/user/history - Track a view
export async function POST(request: NextRequest) {
  try {
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

    // Validate request body
    const body = await request.json()
    const validationResult = historySchema.safeParse(body)
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.format() },
        { status: 400 }
      )
    }
    
    const { saasId } = validationResult.data

    // Check if SaaS exists
    const saas = await prisma.saas.findUnique({
      where: { id: saasId }
    })
    
    if (!saas) {
      return NextResponse.json(
        { error: 'SaaS not found' },
        { status: 404 }
      )
    }

    // Create or update view history (always create a new record for accurate tracking)
    const viewHistory = await prisma.viewHistory.create({
      data: {
        userId: user.id,
        saasId,
        viewedAt: new Date()
      }
    })

    return NextResponse.json(viewHistory, { status: 201 })
  } catch (error) {
    console.error('Error tracking view history:', error)
    return NextResponse.json(
      { error: 'Failed to track view history' },
      { status: 500 }
    )
  }
}

// DELETE /api/user/history - Clear view history
export async function DELETE() {
  try {
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

    // Delete all view history for the user
    const result = await prisma.viewHistory.deleteMany({
      where: { userId: user.id }
    })

    return NextResponse.json({
      message: 'View history cleared successfully',
      deleted: result.count
    })
  } catch (error) {
    console.error('Error clearing view history:', error)
    return NextResponse.json(
      { error: 'Failed to clear view history' },
      { status: 500 }
    )
  }
} 