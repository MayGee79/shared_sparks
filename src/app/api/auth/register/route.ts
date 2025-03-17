import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'
import { UserType } from '@prisma/client'

export async function POST(req: Request) {
  try {
    const { email, name, password } = await req.json()

    if (!email || !name || !password) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Split name into first and last name
    const [firstName, ...lastNameParts] = name.split(' ')
    const lastName = lastNameParts.join(' ')

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        hashedPassword,
        userType: UserType.PROBLEM_SUBMITTER,
      },
    })

    // Remove sensitive data before sending response
    const { hashedPassword: _, ...safeUser } = user

    return NextResponse.json(safeUser)
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { message: 'Error creating user' },
      { status: 500 }
    )
  }
} 