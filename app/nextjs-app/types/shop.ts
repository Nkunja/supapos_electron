
export interface Salesperson {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
}

export interface Shop {
  id: number;
  name: string;
  address: string;
  phone_number: string;
  is_active: boolean;
  salespersons: number[]; 
  salespersons_data: Salesperson[]; 
  salesperson_names: string; 
  salespersons_count: number;
  created_at: string;
  updated_at: string;
}

export interface ShopCashSpent {
  total_utility_cash_spent: number;
}