// export interface PurchaseOrder {
//   id?: number;
//   name: string;
//   supplier_info?: string;
//   quantity_received?: number;
//   status: 'draft' | 'pending' | 'approved' | 'completed' | 'cancelled';
//   total_amount?: string | number;
//   notes?: string;
//   shop?: number | Shop;
//   created_date?: string;
//   updated_at?: string;
// }

// export interface Shop {
//   id: number;
//   name: string;
//   address?: string;
//   po_box?: string;
//   phone_number?: string;
//   tel_number?: string;
//   kra_pin?: string;
//   is_active: boolean;
//   created_at: string;
//   updated_at: string;
//   salesperson_names?: string;
// }

// export interface PurchaseOrderFormData {
//   name: string;
//   supplier_info: string;
//   quantity_received: number;
//   status: 'draft' | 'pending' | 'approved' | 'completed' | 'cancelled';
//   total_amount: string;
//   notes: string;
//   shop: number | null;
// }

// export interface CreatePurchaseOrderData {
//   name: string;
//   supplier_info?: string;
//   quantity_received?: number;
//   status?: 'draft' | 'pending' | 'approved' | 'completed' | 'cancelled';
//   total_amount?: string | number;
//   notes?: string;
//   shop?: number;
// }

// export interface ApiError {
//   detail?: string;
//   message?: string;
// }


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

export interface PurchaseOrder {
  id?: number;
  name: string;
  supplier?: number; 
  supplier_name?: string;
  quantity_received?: number;
  status: 'draft' | 'pending' | 'approved' | 'completed' | 'cancelled';
  total_amount?: string | number;
  notes?: string;
  shop?: number | Shop;
  created_date?: string;
  updated_at?: string;
}

export interface PurchaseOrderFormData {
  name: string;
  supplier: number | null; 
  quantity_received: number;
  status: 'draft' | 'pending' | 'approved' | 'completed' | 'cancelled';
  total_amount: string;
  notes: string;
  shop: number | null;
}

export interface CreatePurchaseOrderData {
  name: string;
  supplier?: number; 
  quantity_received?: number;
  status?: 'draft' | 'pending' | 'approved' | 'completed' | 'cancelled';
  total_amount?: string | number;
  notes?: string;
  shop?: number;
}

export interface UpdatePurchaseOrderData extends Partial<CreatePurchaseOrderData> {
  id: number;
}

export interface ApiError {
  detail?: string;
  message?: string;
}