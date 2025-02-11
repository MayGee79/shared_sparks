import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('id')
  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
  }
  
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { firstName: true, lastName: true, username: true }
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json({ 
    firstName: user.firstName, 
    lastName: user.lastName,
    username: user.username 
  })
}