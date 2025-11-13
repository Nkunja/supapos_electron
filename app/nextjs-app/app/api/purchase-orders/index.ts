// import api from '../auth';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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

// export interface CreatePurchaseOrderData {
//   name: string;
//   supplier_info?: string;
//   quantity_received?: number;
//   status?: 'draft' | 'pending' | 'approved' | 'completed' | 'cancelled';
//   total_amount?: string | number;
//   notes?: string;
//   shop?: number; 
// }

// export interface UpdatePurchaseOrderData extends Partial<CreatePurchaseOrderData> {
//   id: number;
// }

// export const getPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
//   try {
//     const response = await api.get(`${API_BASE_URL}/api/purchase-orders/`);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to fetch purchase orders.");
//   }
// };

// export const getPurchaseOrder = async (id: number): Promise<PurchaseOrder> => {
//   try {
//     const response = await api.get(`${API_BASE_URL}/api/purchase-orders/${id}/`);
//     return response.data;
//   } catch (error) {
//     throw new Error(`Failed to fetch purchase order with ID ${id}.`);
//   }
// };

// export const createPurchaseOrder = async (data: CreatePurchaseOrderData): Promise<PurchaseOrder> => {
//   try {
//     const response = await api.post(`${API_BASE_URL}/api/purchase-orders/`, data);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to create purchase order.");
//   }
// };

// export const updatePurchaseOrder = async (id: number, data: Partial<CreatePurchaseOrderData>): Promise<PurchaseOrder> => {
//   try {
//     const response = await api.patch(`${API_BASE_URL}/api/purchase-orders/${id}/`, data);
//     return response.data;
//   } catch (error) {
//     throw new Error(`Failed to update purchase order with ID ${id}.`);
//   }
// };

// export const deletePurchaseOrder = async (id: number): Promise<void> => {
//   try {
//     await api.delete(`${API_BASE_URL}/api/purchase-orders/${id}/`);
//   } catch (error: any) {
//     if (error.response?.status === 403) {
//       throw new Error("Only admin users can delete purchase orders.");
//     }
//     throw new Error(`Failed to delete purchase order with ID ${id}.`);
//   }
// };


import { CreatePurchaseOrderData, PurchaseOrder } from '@/types/purchase-orders';
import api from '../auth';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getPurchaseOrders = async (): Promise<PurchaseOrder[]> => {
  try {
    const response = await api.get(`${API_BASE_URL}api/purchase-orders/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch purchase orders.");
  }
};

export const getPurchaseOrder = async (id: number): Promise<PurchaseOrder> => {
  try {
    const response = await api.get(`${API_BASE_URL}api/purchase-orders/${id}/`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch purchase order with ID ${id}.`);
  }
};

export const createPurchaseOrder = async (data: CreatePurchaseOrderData): Promise<PurchaseOrder> => {
  try {
    const response = await api.post(`${API_BASE_URL}api/purchase-orders/`, data);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create purchase order.");
  }
};

export const updatePurchaseOrder = async (id: number, data: Partial<CreatePurchaseOrderData>): Promise<PurchaseOrder> => {
  try {
    const response = await api.patch(`${API_BASE_URL}api/purchase-orders/${id}/`, data);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update purchase order with ID ${id}.`);
  }
};

export const deletePurchaseOrder = async (id: number): Promise<void> => {
  try {
    await api.delete(`${API_BASE_URL}api/purchase-orders/${id}/`);
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error("Only admin users can delete purchase orders.");
    }
    throw new Error(`Failed to delete purchase order with ID ${id}.`);
  }
};