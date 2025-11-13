export interface Product {
  id: number;
  name: string;
  generic_name: string;
  description: string;
}
export interface ProductFormData {
  name: string;
  generic_name: string;
  description: string;
}

export interface CreateProductData {
  name: string;
  generic_name: string;
  description: string;
}

export interface UpdateProductData extends CreateProductData {}

export interface ChoiceOption {
  value: string;
  label: string;
}

export interface ProductListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Product[];
}

export interface ProductDetailResponse extends Product {}

export interface ProductFormErrors {
  name?: string[];
  generic_name?: string[];
  description?: string[];
}
export interface ProductFilters {
  search: string;
  page: number;
}

export interface ApiError {
  detail?: string;
  error?: string;
  [key: string]: any;
}
