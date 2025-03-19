import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Get session to check authentication status
    const session = await getServerSession(authOptions)
    const isAuthenticated = !!session?.user?.email
    
    // Parse query parameters
    const searchParams = new URL(request.url).searchParams
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category') || undefined
    
    // Only allow these filters for authenticated users
    const pricingModel = isAuthenticated ? (searchParams.get('pricing') || undefined) : undefined
    const tags = isAuthenticated && searchParams.get('tags') ? searchParams.get('tags')?.split(',') : undefined
    
    // Parse pagination parameters
    let page = parseInt(searchParams.get('page') || '1')
    let limit = parseInt(searchParams.get('limit') || '12')
    
    // For non-authenticated users, enforce limits regardless of request
    if (!isAuthenticated) {
      page = 1 // Always first page
      limit = Math.min(limit, 6) // Max 6 results
    }
    
    const sortBy = searchParams.get('sortBy') || 'popular' // popular, newest, rating
    
    // Calculate pagination
    const skip = (page - 1) * limit
    
    // Base where clause for verified SaaS items only
    const whereClause: any = {
      verified: true
    }
    
    // Add search query filter
    if (query) {
      whereClause.OR = [
        { name: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { tags: { hasSome: [query] } }
      ]
    }
    
    // Add category filter
    if (category) {
      whereClause.category = category
    }
    
    // Add pricing model filter - only for authenticated users
    if (isAuthenticated && pricingModel) {
      whereClause.pricingModel = pricingModel
    }
    
    // Add tags filter - only for authenticated users
    if (isAuthenticated && tags && tags.length > 0) {
      whereClause.tags = {
        hasSome: tags
      }
    }
    
    // Determine sort order
    let orderBy: any = {}
    
    switch (sortBy) {
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      case 'rating':
        orderBy = { averageRating: 'desc' }
        break
      case 'popular':
      default:
        // For "popular", we'll use a combination of favorites count and rating
        orderBy = [
          { averageRating: 'desc' },
          { createdAt: 'desc' }
        ]
        break
    }
    
    // Get total count for pagination
    const totalItems = await prisma.saas.count({ where: whereClause })
    
    // Define select object based on authentication status
    const baseSelect = {
      id: true,
      name: true,
      description: true,
      website: true,
      category: true,
      pricingModel: true,
      tags: true,
      logo: true,
      averageRating: true,
      createdAt: true,
      submitter: {
        select: {
          username: true,
          image: true
        }
      },
      _count: {
        select: {
          favorites: true,
          reviews: true
        }
      }
    }
    
    // Add additional fields for authenticated users
    const authenticatedSelect = {
      ...baseSelect,
      features: true,
      pros: true,
      cons: true
    }
    
    // Fetch SaaS items with their submitter info
    const saasItems = await prisma.saas.findMany({
      where: whereClause,
      select: isAuthenticated ? authenticatedSelect : baseSelect,
      orderBy,
      skip,
      take: limit
    })
    
    // Get all available categories
    const categories = await prisma.saas.groupBy({
      by: ['category'],
      where: { verified: true },
      _count: true,
      orderBy: {
        _count: {
          category: 'desc'
        }
      }
    })
    
    // Get all available pricing models
    const pricingModels = await prisma.saas.groupBy({
      by: ['pricingModel'],
      where: { verified: true },
      _count: true,
      orderBy: {
        _count: {
          pricingModel: 'desc'
        }
      }
    })
    
    // Get popular tags
    const allSaasTags = await prisma.saas.findMany({
      where: { verified: true },
      select: { tags: true }
    })
    
    // Count tag occurrences
    const tagCounts: Record<string, number> = {}
    allSaasTags.forEach(saas => {
      saas.tags.forEach(tag => {
        if (tagCounts[tag]) {
          tagCounts[tag]++
        } else {
          tagCounts[tag] = 1
        }
      })
    })
    
    // Sort tags by occurrence
    const popularTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20) // Get top 20 tags
      .map(([tag]) => tag)
    
    // Calculate total pages
    const totalPages = Math.ceil(totalItems / limit)
    
    return NextResponse.json({
      items: saasItems,
      pagination: {
        page,
        limit,
        totalItems,
        totalPages
      },
      filters: {
        categories: categories.map(c => ({
          name: c.category,
          count: c._count
        })),
        pricingModels: pricingModels.map(p => ({
          name: p.pricingModel,
          count: p._count
        })),
        popularTags
      },
      isAuthenticated // Include authentication status in response
    })
  } catch (error) {
    console.error('Error searching SaaS:', error)
    return NextResponse.json(
      { error: 'Failed to search SaaS items' },
      { status: 500 }
    )
  }
} 