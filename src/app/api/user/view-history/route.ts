import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

// GET /api/user/view-history - Get the user's view history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get('limit') || '10');
    const page = Number(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;
    
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get view history with SaaS details
    const viewHistory = await prisma.viewHistory.findMany({
      where: { userId: user.id },
      orderBy: { viewedAt: 'desc' },
      skip,
      take: limit,
      include: {
        SaaS: {
          select: {
            id: true,
            name: true,
            description: true,
            logo: true,
            category: true,
            pricingModel: true
          }
        }
      }
    });

    // Get total count for pagination
    const totalCount = await prisma.viewHistory.count({
      where: { userId: user.id }
    });

    return NextResponse.json({
      data: viewHistory,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error getting view history:', error);
    return NextResponse.json(
      { error: 'Failed to get view history' },
      { status: 500 }
    );
  }
}

// Schema for validating view history creation
const viewHistorySchema = z.object({
  saasId: z.string().min(1, 'SaaS ID is required')
});

// POST /api/user/view-history - Add to view history
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Validate request body
    const body = await request.json();
    const validationResult = viewHistorySchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { saasId } = validationResult.data;

    // Check if SaaS exists
    const saas = await prisma.saaS.findUnique({
      where: { id: saasId }
    });
    
    if (!saas) {
      return NextResponse.json(
        { error: 'SaaS not found' },
        { status: 404 }
      );
    }

    // Add to view history
    const viewHistoryEntry = await prisma.viewHistory.create({
      data: {
        userId: user.id,
        saasId
      }
    });

    return NextResponse.json(viewHistoryEntry, { status: 201 });
  } catch (error) {
    console.error('Error adding to view history:', error);
    return NextResponse.json(
      { error: 'Failed to add to view history' },
      { status: 500 }
    );
  }
}

// DELETE /api/user/view-history - Clear view history
export async function DELETE() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete all view history for this user
    await prisma.viewHistory.deleteMany({
      where: { userId: user.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error clearing view history:', error);
    return NextResponse.json(
      { error: 'Failed to clear view history' },
      { status: 500 }
    );
  }
} 