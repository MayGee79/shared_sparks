import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

export async function POST(request: Request) {
  const session = await getServerSession()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { type } = await request.json()
    
    // Use raw SQL instead of Prisma model
    const result = await prisma.$executeRaw`
      INSERT INTO useractivity (id, "userId", type, timestamp)
      VALUES (gen_random_uuid(), ${session.user.id}, ${type}, NOW())
      RETURNING id, type, timestamp
    `

    return NextResponse.json({ success: true, result })
  } catch (error) {
    console.error('Activity creation error:', error)
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 })
  }
}
