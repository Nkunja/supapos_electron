export interface ShopInfo {
  id: number;
  name: string;
  address: string;
  phone_number: string;
  is_active: boolean;
  salespersons_count: number;
  salesperson_names: string;
  active_salespersons_count: number;
}

// Inventory Types
export interface InventorySummary {
  total_products: number;
  total_stock_value: number;
  total_cost_value: number;
  potential_profit: number;
  low_stock_items: number;
  expired_items: number;
  near_expiry_items: number;
  out_of_stock_items: number;
  healthy_stock_items: number;
}

export interface InventoryItem {
  id: number;
  product_name: string;
  units_available: number;
  packs_in_stock: number;
  units_in_stock: number;
  expiry_date: string | null;
  days_to_expiry: number | null;
  stock_value: number;
  cost_value: number;
}

export interface StockAnalysis {
  total_items: number;
  low_stock: InventoryItem[];
  expired: InventoryItem[];
  near_expiry: InventoryItem[];
  out_of_stock: InventoryItem[];
  healthy_stock: InventoryItem[];
}

export interface CategoryBreakdown {
  product__category__name: string;
  total_products: number;
  total_value: number;
}

export interface InventoryAnalytics {
  stock_analysis: StockAnalysis;
  category_breakdown: CategoryBreakdown[];
  total_inventory_value: number;
}

// Sales Types
export interface SalesPeriod {
  sales: number;
  transactions: number;
  items_sold: number;
}

export interface SalesSummary {
  today: SalesPeriod;
  this_week: SalesPeriod;
  this_month: SalesPeriod;
}

export interface DailySales {
  date: string;
  sales: number;
  transactions: number;
}

export interface SalespersonPerformance {
  created_by__first_name: string;
  created_by__last_name: string;
  created_by__email: string;
  total_sales: number;
  transactions: number;
  avg_transaction: number;
}

export interface TopProduct {
  product_name: string;
  quantity_sold: number;
  revenue: number;
}

export interface SalesAnalytics {
  daily_sales: DailySales[];
  salesperson_performance: SalespersonPerformance[];
  top_products: TopProduct[];
  period: string;
}

// Financial Types - Enhanced
export interface FinancialPeriod {
  revenue: number;
  transactions: number;
  avg_transaction: number;
  discounts_given: number;
  tax_collected: number;
}

export interface InventoryValuation {
  total_cost_value: number;
  total_selling_value: number;
  potential_profit_margin: number;
}

export interface PaymentMethodBreakdown {
  payment_method: string;
  count: number;
  total_amount: number;
}

export interface DailyTrend {
  date: string;
  day_name: string;
  revenue: number;
  transactions: number;
  avg_transaction: number;
  discounts_given: number;
  tax_collected: number;
}

export interface WeeklyTrend {
  week_start: string;
  week_end: string;
  week_label: string;
  revenue: number;
  transactions: number;
  avg_transaction: number;
  discounts_given: number;
  tax_collected: number;
}

export interface MonthlyTrend {
  month_start: string;
  month_end: string;
  month_label: string;
  month_short: string;
  revenue: number;
  transactions: number;
  avg_transaction: number;
  discounts_given: number;
  tax_collected: number;
}

export interface PaymentMethodTrend {
  date: string;
  revenue: number;
  transactions: number;
}

export interface PaymentTrends {
  cash: PaymentMethodTrend[];
  mpesa: PaymentMethodTrend[];
  bank: PaymentMethodTrend[];
}

export interface GrowthMetrics {
  monthly_growth_rate: number;
  weekly_growth_rate: number;
  estimated_monthly_profit: number;
  profit_margin_estimate: number;
}

export interface BestDay {
  created_at__date: string;
  daily_revenue: number;
}

export interface KPIs {
  total_customers_this_month: number;
  avg_daily_revenue: number;
  best_day_this_month: BestDay | null;
}

// Basic Financial Summary (for backward compatibility)
export interface FinancialSummary {
  shop_name: string;
  financial_periods: {
    today: FinancialPeriod;
    this_week: FinancialPeriod;
    this_month: FinancialPeriod;
    last_week: FinancialPeriod;
    last_month: FinancialPeriod;
  };
  inventory_valuation: InventoryValuation;
  payment_methods: PaymentMethodBreakdown[];
}

