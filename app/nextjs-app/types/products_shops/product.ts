export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface Shop {
  id: number;
  name: string;
  salesperson: number;
  salesperson_name: string;
  salesperson_email: string;
  address: string;
  phone_number: string;
  is_active: boolean;
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

export interface Product {
  id: number;
  name: string;
  generic_name: string;
  category: number;
  category_name: string;
  shop: number;
  shop_name: string;
  barcode: string;
  description: string;
  manufacturer: string;
  user_type: string;
  user_type_display: string;
  drug_type: string;
  drug_type_display: string;
  requires_prescription: boolean;
  is_active: boolean;
  form: string;
  form_display: string;
  unit_of_measurement: string;
  unit_display: string;
  items_per_pack: number;
  pack_size: string;
  full_description: string;
  inventory_count: number;
  total_stock_units: number;
  total_stock_value: number;
  created_at: string;
  updated_at: string;
}
export type ShopsResponse = PaginatedResponse<Shop>;
export type ProductsResponse = PaginatedResponse<Product>;