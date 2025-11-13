import { NextRequest, NextResponse } from 'next/server';
import { getMovementSummary } from '../index';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const params: any = {};
    if (searchParams.get('movement_type')) params.movement_type = searchParams.get('movement_type');
    if (searchParams.get('inventory')) params.inventory = searchParams.get('inventory');
    if (searchParams.get('search')) params.search = searchParams.get('search');
    if (searchParams.get('date_from')) params.date_from = searchParams.get('date_from');
    if (searchParams.get('date_to')) params.date_to = searchParams.get('date_to');

    const summary = await getMovementSummary(params);
    return NextResponse.json(summary);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch movement summary' },
      { status: 500 }
    );
  }
}
