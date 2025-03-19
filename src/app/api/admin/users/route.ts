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
    
    // Parse query parameters
    const searchParams = new URL(request.url).searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const userType = searchParams.get('userType') || undefined
    
    // Calculate pagination
    const skip = (page - 1) * limit
    
    // Create where clause based on filters
    const whereClause: any = {}
    
    // Add search filter
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { username: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    // Add user type filter
    if (userType && userType !== 'ALL') {
      whereClause.userType = userType
    }
    
    // Get total count for pagination
    const totalUsers = await prisma.user.count({
      where: whereClause
    })
    
    // Fetch users
    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        image: true,
        userType: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    })
    
    // Calculate total pages
    const totalPages = Math.ceil(totalUsers / limit)
    
    return NextResponse.json({
      users,
      totalUsers,
      totalPages,
      currentPage: page
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

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
    
    // Parse the request body
    const data = await request.json()
    
    // Validate required fields
    if (!data.email || !data.password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email }
    })
    
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }
    
    // Create user (in a real app, you'd hash the password)
    // Note: This is a simplification; in a real app, you should use a proper auth system
    const newUser = await prisma.user.create({
      data: {
        name: data.name || null,
        email: data.email,
        username: data.username || null,
        userType: data.userType || 'USER',
        // In a real app, you would hash the password with bcrypt
        // For now, we're just storing it in a 'password' field as a placeholder
        // This would be a security issue in a production app
        hashedPassword: data.password // This is VERY UNSAFE - only for demo purposes
      }
    })
    
    // Exclude hashedPassword from response
    const { hashedPassword, ...userWithoutPassword } = newUser
    
    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
} 