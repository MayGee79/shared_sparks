import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth.config'
import prisma from '@/lib/prisma'

// GET handler to list SaaS products
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const tag = searchParams.get('tag')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const skip = (page - 1) * limit

    let whereClause: any = {
      verified: true,
    }

    if (category) {
      whereClause.category = category
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (tag) {
      whereClause.tags = {
        has: tag,
      }
    }

    const [saasProducts, totalCount] = await Promise.all([
      prisma.saas.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          description: true,
          logo: true,
          website: true,
          category: true,
          pricingModel: true,
          tags: true,
          averageRating: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.saas.count({ where: whereClause }),
    ])

    // Get all categories and tags for filtering
    const [categories, allTags] = await Promise.all([
      prisma.saas.groupBy({
        by: ['category'],
        where: { verified: true },
      }),
      prisma.saas.findMany({
        where: { verified: true },
        select: { tags: true },
      }),
    ])

    // Extract and deduplicate tags
    const uniqueTags = Array.from(
      new Set(allTags.flatMap(item => item.tags).filter(Boolean))
    )

    return NextResponse.json({
      saas: saasProducts,
      totalCount,
      pageCount: Math.ceil(totalCount / limit),
      categories: categories.map(c => c.category),
      tags: uniqueTags,
    })
  } catch (error) {
    console.error('Error fetching SaaS products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch SaaS products' },
      { status: 500 }
    )
  }
}

// POST handler to create a new SaaS product
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be logged in to submit a SaaS' },
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

    const data = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'website', 'category', 'pricingModel', 'tags', 'features', 'pros', 'cons']
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `${field} is required` },
          { status: 400 }
        )
      }
    }

    // Check if SaaS with the same name already exists
    const existingSaaS = await prisma.saas.findFirst({
      where: {
        name: { equals: data.name, mode: 'insensitive' },
      },
    })

    if (existingSaaS) {
      return NextResponse.json(
        { error: 'A SaaS product with this name already exists' },
        { status: 409 }
      )
    }

    // Create new SaaS
    const newSaaS = await prisma.saas.create({
      data: {
        name: data.name,
        description: data.description,
        website: data.website,
        logo: data.logo || null,
        category: data.category,
        pricingModel: data.pricingModel,
        pricingDetails: data.pricingDetails || null,
        tags: Array.isArray(data.tags) ? data.tags : [],
        features: Array.isArray(data.features) ? data.features : [],
        integrations: Array.isArray(data.integrations) ? data.integrations : [],
        pros: Array.isArray(data.pros) ? data.pros : [],
        cons: Array.isArray(data.cons) ? data.cons : [],
        verified: false, // New submissions need verification
        submitterId: user.id,
      },
    })

    return NextResponse.json({ 
      success: true, 
      message: 'SaaS submitted successfully and is pending verification',
      saas: {
        id: newSaaS.id,
        name: newSaaS.name,
      }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating SaaS:', error)
    return NextResponse.json(
      { error: 'Failed to create SaaS product' },
      { status: 500 }
    )
  }
} 