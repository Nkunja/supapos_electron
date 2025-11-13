export type MovementType = 'in' | 'out' | 'adjustment' | 'transfer' | 'sale';

export interface StockMovement {
  id: string;
  inventory: number;
  product_name: string;
  shop_name: string;
  movement_type: MovementType;
  movement_type_display: string;
  quantity: number;
  previous_quantity: number;
  new_quantity: number;
  reference_number: string;
  invoice: string;
  notes: string;
  created_by: number;
  created_by_name: string;
  created_at: string;
}

export interface StockMovementCreateRequest {
  inventory: number;
  movement_type: MovementType;
  quantity: number;
  previous_quantity: number;
  new_quantity: number;
  reference_number: string;
  invoice: string;
  notes: string;
}

export interface StockMovementUpdateRequest
  extends Partial<StockMovementCreateRequest> {}

export interface StockMovementListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: StockMovement[];
}

export interface StockMovementFilters {
  movement_type?: MovementType;
  inventory?: number;
  search?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  page_size?: number;
}

export interface StockMovementFormData {
  inventory: string;
  movement_type: MovementType;
  quantity: string;
  previous_quantity: string;
  new_quantity: string;
  reference_number: string;
  invoice: string;
  notes: string;
}

export const MOVEMENT_TYPES = [
  { value: 'in', label: 'Stock In' },
  { value: 'out', label: 'Stock Out' },
  { value: 'adjustment', label: 'Adjustment' },
  { value: 'transfer', label: 'Transfer' },
  { value: 'sale', label: 'Sale' },
] as const;