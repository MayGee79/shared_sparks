import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

// GET /api/user/favorites - Get all favorites for the current user
export async function GET() {
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

    // Get favorites
    const favorites = await prisma.favorite.findMany({
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
            createdAt: true,
            submitter: {
              select: {
                username: true,
                image: true
              }
            },
            _count: {
              select: {
                reviews: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(favorites)
  } catch (error) {
    console.error('Error getting favorites:', error)
    return NextResponse.json(
      { error: 'Failed to get favorites' },
      { status: 500 }
    )
  }
}

// Schema for validating favorite creation requests
const favoriteSchema = z.object({
  saasId: z.string().min(1, 'SaaS ID is required')
})

// POST /api/user/favorites - Add a new favorite
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
    const validationResult = favoriteSchema.safeParse(body)
    
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

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        userId_saasId: {
          userId: user.id,
          saasId
        }
      }
    })
    
    if (existingFavorite) {
      return NextResponse.json(
        { error: 'Already favorited', favorite: existingFavorite },
        { status: 400 }
      )
    }

    // Create favorite
    const favorite = await prisma.favorite.create({
      data: {
        userId: user.id,
        saasId
      },
      include: {
        saas: {
          select: {
            name: true,
            category: true
          }
        }
      }
    })

    return NextResponse.json(favorite, { status: 201 })
  } catch (error) {
    console.error('Error adding favorite:', error)
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    )
  }
} 