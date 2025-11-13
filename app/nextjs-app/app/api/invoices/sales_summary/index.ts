import { NextRequest, NextResponse } from "next/server";
import api from "../../auth";

export interface SalesSummary {
  overall_summary: {
    total_sales: number;
    total_invoices: number;
    average_order_value: number;
    total_items_sold: number;
  };
  period_comparison: {
    current_period: {
      total_sales: number;
      total_invoices: number;
      average_order_value: number;
    };
    previous_period: {
      total_sales: number;
      total_invoices: number;
      average_order_value: number;
    };
    growth_percentage: number;
  };
  top_products: Array<{
    id: number;
    name: string;
    total_sold: number;
    revenue: number;
  }>;
  sales_by_day: Array<{
    date: string;
    sales: number;
    invoices: number;
  }>;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://pharmasys.sirnkunja.co.ke/";
const API_URL = `${API_BASE_URL}api/invoices/sales_summary/?period_days=30`;

// Core API functions
export const getSalesSummary = async (
  periodDays: string = "30",
  forceRefresh: boolean = false
) => {
  try {
    console.log(`🔄 Fetching sales summary from API for ${periodDays} days`);
    const response = await api.get(`${API_URL}?period_days=${periodDays}`);

    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch sales summary.");
  }
};

// API Route Handlers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const periodDays = searchParams.get("period_days") || "30";

    const summary = await getSalesSummary(periodDays);
    return NextResponse.json(summary);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch sales summary" },
      { status: 500 }
    );
  }
}
