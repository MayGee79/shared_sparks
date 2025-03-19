import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth.config'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be logged in to view favorites' },
        { status: 401 }
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

    // Get all favorites with SaaS details
    const favorites = await prisma.saasFavorite.findMany({
      where: {
        userId: user.id,
      },
      include: {
        saas: {
          select: {
            id: true,
            name: true,
            description: true,
            logo: true,
            website: true,
            category: true,
            pricingModel: true,
            tags: true,
            features: true,
            averageRating: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Format response to include only SaaS data
    const formattedFavorites = favorites.map(favorite => ({
      ...favorite.saas,
      favoritedAt: favorite.createdAt,
    }))

    return NextResponse.json({ favorites: formattedFavorites })
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    )
  }
} 