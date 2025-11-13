// utilities/index.ts
import { NextRequest, NextResponse } from "next/server";
import api from "../auth";
import {
  Utility,
  UtilityCreateRequest,
  UtilityUpdateRequest,
  UtilityResponse,
  UtilityFilters,
  BulkUtilityCreateRequest,
  BulkUtilityCreateResponse,
  AvailableInventoryResponse,
  UtilityStats,
  LowStockAlertsResponse,
  RestoreInventoryResponse,
  InventoryUsageLog,
  PaginationParams,
  PaginatedResponse,
  SourceType,
  UtilityType,
} from "@/types/utility/utilities";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://pharmasys.sirnkunja.co.ke/";
const UTILITY_API_URL = `${API_BASE_URL}api/utilities/`;
const INVENTORY_USAGE_LOG_API_URL = `${API_BASE_URL}api/inventory-usage-logs/`;

// Core API functions for Utilities
export const getUtilities = async (
  params?: UtilityFilters & PaginationParams
) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.page_size)
      queryParams.append("page_size", params.page_size.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.utility_type)
      queryParams.append("utility_type", params.utility_type);
    if (params?.source_type)
      queryParams.append("source_type", params.source_type);
    if (params?.user) queryParams.append("user", params.user.toString());
    if (params?.shop) queryParams.append("shop", params.shop.toString());
    if (params?.inventory_item)
      queryParams.append("inventory_item", params.inventory_item.toString());
    if (params?.inventory_deducted !== undefined)
      queryParams.append(
        "inventory_deducted",
        params.inventory_deducted.toString()
      );
    if (params?.start_date) queryParams.append("start_date", params.start_date);
    if (params?.end_date) queryParams.append("end_date", params.end_date);
    if (params?.min_amount)
      queryParams.append("min_amount", params.min_amount.toString());
    if (params?.max_amount)
      queryParams.append("max_amount", params.max_amount.toString());
    if (params?.inventory_only) queryParams.append("inventory_only", "true");
    if (params?.my_utilities) queryParams.append("my_utilities", "true");
    if (params?.ordering) queryParams.append("ordering", params.ordering);

    const url = queryParams.toString()
      ? `${UTILITY_API_URL}?${queryParams.toString()}`
      : UTILITY_API_URL;
    const response = await api.get<UtilityResponse>(url);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch utilities.");
  }
};

export const getUtilityById = async (utilityId: number) => {
  try {
    const response = await api.get<Utility>(`${UTILITY_API_URL}${utilityId}/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch utility.");
  }
};

export const createUtility = async (utilityData: UtilityCreateRequest) => {
  try {
    const response = await api.post<Utility>(UTILITY_API_URL, utilityData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create utility.");
  }
};

export const updateUtility = async (
  utilityId: number,
  utilityData: UtilityUpdateRequest
) => {
  try {
    const response = await api.put<Utility>(
      `${UTILITY_API_URL}${utilityId}/`,
      utilityData
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to update utility.");
  }
};

export const partialUpdateUtility = async (
  utilityId: number,
  utilityData: Partial<UtilityUpdateRequest>
) => {
  try {
    const response = await api.patch<Utility>(
      `${UTILITY_API_URL}${utilityId}/`,
      utilityData
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to update utility.");
  }
};

export const deleteUtility = async (utilityId: number) => {
  try {
    const response = await api.delete(`${UTILITY_API_URL}${utilityId}/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete utility.");
  }
};

export const getAvailableInventory = async (params?: {
  shop_id?: number;
  search?: string;
  low_stock_only?: boolean;
  expiring_soon?: boolean;
}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.shop_id)
      queryParams.append("shop_id", params.shop_id.toString());
    if (params?.search) queryParams.append("search", params.search);
    if (params?.low_stock_only) queryParams.append("low_stock_only", "true");
    if (params?.expiring_soon) queryParams.append("expiring_soon", "true");

    const url = queryParams.toString()
      ? `${UTILITY_API_URL}available_inventory/?${queryParams.toString()}`
      : `${UTILITY_API_URL}available_inventory/`;
    const response = await api.get<AvailableInventoryResponse>(url);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch available inventory.");
  }
};

