// utilities.ts
// import { Inventory, Shop } from "../inventory.ts";
import { Inventory, Shop } from "../inventory/inventory";


// Utility type choices (matching Django model)
export type UtilityType = 
  | 'airtime'
  | 'internet'
  | 'transport'
  | 'fuel'
  | 'stationery'
  | 'marketing'
  | 'entertainment'
  | 'meals'
  | 'accommodation'
  | 'maintenance'
  | 'electricity'
  | 'water'
  | 'rent'
  | 'insurance'
  | 'licenses'
  | 'software'
  | 'equipment'
  | 'repairs'
  | 'consultation'
  | 'training'
  | 'inventory_usage'
  | 'other';

export type SourceType = 
  | 'cash'
  | 'inventory'
  | 'external'
  | 'company';

export interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
}

export interface Utility {
  id: number;
  title: string;
  utility_type: UtilityType;
  utility_type_display?: string;
  source_type: SourceType;
  source_type_display?: string;
  description?: string;
  amount: number;
  
  // Inventory integration fields
  inventory_item?: number;
  inventory_item_details?: InventoryItemSummary;
  quantity_used: number;
  unit_cost?: number;
  total_cost?: number;
  
  // People and location
  user: number;
  user_details?: User;
  user_name?: string;
  shop?: number;
  shop_details?: Shop;
  shop_name?: string;
  
  // Documentation
  Extra_Confirmation?: string;
  purpose?: string;
  notes?: string;
  
  // Tracking fields
  inventory_deducted: boolean;
  original_stock_before?: number;
  is_inventory_based?: boolean;
  
  // Timestamps
  expense_date: string;
  created_at: string;
  updated_at: string;
}

// Lightweight inventory summary for utility responses
export interface InventoryItemSummary {
  id: number;
  product_name: string;
  product_description?: string;
  available_stock: number;
  unit_cost: number;
  batch_number: string;
  expiry_date?: string;
  unit_of_measurement: string;
}

// Available inventory items for utilities
export interface AvailableInventoryItem extends InventoryItemSummary {
  pieces_per_unit: number;
  is_low_stock: boolean;
  days_to_expiry?: number;
  reorder_level: number;
}

// Utility creation request
export interface UtilityCreateRequest {
  title: string;
  utility_type?: UtilityType;
  source_type: SourceType;
  description?: string;
  amount?: number;
  
  // Inventory fields
  inventory_item?: number;
  quantity_used?: number;
  
  // Location and context
  shop?: number;
  Extra_Confirmation?: string;
  purpose?: string;
  notes?: string;
  expense_date?: string;
}
export interface UtilityUpdateRequest {
  id: number;
  title?: string;
  description?: string;
  purpose?: string;
  notes?: string;
  Extra_Confirmation?: string;
}

// Utility form data (for forms)
export interface UtilityFormData {
  title: string;
  utility_type: UtilityType;
  source_type: SourceType;
  description: string;
  amount: number;
  inventory_item: number | null;
  quantity_used: number;
  shop: number | null;
  Extra_Confirmation: string;
  purpose: string;
  notes: string;
  expense_date: string;
}

export interface UtilityResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Utility[];
}

export interface InventoryUsageLog {
  id: number;
  utility: number;
  inventory_item: number;
  quantity_deducted: number;
  stock_before: number;
  stock_after: number;
  deducted_by: number;
  deducted_by_name?: string;
  inventory_name?: string;
  notes?: string;
  created_at: string;
}
export interface UtilityStats {
  total_utilities: number;
  total_amount_spent: number;
  total_inventory_value_used: number;
  total_cash_spent: number;  
  most_used_utility_type?: string;
  most_used_inventory_item?: string;
  utilities_by_type: Record<UtilityType, number>;
  monthly_spending: Record<string, number>;
  start_date?: string;
  end_date?: string;
  user_id?: number;
  shop_id?: number;
}
export interface UtilityFilters {
  search?: string;
  utility_type?: UtilityType;
  source_type?: SourceType;
  user?: number;
  shop?: number;
  inventory_item?: number;
  inventory_deducted?: boolean;
  start_date?: string;
  end_date?: string;
  min_amount?: number;
  max_amount?: number;
  inventory_only?: boolean;
  my_utilities?: boolean;
  page?: number;
  page_size?: number;
  ordering?: string;
}

export interface BulkUtilityCreateRequest {
  utilities: UtilityCreateRequest[];
}

export interface BulkUtilityCreateResponse {
  success: string;
  utilities: Utility[];
  count: number;
}

export interface UtilityTypeOption {
  value: UtilityType;
  label: string;
}

export interface SourceTypeOption {
  value: SourceType;
  label: string;
}

