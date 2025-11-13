// // import { NextRequest, NextResponse } from 'next/server';
// // import api from '../auth';



// // export interface Inventory {
// //   id: number;
// //   product: number;
// //   product_name: string;
// //   product_generic_name: string;
// //   shop: number;
// //   shop_name: string;
// //   added_by: number;
// //   added_by_username: string;
// //   barcode: string;
// //   supplier: string;
// //   user_type: string;
// //   user_type_display: string;
// //   drug_type: string;
// //   drug_type_display: string;
// //   form: string;
// //   form_display: string;
// //   pieces_per_unit: number;
// //   unit_of_measurement: string;
// //   unit_of_measurement_display: string;
// //   total_units: number;
// //   pack_description: string;
// //   batch_number: string;
// //   expiry_date: string | null;
// //   purchase_date: string;
// //   purchase_order: string;
// //   cost_price_per_piece: string;
// //   selling_price_per_piece: string;
// //   quantity_in_stock: number;
// //   initial_quantity: number;
// //   reorder_level: number;
// //   is_active: boolean;
// //   created_at: string;
// //   updated_at: string;
// // }

// // export interface InventoryResponse {
// //   count: number;
// //   next: string | null;
// //   previous: string | null;
// //   results: Inventory[];
// // }

// // export interface StockAdjustment {
// //   adjustment_type: 'add' | 'remove' | 'set';
// //   quantity: number;
// //   reason?: string;
// // }

// // export interface StockAdjustmentResponse {
// //   message: string;
// //   inventory: Inventory;
// //   adjustment: {
// //     type: string;
// //     quantity: number;
// //     previous_quantity: number;
// //     new_quantity: number;
// //     change: number;
// //     reason: string;
// //   };
// // }

// // export interface SaleData {
// //   quantity: number;
// // }

// // export interface SaleResponse {
// //   message: string;
// //   sale_details: {
// //     quantity_sold: number;
// //     sale_amount: number;
// //     previous_stock: number;
// //     remaining_stock: number;
// //   };
// //   inventory: Inventory;
// // }

// // export interface RestockData {
// //   quantity: number;
// //   cost_price_per_piece?: string;
// //   selling_price_per_piece?: string;
// //   expiry_date?: string;
// //   reason?: string;
// // }

// // export interface RestockResponse {
// //   message: string;
// //   restock_details: {
// //     quantity_added: number;
// //     previous_stock: number;
// //     new_stock: number;
// //     reason: string;
// //   };
// //   inventory: Inventory;
// // }

// // export interface StockSummary {
// //   total_inventory_items: number;
// //   in_stock: number;
// //   low_stock: number;
// //   out_of_stock: number;
// //   percentages: {
// //     in_stock: number;
// //     low_stock: number;
// //     out_of_stock: number;
// //   };
// // }

// // export interface ChoiceOption {
// //   value: string;
// //   label: string;
// // }

// // const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pharmasys.sirnkunja.co.ke/';
// // const API_URL = `${API_BASE_URL}api/inventory/`;

// // // Core API functions
// // export const getInventory = async (params?: {
// //   page?: string;
// //   search?: string;
// //   shop?: string;
// //   product?: string;
// //   page_size?: string;
// // }): Promise<InventoryResponse> => {
// //   try {
// //     const queryParams = new URLSearchParams();
// //     if (params?.page) queryParams.append('page', params.page);
// //     if (params?.search) queryParams.append('search', params.search);
// //     if (params?.shop) queryParams.append('shop', params.shop);
// //     if (params?.product) queryParams.append('product', params.product);
// //     if (params?.page_size) queryParams.append('page_size', params.page_size);

// //     const url = queryParams.toString() ? `${API_URL}?${queryParams.toString()}` : API_URL;
// //     const response = await api.get(url);
// //     return response.data;
// //   } catch (error) {
// //     throw new Error("Failed to fetch inventory.");
// //   }
// // };

