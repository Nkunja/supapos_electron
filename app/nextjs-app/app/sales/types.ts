// export interface Product {
//   id: number;
//   product: number;
//   product_name: string;
//   product_form: string;
//   product_description: string;
//   shop: number;
//   shop_name: string;
//   batch_number: string;
//   expiry_date: string | null;
//   cost_price: string;
//   selling_price_per_piece: string;
//   packs_in_stock: number;
//   pack_reorder_level: number;
//   units_in_stock: number;
//   unit_reorder_level: number;
//   total_units: number;
//   pieces_per_unit: number;
//   total_pieces: number;
//   is_low_stock: boolean;
//   stock_status: string;
//   expiry_status: string;
//   profit_margin: number;
//   days_to_expiry: number | null;
//   created_at: string;
//   updated_at: string;
//   partial_pieces?: number | undefined;
// }

// // export interface CartItem extends Product {
// //   quantity: number;
// //   total: number;
// // }

// export interface CartItem extends Product {
//   quantity: number;
//   total: number;
//   partial_pieces?: number | undefined; 
//   custom_price?: number; // Add this field for dynamic pricing
//   is_price_edited?: boolean; // Flag to track if price was modified
// }

// export interface SalesStats {
//   shop: {
//     id: number;
//     name: string;
//   };
//   period_days: number;
//   summary: {
//     total_sales: number;
//     total_invoices: number;
//     total_items_sold: number;
//     average_invoice_value: number;
//   };
//   top_products: Array<{
//     inventory__product__name: string;
//     total_quantity: number;
//     total_revenue: number;
//   }>;
// }

// export interface CustomerDetails {
//   customer_name: string;
//   customer_phone: string;
// }

// export interface InvoiceData {
//   shop: number;
//   customer_name: string;
//   customer_phone: string;
//   payment_method: 'cash' | 'mpesa' | 'bank';
//   status: string;
//   subtotal: string;
//   tax_amount: string;
//   discount_amount: string;
//   total_amount: string;
//   amount_paid: string;
//   change_amount: string;
//   notes: string;
//   items: Array<{
//     inventory: number;
//     quantity: number;
//     unit_price: string;
//   }>;
// }


// export interface InvoiceItem {
//   id: string;
//   inventory: number;
//   product_name: string;
//   product_form: string;
//   quantity: number;
//   unit_price: string;
//   total_price: string;
//   available_stock: number;
// }

// // export interface Invoice {
// //   id: string;
// //   invoice_number: string;
// //   shop: number;
// //   shop_name: string;
// //   shop_po_box?: string;
// //   shop_address?: string;
// //   shop_phone_number?: string;
// //   shop_tel_number?: string;
// //   shop_kra_pin?: string;
// //   created_by: number;
// //   created_by_name: string;
// //   customer_name: string;
// //   customer_phone: string;
// //   payment_method: string;
// //   payment_method_display: string;
// //   status: string;
// //   status_display: string;
// //   subtotal: string;
// //   tax_amount: string;
// //   discount_amount: string;
// //   total_amount: string;
// //   amount_paid: string;
// //   change_amount: string;
// //   notes: string;
// //   items: InvoiceItem[];
// //   created_at: string;
// //   updated_at: string;
// // }


// export interface Invoice {
//   id: string;
//   invoice_number: string;
//   shop: number;
//   shop_name: string;
//   created_by: number;
//   created_by_name: string;
//   customer_name: string;
//   customer_phone: string;
//   payment_method: 'cash' | 'mpesa' | 'bank';
//   payment_method_display: string;
//   status: 'pending' | 'completed' | 'cancelled';
//   status_display: string;
//   subtotal: string;
//   tax_amount: string;
//   discount_amount: string;
//   total_amount: string;
//   amount_paid: string;
//   change_amount: string;
//   notes: string;
//   items: InvoiceItem[];
//   shop_kra_pin: string;
//   shop_address: string;
//   shop_phone_number: string;
//   shop_tel_number: string;
//   shop_po_box: string;
//   created_at: string;
//   updated_at: string;
//   credit_note?: CreditNote; // Optional, if API returns it
// }

// export interface InvoiceItem {
//   id: string;
//   inventory: number;
//   product_name: string;
//   quantity: number;
//   unit_price: string;
//   total_price: string;
//   available_stock: number;
// }

// export interface CreditNote {
//   id: string;
//   credit_note_number: string;
//   invoice: string;
//   original_invoice_number: string;
//   shop: number;
//   shop_name: string;
//   created_by: number;
//   created_by_name: string;
//   customer_name: string;
//   customer_phone: string;
//   subtotal: string;
//   tax_amount: string;
//   discount_amount: string;
//   total_amount: string;
//   notes: string;
//   items: CreditNoteItem[];
//   created_at: string;
//   updated_at: string;
// }

// export interface CreditNoteItem {
//   id: string;
//   inventory: number;
//   product_name: string;
//   quantity: number;
//   unit_price: string;
//   total_price: string;
//   available_stock: number;
// }

