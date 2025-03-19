import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    const savedSearches = await prisma.savedSearch.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" }
    });
    
    return NextResponse.json(savedSearches);
  } catch (error) {
    console.error("Error getting saved searches:", error);
    return NextResponse.json({ error: "Failed to get saved searches" }, { status: 500 });
  }
}

// Schema for validating saved search creation requests
const savedSearchSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  query: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  pricingModel: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  receiveAlerts: z.boolean().optional().default(false)
});

// POST /api/user/saved-searches - Create a new saved search
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
    const validationResult = savedSearchSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.format() },
        { status: 400 }
      );
    }
    
    const { name, query, category, pricingModel, tags, receiveAlerts } = validationResult.data;

    // Check if a saved search with the same name already exists
    const existingSearch = await prisma.savedSearch.findFirst({
      where: {
        userId: user.id,
        name
      }
    });
    
    if (existingSearch) {
      return NextResponse.json(
        { error: 'A saved search with this name already exists' },
        { status: 400 }
      );
    }

    // Create saved search
    const savedSearch = await prisma.savedSearch.create({
      data: {
        userId: user.id,
        name,
        query: query || null,
        category: category || null,
        pricingModel: pricingModel || null,
        tags: tags || [],
        receiveAlerts: receiveAlerts || false
      }
    });

    return NextResponse.json(savedSearch, { status: 201 });
  } catch (error) {
    console.error('Error creating saved search:', error);
    return NextResponse.json(
      { error: 'Failed to create saved search' },
      { status: 500 }
    );
  }
}
