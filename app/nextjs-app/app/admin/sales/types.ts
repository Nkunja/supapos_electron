export interface SalesSummary {
  period_days: number;
  overall_summary: {
    total_sales: number;
    total_invoices: number;
    total_items_sold: number;
    average_invoice_value: number;
  };
  shop_summaries: Array<{
    shop__name: string;
    total_sales: number;
    total_invoices: number;
    total_items: number;
  }>;
}

export interface InvoiceItem {
  id: string;
  inventory: number;
  product_name: string;
  product_form: string;
  quantity: number;
  unit_price: string;
  total_price: string;
  available_stock: number;
}

export interface Invoice {
  customer: any;
  id: string;
  invoice_number: string;
  shop: number;
  shop_name: string;
  created_by: number;
  created_by_name: string;
  customer_name: string;
  customer_phone: string;
  payment_method: string;
  payment_method_display: string;
  status: string;
  status_display: string;
  subtotal: string;
  tax_amount: string;
  discount_amount: string;
  total_amount: string;
  amount_paid: string;
  change_amount: string;
  notes: string;
  items: InvoiceItem[];
  created_at: string;
  updated_at: string;
}

export interface InvoicesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Invoice[];
}

export type PeriodFilter = 'day' | 'week' | 'month' | '6months' | '1' | '7' | '30' | '45' | '90' | 'custom';

// Update your FilterOptions interface
export interface FilterOptions {
  period: PeriodFilter;
  status?: string;
  payment_method?: string;
  search?: string;
  date_from?: string;  // Add this
  date_to?: string;     // Add this
}