export const UTILITY_TYPE_CHOICES: UtilityTypeOption[] = [
  { value: 'airtime', label: 'Airtime/Phone Credit' },
  { value: 'internet', label: 'Internet Data/Bundles' },
  { value: 'transport', label: 'Transport/Travel' },
  { value: 'fuel', label: 'Fuel' },
  { value: 'stationery', label: 'Stationery/Office Supplies' },
  { value: 'marketing', label: 'Marketing Materials' },
  { value: 'entertainment', label: 'Client Entertainment' },
  { value: 'meals', label: 'Meals/Food' },
  { value: 'accommodation', label: 'Accommodation' },
  { value: 'maintenance', label: 'Equipment Maintenance' },
  { value: 'electricity', label: 'Electricity/Power' },
  { value: 'water', label: 'Water' },
  { value: 'rent', label: 'Rent/Facility' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'licenses', label: 'Licenses/Permits' },
  { value: 'software', label: 'Software/Subscriptions' },
  { value: 'equipment', label: 'Equipment Purchase' },
  { value: 'repairs', label: 'Repairs/Fixing' },
  { value: 'consultation', label: 'Consultation/Professional Services' },
  { value: 'training', label: 'Training/Development' },
  { value: 'inventory_usage', label: 'Inventory Item Usage' },
  { value: 'other', label: 'Other Utilities' },
];

export const SOURCE_TYPE_CHOICES: SourceTypeOption[] = [
  { value: 'cash', label: 'Cash From Shop' },
  { value: 'inventory', label: 'From Inventory Stock' },
  { value: 'external', label: 'External Provider' },
  { value: 'company', label: 'Company Provided' },
];

export interface UtilityCreateResponse extends Utility {}

export interface UtilityUpdateResponse extends Utility {}

export interface UtilityDeleteResponse {
  success?: string;
  error?: string;
}

export interface RestoreInventoryResponse {
  success?: string;
  error?: string;
  restored_quantity?: number;
  inventory_item?: string;
}

export interface AvailableInventoryResponse {
  items: AvailableInventoryItem[];
  data: AvailableInventoryItem[];
  results: AvailableInventoryItem[];
  count: number;
}

export interface LowStockAlertsResponse {
  message: string;
  items: AvailableInventoryItem[];
  count: number;
}
export interface UtilityFormErrors {
  title?: string[];
  utility_type?: string[];
  source_type?: string[];
  description?: string[];
  amount?: string[];
  inventory_item?: string[];
  quantity_used?: string[];
  shop?: string[];
  expense_date?: string[];
  non_field_errors?: string[];
}


export interface UtilitySummary {
  id: number;
  title: string;
  utility_type: UtilityType;
  utility_type_display: string;
  amount: number;
  is_inventory_based: boolean;
  inventory_product_name?: string;
  quantity_used?: number;
  user_name: string;
  shop_name?: string;
  expense_date: string;
}

export interface UtilityDashboardMetrics {
  today_utilities: number;
  today_spending: number;
  week_utilities: number;
  week_spending: number;
  month_utilities: number;
  month_spending: number;
  inventory_utilities_count: number;
  cash_utilities_count: number;
  most_used_type: string;
  recent_utilities: UtilitySummary[];
}
export interface UtilitySearchSuggestion {
  id: number;
  title: string;
  utility_type: UtilityType;
  utility_type_display: string;
  amount: number;
  expense_date: string;
}

export interface InventorySearchSuggestion {
  id: number;
  product_name: string;
  available_stock: number;
  unit_cost: number;
  batch_number: string;
  expiry_date?: string;
}
export interface UtilityTrend {
  period: string; 
  total_utilities: number;
  total_spending: number;
  inventory_usage_count: number;
  cash_spending: number;
}

export interface UtilityTrendAnalysis {
  trends: UtilityTrend[];
  period_type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  total_change_percentage: number;
  spending_change_percentage: number;
}

export interface UtilityExportRequest {
  format: 'csv' | 'excel' | 'pdf';
  filters?: UtilityFilters;
  include_inventory_details?: boolean;
  include_user_details?: boolean;
}

export interface UtilityReportData {
  utilities: Utility[];
  summary: UtilityStats;
  export_date: string;
  filters_applied: UtilityFilters;
}

// Utility templates for common expenses
export interface UtilityTemplate {
  id: string;
  name: string;
  title: string;
  utility_type: UtilityType;
  source_type: SourceType;
  default_amount?: number;
  description?: string;
  purpose?: string;
  is_popular?: boolean;
}

export const isInventoryBasedUtility = (utility: Utility): boolean => {
  return utility.source_type === 'inventory' && !!utility.inventory_item;
};

export const isCashBasedUtility = (utility: Utility): boolean => {
  return utility.source_type === 'cash';
};

export interface UtilityHelpers {
  formatAmount: (amount: number, currency?: string) => string;
  getUtilityTypeLabel: (type: UtilityType) => string;
  getSourceTypeLabel: (type: SourceType) => string;
  calculateTotalCost: (utility: Utility) => number;
  isExpiringSoon: (expiryDate: string, days?: number) => boolean;
  getDaysToExpiry: (expiryDate: string) => number;
  formatExpenseDate: (date: string) => string;
  getUtilityStatusColor: (utility: Utility) => string;
}
export interface PaginationParams {
  page?: number;
  page_size?: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface UtilityApiEndpoints {
  list: string;
  create: string;
  retrieve: (id: number) => string;
  update: (id: number) => string;
  delete: (id: number) => string;
  availableInventory: string;
  statistics: string;
  myUtilities: string;
  lowStockAlerts: string;
  bulkCreate: string;
  restoreInventory: (id: number) => string;
  usageLogs: string;
}