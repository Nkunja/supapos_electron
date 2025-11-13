// import { NextRequest, NextResponse } from 'next/server';
// import api from '../auth';
// import { Salesperson, Shop } from '@/types/shop';

// export interface ShopDetail extends Shop {
//   active_salespersons_count: number;
//   total_products: number;
//   low_stock_alerts: number;
// }

// export interface ShopsResponse {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   results: Shop[];
// }

// export interface CreateShopData {
//   name: string;
//   address: string;
//   phone_number: string;
//   is_active?: boolean;
//   salespersons?: number[];
// }

// export interface UpdateShopData {
//   name?: string;
//   address?: string;
//   phone_number?: string;
//   is_active?: boolean;
//   salespersons?: number[];
// }

// export interface AssignSalespersonData {
//   salesperson_id: number;
// }

// export interface RemoveSalespersonData {
//   salesperson_id: number;
// }

// export interface SalespersonsListResponse {
//   shop_name: string;
//   salespersons_count: number;
//   salespersons: Salesperson[];
// }

// export interface MyShopsResponse {
//   shops_count: number;
//   shops: Shop[];
// }

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/';
// const SHOP_REPORTS_API_URL = `${API_BASE_URL}api/shop-reports/`;

// export const getShopOverview = async (shopId: number) => {
//   try {
//     const response = await api.get(`${SHOP_REPORTS_API_URL}${shopId}/overview/`);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to fetch shop overview.");
//   }
// };

// export const getShopSalesAnalytics = async (shopId: number) => {
//   try {
//     const response = await api.get(`${SHOP_REPORTS_API_URL}${shopId}/sales_analytics/`);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to fetch sales analytics.");
//   }
// };

// export const getShopInventoryAnalytics = async (shopId: number) => {
//   try {
//     const response = await api.get(`${SHOP_REPORTS_API_URL}${shopId}/inventory_analytics/`);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to fetch inventory analytics.");
//   }
// };

// export const getShopSalespersonAnalytics = async (shopId: number) => {
//   try {
//     const response = await api.get(`${SHOP_REPORTS_API_URL}${shopId}/salesperson_analytics/`);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to fetch salesperson analytics.");
//   }
// };

// export const getShopFinancialSummary = async (shopId: number) => {
//   try {
//     const response = await api.get(`${SHOP_REPORTS_API_URL}${shopId}/financial_summary/`);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to fetch financial summary.");
//   }
// };

// export const getShopProductPerformance = async (shopId: number, days: number = 30) => {
//   try {
//     const response = await api.get(`${SHOP_REPORTS_API_URL}${shopId}/product_performance/?days=${days}`);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to fetch product performance.");
//   }
// };

// export const getShopAlertsDetail = async (shopId: number) => {
//   try {
//     const response = await api.get(`${SHOP_REPORTS_API_URL}${shopId}/alerts_detail/`);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to fetch alerts detail.");
//   }
// };

// // Comprehensive Shop Report - Single API call for all data
// export const getCompleteShopReport = async (shopId: number, days: number = 30) => {
//   try {
//     const [
//       overview,
//       salesAnalytics,
//       inventoryAnalytics,
//       salespersonAnalytics,
//       financialSummary,
//       productPerformance,
//       alertsDetail
//     ] = await Promise.all([
//       getShopOverview(shopId),
//       getShopSalesAnalytics(shopId),
//       getShopInventoryAnalytics(shopId),
//       getShopSalespersonAnalytics(shopId),
//       getShopFinancialSummary(shopId),
//       getShopProductPerformance(shopId, days),
//       getShopAlertsDetail(shopId)
//     ]);

//     return {
//       shop_id: shopId,
//       overview,
//       sales_analytics: salesAnalytics,
//       inventory_analytics: inventoryAnalytics,
//       salesperson_analytics: salespersonAnalytics,
//       financial_summary: financialSummary,
//       product_performance: productPerformance,
//       alerts_detail: alertsDetail,
//       report_generated_at: new Date().toISOString()
//     };
//   } catch (error) {
//     throw new Error("Failed to fetch complete shop report.");
//   }
// };