// // export const getInventoryById = async (id: number): Promise<Inventory> => {
// //   try {
// //     const response = await api.get(`${API_URL}${id}/`);
// //     return response.data;
// //   } catch (error) {
// //     throw new Error("Failed to fetch inventory item.");
// //   }
// // };

// // export const createInventory = async (data: Partial<Inventory>): Promise<Inventory> => {
// //   try {
// //     const response = await api.post(API_URL, data);
// //     return response.data;
// //   } catch (error) {
// //     throw new Error("Failed to create inventory item.");
// //   }
// // };

// // export const updateInventory = async (id: number, data: Partial<Inventory>): Promise<Inventory> => {
// //   try {
// //     const response = await api.patch(`${API_URL}${id}/`, data);
// //     return response.data;
// //   } catch (error) {
// //     throw new Error("Failed to update inventory item.");
// //   }
// // };

// // export const deleteInventory = async (id: number): Promise<boolean> => {
// //   try {
// //     await api.delete(`${API_URL}${id}/`);
// //     return true;
// //   } catch (error) {
// //     throw new Error("Failed to delete inventory item.");
// //   }
// // };

// // // Stock management functions
// // export const sellItem = async (id: number, saleData: SaleData): Promise<SaleResponse> => {
// //   try {
// //     const response = await api.post(`${API_URL}${id}/sell_item/`, saleData);
// //     return response.data;
// //   } catch (error) {
// //     throw new Error("Failed to process sale.");
// //   }
// // };

// // // Stock status functions
// // export const getLowStockItems = async (): Promise<{ count: number; results: Inventory[] }> => {
// //   try {
// //     const response = await api.get(`${API_URL}low_stock/`);
// //     return response.data;
// //   } catch (error) {
// //     throw new Error("Failed to fetch low stock items.");
// //   }
// // };

// // export const getOutOfStockItems = async (): Promise<{ count: number; results: Inventory[] }> => {
// //   try {
// //     const response = await api.get(`${API_URL}out_of_stock/`);
// //     return response.data;
// //   } catch (error) {
// //     throw new Error("Failed to fetch out of stock items.");
// //   }
// // };

// // export const getExpiredItems = async (): Promise<{ count: number; results: Inventory[] }> => {
// //   try {
// //     const response = await api.get(`${API_URL}expired/`);
// //     return response.data;
// //   } catch (error) {
// //     throw new Error("Failed to fetch expired items.");
// //   }
// // };

// // export const getNearExpiryItems = async (): Promise<{ count: number; results: Inventory[] }> => {
// //   try {
// //     const response = await api.get(`${API_URL}near_expiry/`);
// //     return response.data;
// //   } catch (error) {
// //     throw new Error("Failed to fetch near expiry items.");
// //   }
// // };

// // export const getStockSummary = async (): Promise<StockSummary> => {
// //   try {
// //     const response = await api.get(`${API_URL}stock_summary/`);
// //     return response.data;
// //   } catch (error) {
// //     throw new Error("Failed to fetch stock summary.");
// //   }
// // };

// // // Choice options functions
// // export const getDrugTypes = async (): Promise<ChoiceOption[]> => {
// //   try {
// //     const response = await api.get(`${API_URL}drug_types/`);
// //     return response.data;
// //   } catch (error) {
// //     throw new Error("Failed to fetch drug types.");
// //   }
// // };

// // export const getUnits = async (): Promise<ChoiceOption[]> => {
// //   try {
// //     const response = await api.get(`${API_URL}units/`);
// //     return response.data;
// //   } catch (error) {
// //     throw new Error("Failed to fetch units.");
// //   }
// // };

// // // API Route Handlers
// // export async function GET(request: NextRequest) {
// //   try {
// //     const { searchParams } = new URL(request.url);
    
// //     // Get query parameters
// //     const page = searchParams.get('page') || undefined;
// //     const search = searchParams.get('search') || undefined;
// //     const shop = searchParams.get('shop') || undefined;
// //     const product = searchParams.get('product') || undefined;
// //     const page_size = searchParams.get('page_size') || undefined;

