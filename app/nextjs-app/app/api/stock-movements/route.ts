import { NextRequest, NextResponse } from "next/server";
import { getStockMovements, createStockMovement } from "./index";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const params: any = {};
    if (searchParams.get('movement_type')) params.movement_type = searchParams.get('movement_type');
    if (searchParams.get('inventory')) params.inventory = searchParams.get('inventory');
    if (searchParams.get('search')) params.search = searchParams.get('search');
    if (searchParams.get('date_from')) params.date_from = searchParams.get('date_from');
    if (searchParams.get('date_to')) params.date_to = searchParams.get('date_to');
    if (searchParams.get('page')) params.page = searchParams.get('page');
    if (searchParams.get('page_size')) params.page_size = searchParams.get('page_size');

    const stockMovements = await getStockMovements(params);
    return NextResponse.json(stockMovements);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch stock movements" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const stockMovement = await createStockMovement(body);
    return NextResponse.json(stockMovement);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create stock movement" },
      { status: 500 }
    );
  }
}
