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
    
    // Get statistics
    const [
      totalUsers,
      totalSaas,
      pendingApprovals,
      totalRequests
    ] = await Promise.all([
      prisma.user.count(),
      prisma.saas.count({ where: { verified: true } }),
      prisma.saas.count({ where: { verified: false } }),
      prisma.collaborationRequest.count() // This is a placeholder for actual requests
    ])
    
    return NextResponse.json({
      totalUsers,
      totalSaas,
      pendingApprovals,
      totalRequests
    })
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
} 