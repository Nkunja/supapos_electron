import { NextRequest, NextResponse } from 'next/server';
import api from '../../auth';

export interface DashboardStats {
  total_sales: number;
  total_products: number;
  total_customers: number;
  total_invoices: number;
  recent_sales: number;
  low_stock_products: number;
  top_products: Array<{
    id: number;
    name: string;
    total_sold: number;
    revenue: number;
  }>;
  sales_by_period: Array<{
    date: string;
    sales: number;
    invoices: number;
  }>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ||  'https://pharmasys.sirnkunja.co.ke/';
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pharmacy-suite.onrender.com/';

const API_URL = `${API_BASE_URL}api/dashboard/stats/`;

// Core API functions
export const getDashboardStats = async () => {
  try {
    const response = await api.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch dashboard stats.");
  }
};

// API Route Handlers
export async function GET(request: NextRequest) {
  try {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
} 