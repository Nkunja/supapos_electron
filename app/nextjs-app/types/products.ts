export interface Product {
  id: number;
  name: string;
  generic_name: string;
  shop: number;
  shop_name: string; 
  barcode: string;
  batch_number: string;
  description: string;
  manufacturer: string;
  user_type: "adults" | "children" | "both";
  user_type_display: string; 
  drug_type: "prescription" | "otc" | "controlled";
  drug_type_display: string; 
  form: string;
  form_display: string; 
  unit_of_measurement: string;
  unit_display: string; 
  pieces_per_unit: number;
  total_units: number;
  pack_description: string;
  buying_price_per_unit: string; // Decimal field as string
  selling_price_per_piece: string; // Decimal field as string
  is_active: boolean;
  full_description: string; 
  requires_prescription: boolean; 
  created_at: string;
  updated_at: string;
}

// Form data interface for React form state
export interface ProductFormData {
  name: string;
  generic_name: string;
  shop: number;
  barcode: string;
  batch_number: string;
  description: string;
  manufacturer: string;
  user_type: "adults" | "children" | "both";
  drug_type: "prescription" | "otc" | "controlled";
  form: string;
  unit_of_measurement: string;
  pieces_per_unit: number;
  total_units: number;
  pack_description: string;
  buying_price_per_unit: number; 
  selling_price_per_piece: number; 
  is_active: boolean;
  // Inventory fields for initial inventory creation
  cost_price_per_piece?: number;
  total_pieces?: number;
  reorder_level?: number;
  expiry_date?: string;
}

// Data structure for API calls (create/update)
export interface CreateProductData {
  name: string;
  generic_name: string;
  shop: number;
  barcode: string;
  batch_number: string;
  description: string;
  manufacturer: string;
  user_type: "adults" | "children" | "both";
  drug_type: "prescription" | "otc" | "controlled";
  form: string;
  unit_of_measurement: string;
  pieces_per_unit: number;
  total_units: number;
  pack_description: string;
  buying_price_per_unit: string; 
  selling_price_per_piece: string; 
  is_active: boolean;
  // Optional inventory fields for initial inventory
  cost_price_per_piece?: string;
  total_pieces?: number;
  reorder_level?: number;
  expiry_date?: string;
}

// Update data interface (same as create for now)
export interface UpdateProductData extends CreateProductData {}

// Shop interface
export interface Shop {
  id: number;
  name: string;
  location?: string;
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// Choice options for dropdowns
export interface ChoiceOption {
  value: string;
  label: string;
}

// API response types
export interface ProductListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

export interface ProductDetailResponse extends Product {}

// Form validation errors
export interface ProductFormErrors {
  name?: string[];
  generic_name?: string[];
  shop?: string[];
  barcode?: string[];
  batch_number?: string[];
  description?: string[];
  manufacturer?: string[];
  user_type?: string[];
  drug_type?: string[];
  form?: string[];
  unit_of_measurement?: string[];
  pieces_per_unit?: string[];
  total_units?: string[];
  pack_description?: string[];
  buying_price_per_unit?: string[];
  selling_price_per_piece?: string[];
  non_field_errors?: string[];
}

// Inventory types for when working with inventory separately
export interface Inventory {
  id: number;
  product: number;
  product_name: string;
  product_form: string;
  product_description: string;
  shop: number;
  shop_name: string;
  batch_number: string;
  expiry_date: string | null;
  cost_price_per_piece: string;
  selling_price_per_piece: string;
  unit_of_measurement: string;
  unit_display: string;
  pieces_per_unit: number;
  total_units: number;
  pack_description: string;
  total_pieces: number;
  reorder_level: number;
  is_low_stock: boolean;
  is_expired: boolean;
  days_to_expiry: number | null;
  profit_per_piece: number;
  profit_margin_percentage: number;
  total_cost_value: number;
  total_selling_value: number;
  total_profit_potential: number;
  stock_status: "Out of Stock" | "Low Stock" | "In Stock";
  expiry_status: "No Expiry Set" | "Expired" | "Near Expiry" | "Fresh";
  profit_margin: number;
  created_at: string;
  updated_at: string;
}

// Filter and search parameters
export interface ProductFilters {
  shop_id?: number;
  user_type?: string;
  drug_type?: string;
  requires_prescription?: boolean;
  is_active?: boolean;
  search?: string;
  page?: number;
  page_size?: number;
}

// API error response
export interface ApiError {
  detail?: string;
  error?: string;
  [key: string]: any;
}