// export interface User {
//   first_name?: string;
//   last_name?: string;
//   full_name?: string;
//   role?: string;
//   assigned_shop?: {
//     id: number;
//     name: string;
//   };
// } 




import { Inventory } from "@/types/inventory/inventory";

export interface CartItem extends Inventory {
  quantity: number;
  line_total: number;
  custom_price?: number; 
  is_price_edited?: boolean; 
}

export interface SalesStats {
  shop: {
    id: number;
    name: string;
  };
  period_days: number;
  summary: {
    total_sales: number;
    total_invoices: number;
    total_items_sold: number;
    average_invoice_value: number;
  };
  top_products: Array<{
    inventory__product__name: string;
    total_quantity: number;
    total_revenue: number;
  }>;
}

export interface CustomerDetails {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
}

export interface InvoiceData {
  shop: number;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  payment_method: 'cash' | 'mpesa' | 'bank' | 'card' | 'mobile'; 
  status: 'pending' | 'completed' | 'cancelled';
  subtotal: string;
  tax_amount: string;
  discount_amount: string;
  discount_type?: 'percentage' | 'fixed';
  total_amount: string;
  amount_paid: string;
  change_amount: string;
  notes?: string;
  items: Array<{
    inventory: number;
    quantity: number;
    unit_price: string;
    line_total: string; 
    custom_price?: number; 
  }>;
}

export interface InvoiceItem {
  id: string;
  inventory: number;
  product_name: string;
  product_generic_name?: string; 
  product_form: string;
  batch_number?: string; 
  quantity: number;
  unit_price: string;
  total_price: string;
  available_stock: number;
  expiry_date?: string; 
  purchase_order_name?: string; 
}

export interface Invoice {
  id: string;
  invoice_number: string;
  shop: number;
  shop_name: string;
  created_by: number;
  created_by_name: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  payment_method: 'cash' | 'mpesa' | 'bank' | 'card' | 'mobile';
  payment_method_display: string;
  status: 'pending' | 'completed' | 'cancelled';
  status_display: string;
  subtotal: string;
  tax_amount: string;
  discount_amount: string;
  discount_type?: 'percentage' | 'fixed';
  total_amount: string;
  amount_paid: string;
  change_amount: string;
  notes?: string;
  items: InvoiceItem[];
  shop_kra_pin?: string;
  shop_address?: string;
  shop_phone_number?: string;
  shop_tel_number?: string;
  shop_po_box?: string;
  created_at: string;
  updated_at: string;
  credit_note?: CreditNote;
}
export interface CreditNote {
  id: string;
  credit_note_number: string;
  invoice: string;
  original_invoice_number: string;
  shop: number;
  shop_name: string;
  created_by: number;
  created_by_name: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  subtotal: string;
  tax_amount: string;
  discount_amount: string;
  total_amount: string;
  notes?: string;
  items: CreditNoteItem[];
  created_at: string;
  updated_at: string;
}

export interface CreditNoteItem {
  id: string;
  inventory: number;
  product_name: string;
  product_generic_name?: string;
  batch_number?: string;
  quantity: number;
  unit_price: string;
  total_price: string;
  available_stock: number;
}

export interface User {
  first_name?: string;
  last_name?: string;
  full_name?: string;
  role?: string;
  assigned_shop?: {
    id: number;
    name: string;
  };
}

export interface POSPaymentData {
  payment_method: 'cash' | 'card' | 'mobile';
  amount_received: number;
  change_given: number;
  discount_amount: number;
  discount_type: 'percentage' | 'fixed';
  total_amount: number;
  customer?: CustomerDetails;
  terminal_id?: string;
  transaction_id?: string;
}

export interface POSTransaction {
  id: string;
  transaction_number: string;
  timestamp: string;
  terminal_id: string;
  cashier: {
    id: number;
    name: string;
  };
  customer?: CustomerDetails;
  items: CartItem[];
  payment: POSPaymentData;
  totals: {
    subtotal: number;
    discount: number;
    tax: number;
    total: number;
  };
  status: 'completed' | 'voided' | 'refunded';
}

export interface StockValidation {
  inventory_id: number;
  requested_quantity: number;
  available_stock: number;
  is_valid: boolean;
  message?: string;
}

export interface PriceOverride {
  inventory_id: number;
  original_price: number;
  new_price: number;
  reason?: string;
  authorized_by?: number;
}

export interface CartOperations {
  addItem: (inventory: Inventory, quantity?: number) => void;
  removeItem: (inventory_id: number) => void;
  updateQuantity: (inventory_id: number, quantity: number) => void;
  updatePrice: (inventory_id: number, price: number) => void;
  clearCart: () => void;
  validateStock: () => StockValidation[];
}


export interface POSSession {
  id: string;
  terminal_id: string;
  cashier: User;
  shift_start: string;
  shift_end?: string;
  opening_cash: number;
  closing_cash?: number;
  transactions: POSTransaction[];
  status: 'active' | 'closed';
}