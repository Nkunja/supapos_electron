import api from '../auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pharmasys.sirnkunja.co.ke/';
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pharmacy-suite.onrender.com/';

const API_URL = `${API_BASE_URL}api/stock-movements/`;

// Core API functions
export const getStockMovements = async (params?: {
  movement_type?: string;
  inventory?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
  page?: string;
  page_size?: string;
}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.movement_type) queryParams.append('movement_type', params.movement_type);
    if (params?.inventory) queryParams.append('inventory', params.inventory);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.date_from) queryParams.append('date_from', params.date_from);
    if (params?.date_to) queryParams.append('date_to', params.date_to);
    if (params?.page) queryParams.append('page', params.page);
    if (params?.page_size) queryParams.append('page_size', params.page_size);

    const url = queryParams.toString() ? `${API_URL}?${queryParams.toString()}` : API_URL;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch stock movements.");
  }
};

export const getStockMovementById = async (id: string) => {
  try {
    const response = await api.get(`${API_URL}${id}/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch stock movement.");
  }
};

export const createStockMovement = async (data: any) => {
  try {
    const response = await api.post(API_URL, data);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create stock movement.");
  }
};

export const updateStockMovement = async (id: string, data: any) => {
  try {
    const response = await api.patch(`${API_URL}${id}/`, data);
    return response.data;
  } catch (error) {
    throw new Error("Failed to update stock movement.");
  }
};

export const deleteStockMovement = async (id: string) => {
  try {
    await api.delete(`${API_URL}${id}/`);
    return true;
  } catch (error) {
    throw new Error("Failed to delete stock movement.");
  }
};

export const getMovementSummary = async (params?: {
  movement_type?: string;
  inventory?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.movement_type) queryParams.append('movement_type', params.movement_type);
    if (params?.inventory) queryParams.append('inventory', params.inventory);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.date_from) queryParams.append('date_from', params.date_from);
    if (params?.date_to) queryParams.append('date_to', params.date_to);

    const url = `${API_URL}movement_summary/?${queryParams.toString()}`;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch movement summary.");
  }
}; 