export const getUtilityStatistics = async (params?: {
  start_date?: string;
  end_date?: string;
  user_id?: number;
  shop_id?: number;
}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.start_date) queryParams.append("start_date", params.start_date);
    if (params?.end_date) queryParams.append("end_date", params.end_date);
    if (params?.user_id)
      queryParams.append("user_id", params.user_id.toString());
    if (params?.shop_id)
      queryParams.append("shop_id", params.shop_id.toString());

    const url = queryParams.toString()
      ? `${UTILITY_API_URL}statistics/?${queryParams.toString()}`
      : `${UTILITY_API_URL}statistics/`;
    const response = await api.get<UtilityStats>(url);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch utility statistics.");
  }
};

export const getMyUtilities = async (params?: PaginationParams) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.page_size)
      queryParams.append("page_size", params.page_size.toString());

    const url = queryParams.toString()
      ? `${UTILITY_API_URL}my_utilities/?${queryParams.toString()}`
      : `${UTILITY_API_URL}my_utilities/`;
    const response = await api.get<UtilityResponse>(url);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch my utilities.");
  }
};

export const getLowStockAlerts = async (params?: { shop_id?: number }) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.shop_id)
      queryParams.append("shop_id", params.shop_id.toString());

    const url = queryParams.toString()
      ? `${UTILITY_API_URL}low_stock_alerts/?${queryParams.toString()}`
      : `${UTILITY_API_URL}low_stock_alerts/`;
    const response = await api.get<LowStockAlertsResponse>(url);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch low stock alerts.");
  }
};

export const bulkCreateUtilities = async (
  bulkData: BulkUtilityCreateRequest
) => {
  try {
    const response = await api.post<BulkUtilityCreateResponse>(
      `${UTILITY_API_URL}bulk_create/`,
      bulkData
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to bulk create utilities.");
  }
};

export const restoreInventory = async (utilityId: number) => {
  try {
    const response = await api.post<RestoreInventoryResponse>(
      `${UTILITY_API_URL}${utilityId}/restore_inventory/`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to restore inventory.");
  }
};

// Core API functions for Inventory Usage Logs
export const getInventoryUsageLogs = async (params?: {
  utility_id?: number;
  inventory_id?: number;
  page?: number;
  page_size?: number;
}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.utility_id)
      queryParams.append("utility_id", params.utility_id.toString());
    if (params?.inventory_id)
      queryParams.append("inventory_id", params.inventory_id.toString());
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.page_size)
      queryParams.append("page_size", params.page_size.toString());

    const url = queryParams.toString()
      ? `${INVENTORY_USAGE_LOG_API_URL}?${queryParams.toString()}`
      : INVENTORY_USAGE_LOG_API_URL;
    const response = await api.get<PaginatedResponse<InventoryUsageLog>>(url);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch inventory usage logs.");
  }
};

