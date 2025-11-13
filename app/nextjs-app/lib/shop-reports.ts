import api from '../app/api/auth';
import { Salesperson, Shop } from '@/types/shop';

export interface ShopDetail extends Shop {
  active_salespersons_count: number;
  total_products: number;
  low_stock_alerts: number;
}

export interface ShopsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Shop[];
}

export interface CreateShopData {
  name: string;
  address: string;
  phone_number: string;
  is_active?: boolean;
  salespersons?: number[];
}

export interface UpdateShopData {
  name?: string;
  address?: string;
  phone_number?: string;
  is_active?: boolean;
  salespersons?: number[];
}

export interface AssignSalespersonData {
  salesperson_id: number;
}

export interface RemoveSalespersonData {
  salesperson_id: number;
}

export interface SalespersonsListResponse {
  shop_name: string;
  salespersons_count: number;
  salespersons: Salesperson[];
}

export interface MyShopsResponse {
  shops_count: number;
  shops: Shop[];
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pharmacy-suite.onrender.com/';
const SHOP_REPORTS_API_URL = `${API_BASE_URL}api/shop-reports/`;

export const getShopOverview = async (shopId: number) => {
  try {
    const response = await api.get(`${SHOP_REPORTS_API_URL}${shopId}/overview/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch shop overview.");
  }
};

export const getShopSalesAnalytics = async (shopId: number) => {
  try {
    const response = await api.get(`${SHOP_REPORTS_API_URL}${shopId}/sales_analytics/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch sales analytics.");
  }
};

export const getShopInventoryAnalytics = async (shopId: number) => {
  try {
    const response = await api.get(`${SHOP_REPORTS_API_URL}${shopId}/inventory_analytics/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch inventory analytics.");
  }
};

export const getShopSalespersonAnalytics = async (shopId: number) => {
  try {
    const response = await api.get(`${SHOP_REPORTS_API_URL}${shopId}/salesperson_analytics/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch salesperson analytics.");
  }
};

export const getShopFinancialSummary = async (shopId: number) => {
  try {
    const response = await api.get(`${SHOP_REPORTS_API_URL}${shopId}/financial_summary/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch financial summary.");
  }
};

export const getShopProductPerformance = async (shopId: number, days: number = 30) => {
  try {
    const response = await api.get(`${SHOP_REPORTS_API_URL}${shopId}/product_performance/?days=${days}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch product performance.");
  }
};

export const getShopAlertsDetail = async (shopId: number) => {
  try {
    const response = await api.get(`${SHOP_REPORTS_API_URL}${shopId}/alerts_detail/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch alerts detail.");
  }
};

// Comprehensive Shop Report - Single API call for all data
export const getCompleteShopReport = async (shopId: number, days: number = 30) => {
  try {
    const [
      overview,
      salesAnalytics,
      inventoryAnalytics,
      salespersonAnalytics,
      financialSummary,
      productPerformance,
      alertsDetail
    ] = await Promise.all([
      getShopOverview(shopId),
      getShopSalesAnalytics(shopId),
      getShopInventoryAnalytics(shopId),
      getShopSalespersonAnalytics(shopId),
      getShopFinancialSummary(shopId),
      getShopProductPerformance(shopId, days),
      getShopAlertsDetail(shopId)
    ]);

    return {
      shop_id: shopId,
      overview,
      sales_analytics: salesAnalytics,
      inventory_analytics: inventoryAnalytics,
      salesperson_analytics: salespersonAnalytics,
      financial_summary: financialSummary,
      product_performance: productPerformance,
      alerts_detail: alertsDetail,
      report_generated_at: new Date().toISOString()
    };
  } catch (error) {
    throw new Error("Failed to fetch complete shop report.");
  }
};