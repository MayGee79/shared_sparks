import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth.config'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    // Check if user is an admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { userType: true }
    })
    
    if (!user || user.userType !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    
    const skip = (page - 1) * limit
    
    // Build filter object
    let whereClause: any = {}
    
    if (category) {
      whereClause.category = category
    }
    
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }
    
    // Get SaaS items with filtering and pagination
    const [items, total, categories] = await Promise.all([
      prisma.saas.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          description: true,
          website: true,
          category: true,
          pricingModel: true,
          tags: true,
          averageRating: true,
          verified: true,
          createdAt: true,
          submitter: {
            select: {
              username: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.saas.count({ where: whereClause }),
      prisma.saas.groupBy({
        by: ['category']
      })
    ])
    
    return NextResponse.json({
      items,
      total,
      categories: categories.map(c => c.category)
    })
  } catch (error) {
    console.error('Error fetching SaaS items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch SaaS items' },
      { status: 500 }
    )
  }
} 