// API Route Handlers
export async function GET(request: NextRequest) {
  try {
    const { pathname, searchParams } = new URL(request.url);
    const segments = pathname.split("/");

    // Handle specific utility ID
    const utilityId = segments[segments.length - 1];
    if (utilityId && utilityId !== "utilities" && !isNaN(Number(utilityId))) {
      const utility = await getUtilityById(Number(utilityId));
      return NextResponse.json(utility);
    }

    // Handle custom actions
    if (pathname.includes("available_inventory")) {
      const shop_id = searchParams.get("shop_id")
        ? Number(searchParams.get("shop_id"))
        : undefined;
      const search = searchParams.get("search") || undefined;
      const low_stock_only = searchParams.get("low_stock_only") === "true";
      const expiring_soon = searchParams.get("expiring_soon") === "true";
      const inventory = await getAvailableInventory({
        shop_id,
        search,
        low_stock_only,
        expiring_soon,
      });
      return NextResponse.json(inventory);
    }

    if (pathname.includes("statistics")) {
      const start_date = searchParams.get("start_date") || undefined;
      const end_date = searchParams.get("end_date") || undefined;
      const user_id = searchParams.get("user_id")
        ? Number(searchParams.get("user_id"))
        : undefined;
      const shop_id = searchParams.get("shop_id")
        ? Number(searchParams.get("shop_id"))
        : undefined;
      const stats = await getUtilityStatistics({
        start_date,
        end_date,
        user_id,
        shop_id,
      });
      return NextResponse.json(stats);
    }

    if (pathname.includes("my_utilities")) {
      const page = searchParams.get("page")
        ? Number(searchParams.get("page"))
        : undefined;
      const page_size = searchParams.get("page_size")
        ? Number(searchParams.get("page_size"))
        : undefined;
      const utilities = await getMyUtilities({ page, page_size });
      return NextResponse.json(utilities);
    }

    if (pathname.includes("low_stock_alerts")) {
      const shop_id = searchParams.get("shop_id")
        ? Number(searchParams.get("shop_id"))
        : undefined;
      const alerts = await getLowStockAlerts({ shop_id });
      return NextResponse.json(alerts);
    }

    // Handle general utilities list with filters
    const filters: UtilityFilters & PaginationParams = {
      page: searchParams.get("page")
        ? Number(searchParams.get("page"))
        : undefined,
      page_size: searchParams.get("page_size")
        ? Number(searchParams.get("page_size"))
        : undefined,
      search: searchParams.get("search") || undefined,
      utility_type:
        (searchParams.get("utility_type") as UtilityType) || undefined,
      source_type: (searchParams.get("source_type") as SourceType) || undefined,
      user: searchParams.get("user")
        ? Number(searchParams.get("user"))
        : undefined,
      shop: searchParams.get("shop")
        ? Number(searchParams.get("shop"))
        : undefined,
      inventory_item: searchParams.get("inventory_item")
        ? Number(searchParams.get("inventory_item"))
        : undefined,
      inventory_deducted:
        searchParams.get("inventory_deducted") === "true" ? true : undefined,
      start_date: searchParams.get("start_date") || undefined,
      end_date: searchParams.get("end_date") || undefined,
      min_amount: searchParams.get("min_amount")
        ? Number(searchParams.get("min_amount"))
        : undefined,
      max_amount: searchParams.get("max_amount")
        ? Number(searchParams.get("max_amount"))
        : undefined,
      inventory_only: searchParams.get("inventory_only") === "true",
      my_utilities: searchParams.get("my_utilities") === "true",
      ordering: searchParams.get("ordering") || undefined,
    };

    const utilities = await getUtilities(filters);
    return NextResponse.json(utilities);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch utilities" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { pathname } = new URL(request.url);

    if (pathname.includes("bulk_create")) {
      const body = await request.json();
      const utilities = await bulkCreateUtilities(body);
      return NextResponse.json(utilities, { status: 201 });
    }

    const body = await request.json();
    const utility = await createUtility(body);
    return NextResponse.json(utility, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create utility" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...utilityData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Utility ID is required" },
        { status: 400 }
      );
    }

    const utility = await updateUtility(id, utilityData);
    return NextResponse.json(utility);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update utility" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...utilityData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Utility ID is required" },
        { status: 400 }
      );
    }

    const utility = await partialUpdateUtility(id, utilityData);
    return NextResponse.json(utility);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update utility" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Utility ID is required" },
        { status: 400 }
      );
    }

    await deleteUtility(Number(id));
    return NextResponse.json({ message: "Utility deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete utility" },
      { status: 500 }
    );
  }
}

export async function POST_restoreInventory(request: NextRequest) {
  try {
    const { pathname } = new URL(request.url);
    const segments = pathname.split("/");
    const utilityId = segments[segments.length - 2];

    if (!utilityId || isNaN(Number(utilityId))) {
      return NextResponse.json(
        { error: "Utility ID is required" },
        { status: 400 }
      );
    }

    const response = await restoreInventory(Number(utilityId));
    return NextResponse.json(response);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to restore inventory" },
      { status: 500 }
    );
  }
}
