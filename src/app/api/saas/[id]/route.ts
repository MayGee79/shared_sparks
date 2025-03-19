import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    const saas = await prisma.saas.findUnique({
      where: { id },
      include: {
        submitter: {
          select: {
            username: true,
            image: true,
          },
        },
      },
    })

    if (!saas) {
      return NextResponse.json(
        { error: 'SaaS product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ saas })
  } catch (error) {
    console.error('Error fetching SaaS product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch SaaS product' },
      { status: 500 }
    )
  }
} 