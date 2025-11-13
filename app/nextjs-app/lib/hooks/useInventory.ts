import { useState } from "react";
import {
  Inventory,
  InventoryResponse,
  SaleData,
  SaleResponse,
  StockSummary,
  ChoiceOption,
  getInventory,
  getInventoryById,
  createInventory,
  updateInventory,
  deleteInventory,
  sellItem,
  getLowStockItems,
  getOutOfStockItems,
  getExpiredItems,
  getNearExpiryItems,
  getStockSummary,
  getDrugTypes,
  getUnits,
} from "@/app/api/inventory";

interface InventoryFilters {
  search?: string;
  shop?: number;
  product?: number;
  page?: number;
  page_size?: number;
}

export function useInventory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = async (
    filters?: InventoryFilters
  ): Promise<InventoryResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (filters?.search) params.search = filters.search;
      if (filters?.shop) params.shop = filters.shop.toString();
      if (filters?.product) params.product = filters.product.toString();
      if (filters?.page) params.page = filters.page.toString();
      if (filters?.page_size) params.page_size = filters.page_size.toString();

      const data = await getInventory(params);
      return data;
    } catch (err: any) {
      setError(err.message || "Failed to fetch inventory data");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getInventoryById = async (
    id: number
  ): Promise<Inventory | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await getInventoryById(id);
      return data;
    } catch (err: any) {
      setError(err.message || "Failed to fetch inventory item");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createInventory = async (
    item: Partial<Inventory>
  ): Promise<Inventory | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await createInventory(item);
      return data;
    } catch (err: any) {
      setError(err.message || "Failed to create inventory item");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateInventory = async (
    id: number,
    item: Partial<Inventory>
  ): Promise<Inventory | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await updateInventory(id, item);
      return data;
    } catch (err: any) {
      setError(err.message || "Failed to update inventory item");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteInventory = async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await deleteInventory(id);
      return true;
    } catch (err: any) {
      setError(err.message || "Failed to delete inventory item");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const sellInventory = async (
    id: number,
    saleData: SaleData
  ): Promise<SaleResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await sellItem(id, saleData);
      return data;
    } catch (err: any) {
      setError(err.message || "Failed to process sale");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchLowStockItems = async (): Promise<Inventory[] | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLowStockItems();
      return data.results;
    } catch (err: any) {
      setError(err.message || "Failed to fetch low stock items");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchOutOfStockItems = async (): Promise<Inventory[] | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOutOfStockItems();
      return data.results;
    } catch (err: any) {
      setError(err.message || "Failed to fetch out of stock items");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchExpiredItems = async (): Promise<Inventory[] | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await getExpiredItems();
      return data.results;
    } catch (err: any) {
      setError(err.message || "Failed to fetch expired items");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchNearExpiryItems = async (): Promise<Inventory[] | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await getNearExpiryItems();
      return data.results;
    } catch (err: any) {
      setError(err.message || "Failed to fetch near expiry items");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchStockSummary = async (): Promise<StockSummary | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStockSummary();
      return data;
    } catch (err: any) {
      setError(err.message || "Failed to fetch stock summary");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchDrugTypes = async (): Promise<ChoiceOption[] | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDrugTypes();
      return data;
    } catch (err: any) {
      setError(err.message || "Failed to fetch drug types");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchUnits = async (): Promise<ChoiceOption[] | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUnits();
      return data;
    } catch (err: any) {
      setError(err.message || "Failed to fetch units");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    fetchInventory,
    getInventoryById: getInventoryById,
    createInventory: createInventory,
    updateInventory: updateInventory,
    deleteInventory: deleteInventory,
    
    // Stock operations
    sellItem: sellInventory,
    
    // Analysis functions
    fetchLowStockItems,
    fetchOutOfStockItems,
    fetchExpiredItems,
    fetchNearExpiryItems,
    fetchStockSummary,
    
    // Choice options
    fetchDrugTypes,
    fetchUnits,
    
    // State
    loading,
    error,
    clearError,
  };
}