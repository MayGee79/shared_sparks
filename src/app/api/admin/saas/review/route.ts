import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth.config'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
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
      select: { id: true, userType: true }
    })
    
    if (!user || user.userType !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }
    
    const data = await request.json()
    const { id, action } = data
    
    if (!id || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    if (action !== 'approve' && action !== 'reject') {
      return NextResponse.json(
        { error: 'Invalid action. Must be either "approve" or "reject"' },
        { status: 400 }
      )
    }
    
    // Check if the SaaS exists
    const saas = await prisma.saas.findUnique({
      where: { id }
    })
    
    if (!saas) {
      return NextResponse.json(
        { error: 'SaaS submission not found' },
        { status: 404 }
      )
    }
    
    if (action === 'approve') {
      // Approve the submission
      await prisma.saas.update({
        where: { id },
        data: {
          verified: true
        }
      })
      
      // TODO: Send notification to the submitter
      
      return NextResponse.json({
        success: true,
        message: 'SaaS submission approved successfully'
      })
    } else {
      // Reject the submission - in a real system, you might want to archive it
      // instead of deleting it
      await prisma.saas.delete({
        where: { id }
      })
      
      // TODO: Send notification to the submitter
      
      return NextResponse.json({
        success: true,
        message: 'SaaS submission rejected successfully'
      })
    }
  } catch (error) {
    console.error('Error reviewing SaaS submission:', error)
    return NextResponse.json(
      { error: 'Failed to process review action' },
      { status: 500 }
    )
  }
} 