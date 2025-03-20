import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const id = context.params.id;
  
  return NextResponse.json({
    status: 'ok',
    message: 'Dynamic API is working',
    id,
    timestamp: new Date().toISOString()
  });
} 