export interface Inventory {
  id: number;
  product: number;
  product_name: string;
  product_generic_name?: string;
  shop: number;
  shop_name: string;
  added_by?: number;
  added_by_username?: string;
  barcode?: string;
  supplier?: string;
  user_type: "adults" | "children" | "both";
  user_type_display?: string;
  drug_type: "prescription" | "otc" | "controlled";
  drug_type_display?: string;
  form:
    | "tablet"
    | "capsule"
    | "syrup"
    | "injection"
    | "cream"
    | "drops"
    | "inhaler"
    | "other";
  form_display?: string;
  pieces_per_unit: number;
  unit_of_measurement:
    | "pieces"
    | "ml"
    | "mg"
    | "g"
    | "tablets"
    | "capsules"
    | "vials"
    | "bottles"
    | "other";
  unit_of_measurement_display?: string;
  total_units: number;
  total_pieces?: number;
  partial_pieces?: number;
  product_description?: string;
  batch_number: string;
  expiry_date?: string;
  purchase_date?: string;
  purchase_order?: number;
  purchase_order_name?: string;
  cost_price_per_piece: number;
  selling_price_per_piece: number;
  reorder_level: number;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  quantity_received: number;
  quantity_remaining: number;
  quantity_sold?: number;
}

export interface InventoryFormData {
  purchase_order: number | null;
  product: number;
  shop: number;
  batch_number: string;
  barcode: string;
  expiry_date: string;
  purchase_date: string;
  user_type: string;
  drug_type: string;
  form: string;
  pieces_per_unit: number;
  unit_of_measurement: string;
  total_units: number;
  product_description: string;
  buying_price_per_unit: number;
  cost_price_per_piece: number;
  selling_price_per_piece: number;
  reorder_level: number;
  is_active: boolean;
}

export interface InventoryCreateRequest {
  purchase_order?: number;
  product: number;
  shop: number;
  barcode?: string;
  user_type: "adults" | "children" | "both";
  drug_type: "prescription" | "otc" | "controlled";
  form:
    | "tablet"
    | "capsule"
    | "syrup"
    | "injection"
    | "cream"
    | "drops"
    | "inhaler"
    | "other";
  pieces_per_unit: number;
  unit_of_measurement:
    | "pieces"
    | "ml"
    | "mg"
    | "g"
    | "tablets"
    | "capsules"
    | "vials"
    | "bottles"
    | "other";
  total_units: number;
  partial_pieces?: number;
  product_description?: string;
  batch_number: string;
  expiry_date?: string;
  purchase_date?: string;
  cost_price_per_piece: number;
  selling_price_per_piece: number;
  reorder_level: number;
  is_active?: boolean;
}

export interface InventoryUpdateRequest
  extends Partial<InventoryCreateRequest> {
  id: number;
}

export interface InventoryResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Inventory[];
}

export interface InventoryFilters {
  search?: string;
  shop?: number;
  product?: number;
  page?: number;
  page_size?: number;
}

export interface Product {
  id: number;
  name: string;
  generic_name?: string;
  description?: string;
  supplier?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Shop {
  id: number;
  name: string;
  address?: string;
  po_box?: string;
  phone_number?: string;
  tel_number?: string;
  kra_pin?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  salesperson_names?: string;
}

export interface ChoiceOption {
  value: string;
  label: string;
}

// Add missing types
export interface SaleData {
  quantity: number;
  custom_price?: number; // Optional, to support custom pricing in ShoppingCart
}

export interface SaleResponse {
  id: number;
  inventory_id: number;
  quantity: number;
  total_price: number;
  custom_price?: number;
  sale_date: string;
  created_at: string;
  updated_at: string;
}

export interface StockSummary {
  total_inventory_items: number;
  in_stock: number;
  low_stock: number;
  out_of_stock: number;
  percentages: {
    in_stock: number;
    low_stock: number;
    out_of_stock: number;
  };
}