// //     // Get inventory with filters
// //     const inventory = await getInventory({ 
// //       page, 
// //       search, 
// //       shop, 
// //       product, 
// //       page_size 
// //     });
// //     return NextResponse.json(inventory);
// //   } catch (error: any) {
// //     return NextResponse.json(
// //       { error: error.message || 'Failed to fetch inventory' },
// //       { status: 500 }
// //     );
// //   }
// // }

// // export async function POST(request: NextRequest) {
// //   try {
// //     const body = await request.json();
// //     const inventory = await createInventory(body);
// //     return NextResponse.json(inventory);
// //   } catch (error: any) {
// //     return NextResponse.json(
// //       { error: error.message || 'Failed to create inventory' },
// //       { status: 500 }
// //     );
// //   }
// // }


// import { ChoiceOption, Inventory, InventoryCreateRequest, InventoryFilters, InventoryResponse, InventoryUpdateRequest } from "@/types/inventory/inventory";
// import api from "../auth";

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// export const getInventory = async (params?: InventoryFilters): Promise<InventoryResponse> => {
//   try {
//     const queryParams = new URLSearchParams();
    
//     if (params?.page) queryParams.append('page', params.page.toString());
//     if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
//     if (params?.search) queryParams.append('search', params.search);
//     if (params?.shop) queryParams.append('shop', params.shop.toString());
//     if (params?.product) queryParams.append('product', params.product.toString());

//     const url = queryParams.toString() 
//       ? `${API_BASE_URL}/api/inventory/?${queryParams.toString()}` 
//       : `${API_BASE_URL}/api/inventory/`;
    
//     const response = await api.get(url);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to fetch inventory items.");
//   }
// };

// export const getInventoryById = async (id: number): Promise<Inventory> => {
//   try {
//     const response = await api.get(`${API_BASE_URL}/api/inventory/${id}/`);
//     return response.data;
//   } catch (error) {
//     throw new Error(`Failed to fetch inventory item with ID ${id}.`);
//   }
// };

// export const createInventory = async (data: InventoryCreateRequest): Promise<Inventory> => {
//   try {
//     const response = await api.post(`${API_BASE_URL}/api/inventory/`, data);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to create inventory item.");
//   }
// };

// export const updateInventory = async (id: number, data: Partial<InventoryCreateRequest>): Promise<Inventory> => {
//   try {
//     const response = await api.patch(`${API_BASE_URL}/api/inventory/${id}/`, data);
//     return response.data;
//   } catch (error) {
//     throw new Error(`Failed to update inventory item with ID ${id}.`);
//   }
// };

// export const deleteInventory = async (id: number): Promise<void> => {
//   try {
//     await api.delete(`${API_BASE_URL}/api/inventory/${id}/`);
//   } catch (error: any) {
//     if (error.response?.status === 403) {
//       throw new Error("Only admin users can delete inventory items.");
//     }
//     throw new Error(`Failed to delete inventory item with ID ${id}.`);
//   }
// };

// // Stock management functions
// export const sellItem = async (id: number, saleData: { quantity: number }): Promise<any> => {
//   try {
//     const response = await api.post(`${API_BASE_URL}/api/inventory/${id}/sell_item/`, saleData);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to process sale.");
//   }
// };

// export const adjustStock = async (id: number, adjustmentData: {
//   adjustment_type: 'add' | 'remove' | 'set';
//   quantity: number;
//   reason?: string;
// }): Promise<any> => {
//   try {
//     const response = await api.post(`${API_BASE_URL}/api/inventory/${id}/adjust_stock/`, adjustmentData);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to adjust stock.");
//   }
// };

// export const restockItem = async (id: number, restockData: {
//   quantity: number;
//   cost_price_per_piece?: number;
//   selling_price_per_piece?: number;
//   expiry_date?: string;
//   reason?: string;
// }): Promise<any> => {
//   try {
//     const response = await api.post(`${API_BASE_URL}/api/inventory/${id}/restock/`, restockData);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to restock item.");
//   }
// };

