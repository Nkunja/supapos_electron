import { PurchaseOrder, Shop } from "@/types/purchase-orders";

export interface Vendor {
  id?: number;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  vendor_type: 'manufacturer' | 'wholesaler' | 'distributor' | 'local_supplier';
  license_number?: string;
  tax_id?: string;
  credit_limit: number;
  payment_terms?: string;
  status: 'active' | 'inactive' | 'suspended';
  notes?: string;
  shop?: number | Shop;
  shop_name?: string;
  created_date?: string;
  updated_at?: string;
  total_orders?: number;
  total_amount_purchased?: number;
  purchase_orders?: PurchaseOrder[];
}

export interface CreateVendorData {
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  vendor_type?: 'manufacturer' | 'wholesaler' | 'distributor' | 'local_supplier';
  license_number?: string;
  tax_id?: string;
  credit_limit?: number;
  payment_terms?: string;
  status?: 'active' | 'inactive' | 'suspended';
  notes?: string;
  shop?: number;
}

export interface UpdateVendorData extends Partial<CreateVendorData> {
  id: number;
}

export interface VendorFormData {
  name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  vendor_type: 'manufacturer' | 'wholesaler' | 'distributor' | 'local_supplier' | '';
  license_number: string;
  tax_id: string;
  credit_limit: number | null;
  payment_terms: string;
  status: 'active' | 'inactive' | 'suspended' | '';
  notes: string;
  shop: number | null;
}

export interface VendorFormProps {
  isOpen: boolean;
  onClose: () => void;
  vendor?: Vendor | null;
  onSuccess: () => void;
}