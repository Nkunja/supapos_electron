import { Shop, PurchaseOrder } from "@/types/purchase-orders";
import api from "../auth";
import { Vendor, CreateVendorData, UpdateVendorData } from "@/types/vendor";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getVendors = async (): Promise<Vendor[]> => {
  try {
    const response = await api.get(`${API_BASE_URL}api/vendors/`);
    return Array.isArray(response.data)
      ? response.data
      : response.data.results || [];
  } catch (error) {
    console.error("API Error - getVendors:", error);
    throw new Error("Failed to fetch vendors.");
  }
};

// Fetch a single vendor by ID
export const getVendor = async (id: number): Promise<Vendor> => {
  try {
    const response = await api.get(`${API_BASE_URL}api/vendors/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`API Error - getVendor(${id}):`, error);
    throw new Error(`Failed to fetch vendor with ID ${id}.`);
  }
};

// Create a new vendor
export const createVendor = async (data: CreateVendorData): Promise<Vendor> => {
  try {
    const response = await api.post(`${API_BASE_URL}api/vendors/`, data);
    return response.data;
  } catch (error: any) {
    console.error("API Error - createVendor:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to create vendor.";
    throw new Error(errorMessage);
  }
};

// Update an existing vendor
export const updateVendor = async (
  id: number,
  data: Partial<CreateVendorData>
): Promise<Vendor> => {
  try {
    const response = await api.patch(
      `${API_BASE_URL}api/vendors/${id}/`,
      data
    );
    return response.data;
  } catch (error: any) {
    console.error(`API Error - updateVendor(${id}):`, error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      `Failed to update vendor with ID ${id}.`;
    throw new Error(errorMessage);
  }
};

// Delete a vendor
export const deleteVendor = async (id: number): Promise<void> => {
  try {
    await api.delete(`${API_BASE_URL}api/vendors/${id}/`);
  } catch (error: any) {
    console.error(`API Error - deleteVendor(${id}):`, error);
    if (error.response?.status === 403) {
      throw new Error("Only admin users can delete vendors.");
    }
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      `Failed to delete vendor with ID ${id}.`;
    throw new Error(errorMessage);
  }
};

// Custom vendor actions
export const getActiveVendors = async (): Promise<Vendor[]> => {
  try {
    const response = await api.get(`${API_BASE_URL}api/vendors/active/`);
    return Array.isArray(response.data)
      ? response.data
      : response.data.results || [];
  } catch (error) {
    console.error("API Error - getActiveVendors:", error);
    throw new Error("Failed to fetch active vendors.");
  }
};

export const activateVendor = async (
  id: number
): Promise<{ status: string }> => {
  try {
    const response = await api.post(
      `${API_BASE_URL}api/vendors/${id}/activate/`
    );
    return response.data;
  } catch (error: any) {
    console.error(`API Error - activateVendor(${id}):`, error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      `Failed to activate vendor with ID ${id}.`;
    throw new Error(errorMessage);
  }
};

export const deactivateVendor = async (
  id: number
): Promise<{ status: string }> => {
  try {
    const response = await api.post(
      `${API_BASE_URL}api/vendors/${id}/deactivate/`
    );
    return response.data;
  } catch (error: any) {
    console.error(`API Error - deactivateVendor(${id}):`, error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      `Failed to deactivate vendor with ID ${id}.`;
    throw new Error(errorMessage);
  }
};

// Search vendors with optional parameters
export const searchVendors = async (params: {
  search?: string;
  vendor_type?: string;
  status?: string;
  shop?: number;
}): Promise<Vendor[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append("search", params.search);
    if (params.vendor_type)
      queryParams.append("vendor_type", params.vendor_type);
    if (params.status) queryParams.append("status", params.status);
    if (params.shop) queryParams.append("shop", params.shop.toString());

    const response = await api.get(
      `${API_BASE_URL}api/vendors/?${queryParams.toString()}`
    );
    return Array.isArray(response.data)
      ? response.data
      : response.data.results || [];
  } catch (error) {
    console.error("API Error - searchVendors:", error);
    throw new Error("Failed to search vendors.");
  }
};

// Export types
export type { Vendor, CreateVendorData, UpdateVendorData };
