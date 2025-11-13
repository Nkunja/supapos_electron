import { NextRequest, NextResponse } from "next/server";
import api from "../auth";

export interface Salesperson {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  is_active: boolean;
}

export interface Shop {
  id: number;
  name: string;
  address: string;
  phone_number: string;
  is_active: boolean;
  salespersons: number[];
  salespersons_data: Salesperson[];
  salesperson_names: string;
  salespersons_count: number;
  created_at: string;
  updated_at: string;
  location: string;
}

export interface ShopDetail extends Shop {
  active_salespersons_count: number;
  total_products: number;
  low_stock_alerts: number;
}

export interface ShopsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Shop[];
}

export interface CreateShopData {
  name: string;
  address: string;
  phone_number: string;
  is_active?: boolean;
  salespersons?: number[]; // Array of salesperson IDs
}

export interface UpdateShopData {
  name?: string;
  address?: string;
  phone_number?: string;
  is_active?: boolean;
  salespersons?: number[];
}

// New interfaces for salesperson management
export interface AssignSalespersonData {
  salesperson_id: number;
}

export interface RemoveSalespersonData {
  salesperson_id: number;
}

export interface SalespersonsListResponse {
  shop_name: string;
  salespersons_count: number;
  salespersons: Salesperson[];
}

export interface MyShopsResponse {
  shops_count: number;
  shops: Shop[];
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://pharmasys.sirnkunja.co.ke/";
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pharmacy-suite.onrender.com/';

const API_URL = `${API_BASE_URL}api/shops/`;

export const getShops = async () => {
  try {
    const response = await api.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch shops.");
  }
};

export const getShopTotalCashSpent = async (
  shopId: number
): Promise<{ total_utility_cash_spent: number }> => {
  try {
    const response = await api.get(`${API_URL}${shopId}/total_cash_spent/`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch shop total cash spent:", error);
    throw new Error("Failed to fetch shop total cash spent.");
  }
};

export const getActiveShops = async () => {
  try {
    const response = await api.get(`${API_URL}active_shops/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch active shops.");
  }
};

// Updated: Now returns multiple shops for salesperson
export const getMyShops = async (): Promise<MyShopsResponse> => {
  try {
    const response = await api.get(`${API_URL}my_shops/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch my shops.");
  }
};

export const getShopById = async (shopId: number): Promise<ShopDetail> => {
  try {
    const response = await api.get(`${API_URL}${shopId}/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch shop.");
  }
};

export const createShop = async (shopData: CreateShopData) => {
  try {
    const response = await api.post(API_URL, shopData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create shop.");
  }
};

export const updateShop = async (shopId: number, shopData: UpdateShopData) => {
  try {
    const response = await api.put(`${API_URL}${shopId}/`, shopData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to update shop.");
  }
};

export const partialUpdateShop = async (
  shopId: number,
  shopData: Partial<UpdateShopData>
) => {
  try {
    const response = await api.patch(`${API_URL}${shopId}/`, shopData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to update shop.");
  }
};

export const deleteShop = async (shopId: number) => {
  try {
    const response = await api.delete(`${API_URL}${shopId}/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete shop.");
  }
};

export const assignSalesperson = async (
  shopId: number,
  assignmentData: AssignSalespersonData
) => {
  try {
    const response = await api.post(
      `${API_URL}${shopId}/assign_salesperson/`,
      assignmentData
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to assign salesperson.");
  }
};

export const removeSalesperson = async (
  shopId: number,
  removalData: RemoveSalespersonData
) => {
  try {
    const response = await api.post(
      `${API_URL}${shopId}/remove_salesperson/`,
      removalData
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to remove salesperson.");
  }
};

// New function to get all salespersons for a shop
export const getShopSalespersons = async (
  shopId: number
): Promise<SalespersonsListResponse> => {
  try {
    const response = await api.get(`${API_URL}${shopId}/salespersons_list/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch shop salespersons.");
  }
};

// Get inventory summary for a shop
export const getShopInventorySummary = async (shopId: number) => {
  try {
    const response = await api.get(`${API_URL}${shopId}/inventory_summary/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch inventory summary.");
  }
};

// Get sales summary for a shop
export const getShopSalesSummary = async (
  shopId: number,
  days: number = 30
) => {
  try {
    const response = await api.get(
      `${API_URL}${shopId}/sales_summary/?days=${days}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch sales summary.");
  }
};

// API Route Handlers
export async function GET(request: NextRequest) {
  try {
    const { pathname, searchParams } = new URL(request.url);
    const segments = pathname.split("/");

    // Check for special endpoints
    if (pathname.includes("/active_shops")) {
      const activeShops = await getActiveShops();
      return NextResponse.json(activeShops);
    }

    // Updated: my_shops instead of my_shop
    if (pathname.includes("/my_shops")) {
      const myShops = await getMyShops();
      return NextResponse.json(myShops);
    }

    // Check for salespersons list endpoint
    if (pathname.includes("/salespersons_list")) {
      const shopId = segments[segments.indexOf("shops") + 1];
      if (!shopId || isNaN(Number(shopId))) {
        return NextResponse.json(
          { error: "Valid shop ID is required" },
          { status: 400 }
        );
      }
      const salespersons = await getShopSalespersons(Number(shopId));
      return NextResponse.json(salespersons);
    }

    // Check for inventory summary endpoint
    if (pathname.includes("/inventory_summary")) {
      const shopId = segments[segments.indexOf("shops") + 1];
      if (!shopId || isNaN(Number(shopId))) {
        return NextResponse.json(
          { error: "Valid shop ID is required" },
          { status: 400 }
        );
      }
      const summary = await getShopInventorySummary(Number(shopId));
      return NextResponse.json(summary);
    }

    // Check for sales summary endpoint
    if (pathname.includes("/sales_summary")) {
      const shopId = segments[segments.indexOf("shops") + 1];
      if (!shopId || isNaN(Number(shopId))) {
        return NextResponse.json(
          { error: "Valid shop ID is required" },
          { status: 400 }
        );
      }
      const days = searchParams.get("days")
        ? Number(searchParams.get("days"))
        : 30;
      const summary = await getShopSalesSummary(Number(shopId), days);
      return NextResponse.json(summary);
    }

    // Check for specific shop ID
    const shopId = segments[segments.length - 1];
    if (shopId && shopId !== "shops" && !isNaN(Number(shopId))) {
      const shop = await getShopById(Number(shopId));
      return NextResponse.json(shop);
    }

    // Get all shops
    const shops = await getShops();
    return NextResponse.json(shops);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch shops" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { pathname } = new URL(request.url);
    const body = await request.json();

    // Handle salesperson assignment
    if (pathname.includes("/assign_salesperson")) {
      const segments = pathname.split("/");
      const shopId = segments[segments.indexOf("shops") + 1];

      if (!shopId || isNaN(Number(shopId))) {
        return NextResponse.json(
          { error: "Valid shop ID is required for salesperson assignment" },
          { status: 400 }
        );
      }

      const result = await assignSalesperson(Number(shopId), body);
      return NextResponse.json(result, { status: 200 });
    }

    // Handle salesperson removal
    if (pathname.includes("/remove_salesperson")) {
      const segments = pathname.split("/");
      const shopId = segments[segments.indexOf("shops") + 1];

      if (!shopId || isNaN(Number(shopId))) {
        return NextResponse.json(
          { error: "Valid shop ID is required for salesperson removal" },
          { status: 400 }
        );
      }

      const result = await removeSalesperson(Number(shopId), body);
      return NextResponse.json(result, { status: 200 });
    }

    // Regular shop creation
    const shop = await createShop(body);
    return NextResponse.json(shop, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create shop or manage salesperson" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...shopData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Shop ID is required" },
        { status: 400 }
      );
    }

    const shop = await updateShop(id, shopData);
    return NextResponse.json(shop);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update shop" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...shopData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Shop ID is required" },
        { status: 400 }
      );
    }

    const shop = await partialUpdateShop(id, shopData);
    return NextResponse.json(shop);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update shop" },
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
        { error: "Shop ID is required" },
        { status: 400 }
      );
    }

    await deleteShop(Number(id));
    return NextResponse.json({ message: "Shop deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete shop" },
      { status: 500 }
    );
  }
}
