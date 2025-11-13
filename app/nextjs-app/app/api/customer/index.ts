import {
  CreateCustomerData,
  Customer,
  ManagePrescriptionsData,
  UpdateCustomerData,
} from "@/types/customer";
import api from "../auth";
import { Product } from "@/types/product";
import { Shop } from "@/types/shop";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface LoyaltyPointsData {
  action: "add" | "deduct";
  points: number;
}

export const getCustomers = async (): Promise<Customer[]> => {
  try {
    const response = await api.get(`${API_BASE_URL}/api/customers/`);
    return Array.isArray(response.data)
      ? response.data
      : response.data.results || [];
  } catch (error) {
    console.error("API Error - getCustomers:", error);
    throw new Error("Failed to fetch customers.");
  }
};

export const getCustomer = async (id: number): Promise<Customer> => {
  try {
    const response = await api.get(`${API_BASE_URL}/api/customers/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`API Error - getCustomer(${id}):`, error);
    throw new Error(`Failed to fetch customer with ID ${id}.`);
  }
};

export const createCustomer = async (
  data: CreateCustomerData
): Promise<Customer> => {
  try {
    const response = await api.post(`${API_BASE_URL}/api/customers/`, data);
    return response.data;
  } catch (error: any) {
    console.error("API Error - createCustomer:", error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to create customer.";
    throw new Error(errorMessage);
  }
};

export const updateCustomer = async (
  id: number,
  data: Partial<CreateCustomerData>
): Promise<Customer> => {
  try {
    const response = await api.patch(
      `${API_BASE_URL}/api/customers/${id}/`,
      data
    );
    return response.data;
  } catch (error: any) {
    console.error(`API Error - updateCustomer(${id}):`, error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      `Failed to update customer with ID ${id}.`;
    throw new Error(errorMessage);
  }
};

export const deleteCustomer = async (id: number): Promise<void> => {
  try {
    await api.delete(`${API_BASE_URL}/api/customers/${id}/`);
  } catch (error: any) {
    console.error(`API Error - deleteCustomer(${id}):`, error);
    if (error.response?.status === 403) {
      throw new Error("Only admin users can delete customers.");
    }
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      `Failed to delete customer with ID ${id}.`;
    throw new Error(errorMessage);
  }
};

// Custom customer actions
export const getDueVisits = async (): Promise<{
  count: number;
  customers: Customer[];
}> => {
  try {
    const response = await api.get(`${API_BASE_URL}/api/customers/due_visits/`);
    return response.data;
  } catch (error) {
    console.error("API Error - getDueVisits:", error);
    throw new Error("Failed to fetch customers due for visits.");
  }
};

export const getUpcomingVisits = async (): Promise<{
  count: number;
  customers: Customer[];
}> => {
  try {
    const response = await api.get(
      `${API_BASE_URL}/api/customers/upcoming_visits/`
    );
    return response.data;
  } catch (error) {
    console.error("API Error - getUpcomingVisits:", error);
    throw new Error("Failed to fetch customers with upcoming visits.");
  }
};

export const updateCustomerVisit = async (
  id: number
): Promise<{ message: string; last_visit: string; next_visit?: string }> => {
  try {
    const response = await api.post(
      `${API_BASE_URL}/api/customers/${id}/update_visit/`
    );
    return response.data;
  } catch (error: any) {
    console.error(`API Error - updateCustomerVisit(${id}):`, error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      `Failed to update visit for customer with ID ${id}.`;
    throw new Error(errorMessage);
  }
};

export const managePrescriptions = async (
  id: number,
  data: ManagePrescriptionsData
): Promise<{ message: string; total_prescriptions: number }> => {
  try {
    const response = await api.post(
      `${API_BASE_URL}/api/customers/${id}/manage_prescriptions/`,
      data
    );
    return response.data;
  } catch (error: any) {
    console.error(`API Error - managePrescriptions(${id}):`, error);
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      `Failed to manage prescriptions for customer with ID ${id}.`;
    throw new Error(errorMessage);
  }
};

export const getCustomerPrescriptions = async (
  id: number
): Promise<{
  customer: string;
  prescription_count: number;
  prescriptions: Product[];
  medication_notes?: string;
}> => {
  try {
    const response = await api.get(
      `${API_BASE_URL}/api/customers/${id}/prescriptions/`
    );
    return response.data;
  } catch (error) {
    console.error(`API Error - getCustomerPrescriptions(${id}):`, error);
    throw new Error(
      `Failed to fetch prescriptions for customer with ID ${id}.`
    );
  }
};

export const searchCustomers = async (params: {
  search?: string;
  is_active?: boolean;
}): Promise<Customer[]> => {
  try {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append("search", params.search);
    if (params.is_active !== undefined)
      queryParams.append("is_active", params.is_active.toString());

    const response = await api.get(
      `${API_BASE_URL}/api/customers/?${queryParams.toString()}`
    );
    return Array.isArray(response.data)
      ? response.data
      : response.data.results || [];
  } catch (error) {
    console.error("API Error - searchCustomers:", error);
    throw new Error("Failed to search customers.");
  }
};

export type {
  Customer,
  Product,
  Shop,
  CreateCustomerData,
  UpdateCustomerData,
  ManagePrescriptionsData,
};
