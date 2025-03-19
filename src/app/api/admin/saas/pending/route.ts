import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth.config'
import prisma from '@/lib/prisma'

export async function GET() {
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
    
    // Get pending SaaS submissions
    const pendingSubmissions = await prisma.saas.findMany({
      where: {
        verified: false
      },
      select: {
        id: true,
        name: true,
        description: true,
        website: true,
        category: true,
        pricingModel: true,
        createdAt: true,
        submitter: {
          select: {
            username: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    
    return NextResponse.json({
      submissions: pendingSubmissions
    })
  } catch (error) {
    console.error('Error fetching pending submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pending submissions' },
      { status: 500 }
    )
  }
} 