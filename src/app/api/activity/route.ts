import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/prisma'

interface CountResult {
  count: number | bigint
}

export async function GET() {
  const session = await getServerSession()
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const results = await prisma.$queryRaw<CountResult[]>`
      SELECT 
        COUNT(*) FILTER (WHERE type = 'SEARCH')::int as count
      FROM useractivity 
      WHERE "userId" = ${session.user.id}
    `
    const requestResults = await prisma.$queryRaw<CountResult[]>`
      SELECT COUNT(*) FILTER (WHERE type = 'REQUEST')::int as count
      FROM useractivity 
      WHERE "userId" = ${session.user.id}
    `
    const offerResults = await prisma.$queryRaw<CountResult[]>`
      SELECT COUNT(*) FILTER (WHERE type = 'OFFER')::int as count
      FROM useractivity 
      WHERE "userId" = ${session.user.id}
    `

    return NextResponse.json({
      searchCount: Number(results[0]?.count || 0),
      requestCount: Number(requestResults[0]?.count || 0),
      offerCount: Number(offerResults[0]?.count || 0)
    })
  } catch (error) {
    console.error('Activity count error:', error)
    return NextResponse.json({ error: 'Failed to fetch counts' }, { status: 500 })
  }
}

export async function POST() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 })
}
