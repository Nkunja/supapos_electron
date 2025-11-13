import { Product } from "./product";

export interface Shop {
  id: number;
  name: string;
  address?: string;
  phone_number?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Customer {
  id?: number;
  first_name: string;
  last_name: string;
  full_name?: string;
  date_of_birth?: string;
  gender?: 'M' | 'F' | 'O';
  phone_number: string;
  email?: string;
  address?: string;
  allergies?: string;
  medical_conditions?: string;
  description?: string;
  prescriptions?: Product[];
  medication_notes?: string;
  is_active: boolean;
  shop?: number | Shop;
  shop_name?: string;
  last_visit?: string;
  next_visit?: string;
  visit_frequency_days?: number;
  notes?: string;
  age?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCustomerData {
  first_name: string;
  last_name: string;
  phone_number: string;
  email?: string;
  date_of_birth?: string;
  gender?: 'M' | 'F' | 'O';
  address?: string;
  allergies?: string;
  medical_conditions?: string;
  description?: string;
  medication_notes?: string;
  is_active?: boolean;
  shop?: number;

  visit_frequency_days?: number;
  notes?: string;
}

export interface UpdateCustomerData extends Partial<CreateCustomerData> {
  id: number;
}

export interface ManagePrescriptionsData {
  action: 'add' | 'remove';
  product_ids: number[];
}

export interface CustomerFormData {
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  date_of_birth: string;
  gender: 'M' | 'F' | 'O' | '';
  address: string;
  allergies: string;
  medical_conditions: string;
  description: string;
  medication_notes: string;
  is_active: boolean;
  shop: number | null;
  visit_frequency_days: number | null;
  notes: string;
  selectedPrescriptions: number[];
}

export interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer | null;
  onSuccess: () => void;
}