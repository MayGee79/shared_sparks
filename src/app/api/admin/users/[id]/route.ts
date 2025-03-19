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
    const admin = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { userType: true }
    })
    
    if (!admin || admin.userType !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }
    
    const id = params.id
    
    // Get the user
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        image: true,
        userType: true,
        createdAt: true
      }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Get user statistics
    const saasSubmissions = await prisma.saas.count({
      where: { submitterId: id }
    })
    
    const reviews = await prisma.saaSReview.count({
      where: { userId: id }
    })
    
    const favorites = await prisma.saasFavorite.count({
      where: { userId: id }
    })
    
    return NextResponse.json({
      user,
      stats: {
        saasSubmissions,
        reviews,
        favorites
      }
    })
  } catch (error) {
    console.error('Error fetching user details:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user details' },
      { status: 500 }
    )
  }
}

export async function PATCH(
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
    const admin = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { userType: true }
    })
    
    if (!admin || admin.userType !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }
    
    const id = params.id
    
    // Check if the user exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    })
    
    if (!existingUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Parse the request body
    const data = await request.json()
    
    // Prepare the update data
    const updateData: any = {}
    
    // Only include fields that are provided
    if (data.name !== undefined) updateData.name = data.name
    if (data.email !== undefined) updateData.email = data.email
    if (data.username !== undefined) updateData.username = data.username
    if (data.userType !== undefined) updateData.userType = data.userType
    if (data.password !== undefined) updateData.hashedPassword = data.password // Again, this is unsafe for production
    
    // If email is changing, check if it's already taken
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: data.email }
      })
      
      if (emailExists) {
        return NextResponse.json(
          { error: 'Email is already in use' },
          { status: 400 }
        )
      }
    }
    
    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        image: true,
        userType: true,
        createdAt: true
      }
    })
    
    return NextResponse.json({
      success: true,
      user: updatedUser
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Failed to update user' },
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
    const admin = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { userType: true }
    })
    
    if (!admin || admin.userType !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 }
      )
    }
    
    const id = params.id
    
    // Cannot delete yourself
    if (id === session.user.id) {
      return NextResponse.json(
        { error: 'You cannot delete your own account' },
        { status: 400 }
      )
    }
    
    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id }
    })
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }
    
    // Delete related records to avoid foreign key constraints
    // Delete user's SaaS favorites
    await prisma.saasFavorite.deleteMany({
      where: { userId: id }
    })
    
    // Delete user's SaaS reviews
    await prisma.saaSReview.deleteMany({
      where: { userId: id }
    })
    
    // For SaaS submissions, you might want to reassign them to an admin
    // or delete them based on your business rules
    await prisma.saas.updateMany({
      where: { submitterId: id },
      data: { submitterId: admin.id } // Reassign to the admin performing the deletion
    })
    
    // Delete the user
    await prisma.user.delete({
      where: { id }
    })
    
    return NextResponse.json({
      success: true,
      message: 'User deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    )
  }
} 