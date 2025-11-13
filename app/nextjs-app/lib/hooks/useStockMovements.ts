import { useState } from "react";
import {
  StockMovement,
  StockMovementCreateRequest,
  StockMovementUpdateRequest,
  StockMovementListResponse,
  StockMovementFilters,
} from "@/types/stock-movements/stock-movements";
import {
  getStockMovements,
  getStockMovementById,
  createStockMovement,
  updateStockMovement,
  deleteStockMovement,
  getMovementSummary,
} from "@/app/api/stock-movements";

export function useStockMovements() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStockMovements = async (
    filters?: StockMovementFilters
  ): Promise<StockMovementListResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (filters?.movement_type) params.movement_type = filters.movement_type;
      if (filters?.inventory) params.inventory = filters.inventory.toString();
      if (filters?.search) params.search = filters.search;
      if (filters?.date_from) params.date_from = filters.date_from;
      if (filters?.date_to) params.date_to = filters.date_to;
      if (filters?.page) params.page = filters.page.toString();
      if (filters?.page_size) params.page_size = filters.page_size.toString();

      const data = await getStockMovements(params);
      return data;
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getStockMovementItemById = async (
    id: string
  ): Promise<StockMovement | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await getStockMovementById(id);
      return data;
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createStockMovementItem = async (
    movementData: StockMovementCreateRequest
  ): Promise<StockMovement | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await createStockMovement(movementData);
      return data;
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateStockMovementItem = async (
    id: string,
    movementData: StockMovementUpdateRequest
  ): Promise<StockMovement | null> => {
    setLoading(true);
    setError(null);
    try {
      const data = await updateStockMovement(id, movementData);
      return data;
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteStockMovementItem = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await deleteStockMovement(id);
      return true;
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const fetchMovementSummaryData = async (
    filters?: StockMovementFilters
  ): Promise<StockMovement[] | null> => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {};
      if (filters?.movement_type) params.movement_type = filters.movement_type;
      if (filters?.inventory) params.inventory = filters.inventory.toString();
      if (filters?.search) params.search = filters.search;
      if (filters?.date_from) params.date_from = filters.date_from;
      if (filters?.date_to) params.date_to = filters.date_to;

      const data = await getMovementSummary(params);
      return data;
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    fetchStockMovements,
    getStockMovementById: getStockMovementItemById,
    createStockMovement: createStockMovementItem,
    updateStockMovement: updateStockMovementItem,
    deleteStockMovement: deleteStockMovementItem,
    fetchMovementSummary: fetchMovementSummaryData,
  };
}