// // Stock status functions
// export const getLowStockItems = async (): Promise<{ count: number; results: Inventory[] }> => {
//   try {
//     const response = await api.get(`${API_BASE_URL}/api/inventory/low_stock/`);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to fetch low stock items.");
//   }
// };

// export const getOutOfStockItems = async (): Promise<{ count: number; results: Inventory[] }> => {
//   try {
//     const response = await api.get(`${API_BASE_URL}/api/inventory/out_of_stock/`);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to fetch out of stock items.");
//   }
// };

// export const getExpiredItems = async (): Promise<{ count: number; results: Inventory[] }> => {
//   try {
//     const response = await api.get(`${API_BASE_URL}/api/inventory/expired/`);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to fetch expired items.");
//   }
// };

// export const getNearExpiryItems = async (): Promise<{ count: number; results: Inventory[] }> => {
//   try {
//     const response = await api.get(`${API_BASE_URL}/api/inventory/near_expiry/`);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to fetch near expiry items.");
//   }
// };

// export const getStockSummary = async (): Promise<{
//   total_inventory_items: number;
//   in_stock: number;
//   low_stock: number;
//   out_of_stock: number;
//   percentages: {
//     in_stock: number;
//     low_stock: number;
//     out_of_stock: number;
//   };
// }> => {
//   try {
//     const response = await api.get(`${API_BASE_URL}/api/inventory/stock_summary/`);
//     return response.data;
//   } catch (error) {
//     throw new Error("Failed to fetch stock summary.");
//   }
// };

// // Choice options functions
// export const getDrugTypes = async (): Promise<ChoiceOption[]> => {
//   try {
//     const response = await api.get(`${API_BASE_URL}/api/inventory/drug_types/`);
//     return response.data;
//   } catch (error) {
//     console.error("Failed to fetch drug types:", error);
//     // Return default options if API fails
//     return [
//       { value: 'prescription', label: 'Prescription' },
//       { value: 'otc', label: 'Over-the-Counter' },
//       { value: 'controlled', label: 'Controlled Substance' },
//     ];
//   }
// };

// export const getUnits = async (): Promise<ChoiceOption[]> => {
//   try {
//     const response = await api.get(`${API_BASE_URL}/api/inventory/units/`);
//     return response.data;
//   } catch (error) {
//     console.error("Failed to fetch units:", error);
//     // Return default options if API fails
//     return [
//       { value: 'pieces', label: 'Pieces' },
//       { value: 'ml', label: 'Milliliters' },
//       { value: 'mg', label: 'Milligrams' },
//       { value: 'g', label: 'Grams' },
//       { value: 'tablets', label: 'Tablets' },
//       { value: 'capsules', label: 'Capsules' },
//       { value: 'vials', label: 'Vials' },
//       { value: 'bottles', label: 'Bottles' },
//       { value: 'other', label: 'Other' },
//     ];
//   }
// };

// export type { 
//   Inventory, 
//   InventoryCreateRequest, 
//   InventoryUpdateRequest, 
//   InventoryResponse, 
//   InventoryFilters,
//   ChoiceOption 
// };




import { ChoiceOption, Inventory, InventoryCreateRequest, InventoryFilters, InventoryResponse, InventoryUpdateRequest, Product, SaleData, SaleResponse, Shop, StockSummary } from "@/types/inventory/inventory";
import api from "../auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getInventory = async (params?: InventoryFilters): Promise<InventoryResponse> => {
  try {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.shop) queryParams.append('shop', params.shop.toString());
    if (params?.product) queryParams.append('product', params.product.toString());

    const url = queryParams.toString() 
      ? `${API_BASE_URL}api/inventory/?${queryParams.toString()}` 
      : `${API_BASE_URL}api/inventory/`;
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch inventory items.");
  }
};

export const getInventoryById = async (id: number): Promise<Inventory> => {
  try {
    const response = await api.get(`${API_BASE_URL}api/inventory/${id}/`);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch inventory item with ID ${id}.`);
  }
};

export const createInventory = async (data: InventoryCreateRequest): Promise<Inventory> => {
  try {
    const response = await api.post(`${API_BASE_URL}api/inventory/`, data);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create inventory item.");
  }
};

export const updateInventory = async (id: number, data: Partial<InventoryCreateRequest>): Promise<Inventory> => {
  try {
    const response = await api.patch(`${API_BASE_URL}api/inventory/${id}/`, data);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update inventory item with ID ${id}.`);
  }
};

