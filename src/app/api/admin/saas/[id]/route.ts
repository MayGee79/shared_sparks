import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth.config'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const id = params.id
    
    // Get the SaaS with detailed information
    const saas = await prisma.saas.findUnique({
      where: { id },
      include: {
        submitter: {
          select: {
            id: true,
            name: true,
            email: true,
            username: true,
            image: true
          }
        },
        reviews: {
          select: {
            id: true,
            content: true,
            rating: true,
            createdAt: true,
            user: {
              select: {
                username: true,
                image: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })
    
    if (!saas) {
      return NextResponse.json(
        { error: 'SaaS not found' },
        { status: 404 }
      )
    }
    
    // Get favorite count
    const favoriteCount = await prisma.saasFavorite.count({
      where: { saasId: id }
    })
    
    return NextResponse.json({
      saas: {
        ...saas,
        favoriteCount
      }
    })
  } catch (error) {
    console.error('Error fetching SaaS details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch SaaS details' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const id = params.id
    
    // Check if the SaaS exists
    const existingSaas = await prisma.saas.findUnique({
      where: { id }
    })
    
    if (!existingSaas) {
      return NextResponse.json(
        { error: 'SaaS not found' },
        { status: 404 }
      )
    }
    
    // Parse the request body
    const data = await request.json()
    
    // Validate required fields
    if (!data.name || !data.description || !data.website || !data.category || !data.pricingModel) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Update the SaaS
    const updatedSaas = await prisma.saas.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
        website: data.website,
        category: data.category,
        pricingModel: data.pricingModel,
        pricingDetails: data.pricingDetails,
        tags: data.tags,
        features: data.features,
        integrations: data.integrations,
        pros: data.pros,
        cons: data.cons,
        logo: data.logo,
        verified: data.verified
      }
    })
    
    // If the SaaS is being verified for the first time, send a notification
    if (data.verified && !existingSaas.verified) {
      // TODO: Send notification to the submitter that their SaaS was approved
    }
    
    return NextResponse.json({
      success: true,
      saas: updatedSaas
    })
  } catch (error) {
    console.error('Error updating SaaS:', error)
    return NextResponse.json(
      { error: 'Failed to update SaaS' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    
    const id = params.id
    
    // Check if the SaaS exists
    const saas = await prisma.saas.findUnique({
      where: { id }
    })
    
    if (!saas) {
      return NextResponse.json(
        { error: 'SaaS not found' },
        { status: 404 }
      )
    }
    
    // First, delete related records
    // Delete favorites
    await prisma.saasFavorite.deleteMany({
      where: { saasId: id }
    })
    
    // Delete reviews
    await prisma.saaSReview.deleteMany({
      where: { saasId: id }
    })
    
    // Delete the SaaS
    await prisma.saas.delete({
      where: { id }
    })
    
    return NextResponse.json({
      success: true,
      message: 'SaaS deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting SaaS:', error)
    return NextResponse.json(
      { error: 'Failed to delete SaaS' },
      { status: 500 }
    )
  }
} 