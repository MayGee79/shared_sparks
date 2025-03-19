import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { z } from 'zod'

// Schema for validating saved search updates
const updateSavedSearchSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  query: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  pricingModel: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  receiveAlerts: z.boolean().optional()
})

// DELETE /api/user/saved-searches/[id] - Delete a saved search
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    
    if (!id) {
      return NextResponse.json(
        { error: 'Saved search ID is required' },
        { status: 400 }
      )
    }

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

    // Get saved search
    const savedSearch = await prisma.savedSearch.findUnique({
      where: { id }
    })
    
    if (!savedSearch) {
      return NextResponse.json(
        { error: 'Saved search not found' },
        { status: 404 }
      )
    }

    // Check if user owns this saved search
    if (savedSearch.userId !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      )
    }

    // Delete saved search
    await prisma.savedSearch.delete({
      where: { id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting saved search:', error)
    return NextResponse.json(
      { error: 'Failed to delete saved search' },
      { status: 500 }
    )
  }
} 