export const deleteInventory = async (id: number): Promise<void> => {
  try {
    await api.delete(`${API_BASE_URL}api/inventory/${id}/`);
  } catch (error: any) {
    if (error.response?.status === 403) {
      throw new Error("Only admin users can delete inventory items.");
    }
    throw new Error(`Failed to delete inventory item with ID ${id}.`);
  }
};

export const sellItem = async (id: number, saleData: SaleData): Promise<SaleResponse> => {
  try {
    const response = await api.post(`${API_BASE_URL}api/inventory/${id}/sell_item/`, saleData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to process sale.");
  }
};

export const adjustStock = async (id: number, adjustmentData: {
  adjustment_type: 'add' | 'remove' | 'set';
  quantity: number;
  reason?: string;
}): Promise<Inventory> => {
  try {
    const response = await api.post(`${API_BASE_URL}api/inventory/${id}/adjust_stock/`, adjustmentData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to adjust stock.");
  }
};

export const restockItem = async (id: number, restockData: {
  quantity: number;
  cost_price_per_piece?: number;
  selling_price_per_piece?: number;
  expiry_date?: string;
  reason?: string;
}): Promise<Inventory> => {
  try {
    const response = await api.post(`${API_BASE_URL}api/inventory/${id}/restock/`, restockData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to restock item.");
  }
};

export const getLowStockItems = async (): Promise<{ count: number; results: Inventory[] }> => {
  try {
    const response = await api.get(`${API_BASE_URL}api/inventory/low_stock/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch low stock items.");
  }
};

export const getOutOfStockItems = async (): Promise<{ count: number; results: Inventory[] }> => {
  try {
    const response = await api.get(`${API_BASE_URL}api/inventory/out_of_stock/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch out of stock items.");
  }
};

export const getExpiredItems = async (): Promise<{ count: number; results: Inventory[] }> => {
  try {
    const response = await api.get(`${API_BASE_URL}api/inventory/expired/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch expired items.");
  }
};

export const getNearExpiryItems = async (): Promise<{ count: number; results: Inventory[] }> => {
  try {
    const response = await api.get(`${API_BASE_URL}api/inventory/near_expiry/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch near expiry items.");
  }
};

export const getStockSummary = async (): Promise<StockSummary> => {
  try {
    const response = await api.get(`${API_BASE_URL}api/inventory/stock_summary/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch stock summary.");
  }
};

export const getDrugTypes = async (): Promise<ChoiceOption[]> => {
  try {
    const response = await api.get(`${API_BASE_URL}api/inventory/drug_types/`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch drug types:", error);
    return [
      { value: 'prescription', label: 'Prescription' },
      { value: 'otc', label: 'Over-the-Counter' },
      { value: 'controlled', label: 'Controlled Substance' },
    ];
  }
};

export const getUnits = async (): Promise<ChoiceOption[]> => {
  try {
    const response = await api.get(`${API_BASE_URL}api/inventory/units/`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch units:", error);
    return [
      { value: 'pieces', label: 'Pieces' },
      { value: 'ml', label: 'Milliliters' },
      { value: 'mg', label: 'Milligrams' },
      { value: 'g', label: 'Grams' },
      { value: 'tablets', label: 'Tablets' },
      { value: 'capsules', label: 'Capsules' },
      { value: 'vials', label: 'Vials' },
      { value: 'bottles', label: 'Bottles' },
      { value: 'other', label: 'Other' },
    ];
  }
};

export type { 
  Inventory, 
  InventoryCreateRequest, 
  InventoryUpdateRequest, 
  InventoryResponse, 
  InventoryFilters,
  Product,
  Shop,
  ChoiceOption,
  SaleData,
  SaleResponse,
  StockSummary,
};