// // API Route Handler
// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const shopId = searchParams.get('shopId');
//     const days = parseInt(searchParams.get('days') || '30');
//     const reportType = searchParams.get('type') || 'complete';

//     if (!shopId) {
//       return NextResponse.json(
//         { error: 'Shop ID is required' },
//         { status: 400 }
//       );
//     }

//     const shopIdNum = parseInt(shopId);
//     if (isNaN(shopIdNum)) {
//       return NextResponse.json(
//         { error: 'Invalid shop ID' },
//         { status: 400 }
//       );
//     }

//     switch (reportType) {
//       case 'overview':
//         const overview = await getShopOverview(shopIdNum);
//         return NextResponse.json(overview);
        
//       case 'sales':
//         const salesAnalytics = await getShopSalesAnalytics(shopIdNum);
//         return NextResponse.json(salesAnalytics);
        
//       case 'inventory':
//         const inventoryAnalytics = await getShopInventoryAnalytics(shopIdNum);
//         return NextResponse.json(inventoryAnalytics);
        
//       case 'salesperson':
//         const salespersonAnalytics = await getShopSalespersonAnalytics(shopIdNum);
//         return NextResponse.json(salespersonAnalytics);
        
//       case 'financial':
//         const financialSummary = await getShopFinancialSummary(shopIdNum);
//         return NextResponse.json(financialSummary);
        
//       case 'products':
//         const productPerformance = await getShopProductPerformance(shopIdNum, days);
//         return NextResponse.json(productPerformance);
        
//       case 'alerts':
//         const alertsDetail = await getShopAlertsDetail(shopIdNum);
//         return NextResponse.json(alertsDetail);
        
//       case 'complete':
//       default:
//         const completeReport = await getCompleteShopReport(shopIdNum, days);
//         return NextResponse.json(completeReport);
//     }

//   } catch (error: any) {
//     return NextResponse.json(
//       { error: error.message || 'Failed to fetch shop details' },
//       { status: 500 }
//     );
//   }
// }

import { NextRequest, NextResponse } from 'next/server';
import {
  getShopOverview,
  getShopSalesAnalytics,
  getShopInventoryAnalytics,
  getShopSalespersonAnalytics,
  getShopFinancialSummary,
  getShopProductPerformance,
  getShopAlertsDetail,
  getCompleteShopReport
} from '@/lib/shop-reports';

// API Route Handler
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const shopId = searchParams.get('shopId');
    const days = parseInt(searchParams.get('days') || '30');
    const reportType = searchParams.get('type') || 'complete';

    if (!shopId) {
      return NextResponse.json(
        { error: 'Shop ID is required' },
        { status: 400 }
      );
    }

    const shopIdNum = parseInt(shopId);
    if (isNaN(shopIdNum)) {
      return NextResponse.json(
        { error: 'Invalid shop ID' },
        { status: 400 }
      );
    }

    switch (reportType) {
      case 'overview':
        const overview = await getShopOverview(shopIdNum);
        return NextResponse.json(overview);
        
      case 'sales':
        const salesAnalytics = await getShopSalesAnalytics(shopIdNum);
        return NextResponse.json(salesAnalytics);
        
      case 'inventory':
        const inventoryAnalytics = await getShopInventoryAnalytics(shopIdNum);
        return NextResponse.json(inventoryAnalytics);
        
      case 'salesperson':
        const salespersonAnalytics = await getShopSalespersonAnalytics(shopIdNum);
        return NextResponse.json(salespersonAnalytics);
        
      case 'financial':
        const financialSummary = await getShopFinancialSummary(shopIdNum);
        return NextResponse.json(financialSummary);
        
      case 'products':
        const productPerformance = await getShopProductPerformance(shopIdNum, days);
        return NextResponse.json(productPerformance);
        
      case 'alerts':
        const alertsDetail = await getShopAlertsDetail(shopIdNum);
        return NextResponse.json(alertsDetail);
        
      case 'complete':
      default:
        const completeReport = await getCompleteShopReport(shopIdNum, days);
        return NextResponse.json(completeReport);
    }

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch shop details' },
      { status: 500 }
    );
  }
}

export { getCompleteShopReport };
