import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET /api/user/view-history/[id] - Get a specific view history entry
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
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

    // Get view history entry
    const viewHistoryEntry = await prisma.viewHistory.findUnique({
      where: { id },
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

    if (!viewHistoryEntry) {
      return NextResponse.json(
        { error: 'View history entry not found' },
        { status: 404 }
      );
    }

    // Check if user owns this view history entry
    if (viewHistoryEntry.userId !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    return NextResponse.json(viewHistoryEntry);
  } catch (error) {
    console.error('Error getting view history entry:', error);
    return NextResponse.json(
      { error: 'Failed to get view history entry' },
      { status: 500 }
    );
  }
}

// DELETE /api/user/view-history/[id] - Delete a specific view history entry
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
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

    // Get view history entry
    const viewHistoryEntry = await prisma.viewHistory.findUnique({
      where: { id }
    });

    if (!viewHistoryEntry) {
      return NextResponse.json(
        { error: 'View history entry not found' },
        { status: 404 }
      );
    }

    // Check if user owns this view history entry
    if (viewHistoryEntry.userId !== user.id) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }

    // Delete view history entry
    await prisma.viewHistory.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting view history entry:', error);
    return NextResponse.json(
      { error: 'Failed to delete view history entry' },
      { status: 500 }
    );
  }
} 