// Enhanced Financial Summary (with charts and trends)
export interface EnhancedFinancialSummary {
  shop_name: string;
  financial_periods: {
    today: FinancialPeriod;
    this_week: FinancialPeriod;
    this_month: FinancialPeriod;
    last_week: FinancialPeriod;
    last_month: FinancialPeriod;
  };
  inventory_valuation: InventoryValuation;
  payment_methods: PaymentMethodBreakdown[];
  daily_trends: DailyTrend[];
  weekly_trends: WeeklyTrend[];
  monthly_trends: MonthlyTrend[];
  payment_trends: PaymentTrends;
  growth_metrics: GrowthMetrics;
  kpis: KPIs;
}

// Product Performance Types
export interface TopSellingProduct {
  inventory__product__name: string;
  inventory__product__generic_name: string;
  inventory__product__category__name: string;
  quantity_sold: number;
  revenue: number;
  transactions: number;
}

export interface SlowMovingProduct {
  name: string;
  generic_name: string;
  category__name: string;
}

export interface CategoryPerformance {
  inventory__product__category__name: string;
  quantity_sold: number;
  revenue: number;
}

export interface ProductPerformance {
  shop_name: string;
  period_days: number;
  top_selling_products: TopSellingProduct[];
  slow_moving_products: SlowMovingProduct[];

}

// Product Summary Types
export interface ProductSummary {
  total_products: number;
  active_products: number;
  inactive_products: number;
  by_drug_type: {
    [key: string]: number;
  };
  by_user_type: {
    [key: string]: number;
  };
}

// Staff/Salesperson Types
export interface SalespersonInfo {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
}

export interface SalespersonSalesPerformance {
  today: SalesPeriod;
  this_week: SalesPeriod;
  this_month: SalesPeriod & { avg_transaction: number };
}

export interface RecentActivity {
  invoice_number: string;
  total_amount: number;
  created_at: string;
  customer_name: string;
}

export interface SalespersonAnalytic {
  salesperson: SalespersonInfo;
  performance: SalespersonSalesPerformance;
  recent_activity: RecentActivity[];
}

export interface SalespersonAnalytics {
  shop_name: string;
  salesperson_analytics: SalespersonAnalytic[];
  period_analyzed: {
    today: string;
    week_start: string;
    month_start: string;
  };
}

// Alerts Types
export interface AlertsSummary {
  total_alerts: number;
  unresolved_alerts: number;
  by_type: {
    [key: string]: number;
  };
}

export interface AlertProduct {
  name: string;
  generic_name: string;
  category: string | null;
}

export interface AlertInventory {
  units_available: number;
  expiry_date: string | null;
  days_to_expiry: number | null;
  batch_number: string;
}

export interface AlertDetail {
  id: number;
  alert_type: string;
  message: string;
  product: AlertProduct;
  inventory: AlertInventory;
  created_at: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

export interface AlertsSummaryDetail {
  total_alerts: number;
  critical_alerts: number;
  high_alerts: number;
  medium_alerts: number;
}

export interface AlertsDetail {
  shop_name: string;
  alerts: AlertDetail[];
  summary: AlertsSummaryDetail;
}

// Overview Types
export interface ShopOverview {
  shop: ShopInfo;
  inventory: InventorySummary;
  sales: SalesSummary;
  products: ProductSummary;
  alerts: AlertsSummary;
  last_updated: string;
}

// Complete Shop Report Types
export interface CompleteShopReport {
  shop_id: number;
  overview: ShopOverview;
  sales_analytics: SalesAnalytics;
  inventory_analytics: InventoryAnalytics;
  salesperson_analytics: SalespersonAnalytics;
  financial_summary: FinancialSummary; // Basic version
  product_performance: ProductPerformance;
  alerts_detail: AlertsDetail;
  report_generated_at: string;
}


export interface EnhancedCompleteShopReport {
  shop_id: number;
  overview: ShopOverview;
  sales_analytics: SalesAnalytics;
  inventory_analytics: InventoryAnalytics;
  salesperson_analytics: SalespersonAnalytics;
  financial_summary: EnhancedFinancialSummary; 
  product_performance: ProductPerformance;
  alerts_detail: AlertsDetail;
  report_generated_at: string;
}

export type ShopReportType = CompleteShopReport | EnhancedCompleteShopReport;