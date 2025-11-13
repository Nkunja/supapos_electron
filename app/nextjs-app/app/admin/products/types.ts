export interface Product {
  id: number;
  name: string;
  generic_name: string;
  category: number; // Added to match API
  category_name: string; // Added to match API
  shop: number;
  shop_name: string;
  barcode: string;
  description: string;
  manufacturer: string;
  user_type: string; // Aligned with API
  user_type_display: string;
  drug_type: string; // Aligned with API
  drug_type_display: string;
  requires_prescription: boolean;
  is_active: boolean;
  form: string;
  form_display: string;
  unit_of_measurement: string;
  unit_display: string;
  items_per_pack: number;
  pack_size: string;
  batch_number: string;
  cost_price: number;
  selling_price?: number;
  units_in_stock: number;
  packs_in_stock: number;
  expiry_date: string;
  full_description: string;
  total_pieces_available: string;
  buying_price_per_piece: string;
  profit_per_piece: string;
  profit_margin_percentage: string;
  total_unit_selling_value: string;
  unit_profit: string;
  total_inventory_value_cost: string;
  total_inventory_value_selling: string;
  total_potential_profit: string;
  inventory_count: string;
  total_stock_units: string;
  total_stock_value: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProductData {
  name: string;
  generic_name: string;
  category: number; // Added to match API requirement
  shop: number;
  barcode: string;
  description: string;
  manufacturer: string;
  user_type: string; // Aligned with API
  drug_type: string; // Aligned with API
  requires_prescription: boolean;
  form: string;
  unit_of_measurement: string;
  items_per_pack: number;
  pack_size: string;
  batch_number: string;
  cost_price: number;
  selling_price: number; // Aligned with API (required)
  units_in_stock: number;
  packs_in_stock: number;
  expiry_date: string;
  is_active: boolean;
}

export interface UpdateProductData {
  name?: string;
  generic_name?: string;
  category?: number;
  shop?: number;
  barcode?: string;
  description?: string;
  manufacturer?: string;
  user_type?: string;
  drug_type?: string;
  requires_prescription?: boolean;
  form?: string;
  unit_of_measurement?: string;
  items_per_pack?: number;
  pack_size?: string;
  batch_number?: string;
  cost_price?: number;
  selling_price?: number;
  units_in_stock?: number;
  packs_in_stock?: number;
  expiry_date?: string;
  is_active?: boolean;
}

export interface ProductsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
  error?: string;
}

export interface ProductFormData {
  name: string;
  generic_name: string;
  category: number; // Added to match API requirement
  shop: number;
  barcode: string;
  description: string;
  manufacturer: string;
  user_type: 'adults' | 'children' | 'both'; // Kept as union for form validation
  drug_type: 'prescription' | 'otc' | 'controlled'; // Kept as union for form validation
  requires_prescription: boolean;
  form: string;
  unit_of_measurement: string;
  items_per_pack: number;
  pack_size: string;
  batch_number: string;
  cost_price: number;
  selling_price: number; // Aligned with API (required)
  units_in_stock: number;
  packs_in_stock: number;
  expiry_date: string;
  is_active: boolean;
}

export interface Shop {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
}

export interface ShopsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Shop[];
}

export interface ProductFilters {
  search: string;
  is_active: string;
  page: number;
}