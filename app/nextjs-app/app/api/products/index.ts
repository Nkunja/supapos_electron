import { NextRequest, NextResponse } from 'next/server';
import api from '../auth';
import { CreateProductData, UpdateProductData } from '@/types/product';

export interface Product {
  id: number;
  name: string;
  generic_name: string;
  category: number;
  category_name: string;
  shop: number;
  shop_name: string;
  barcode: string;
  description: string;
  manufacturer: string;
  user_type: string;
  user_type_display: string;
  drug_type: string;
  drug_type_display: string;
  requires_prescription: boolean;
  is_active: boolean;
  form: string;
  form_display: string;
  unit_of_measurement: string;
  unit_display: string;
  items_per_pack: number;
  pack_size: string;
  full_description: string;
  inventory_count: number;
  total_stock_units: number;
  total_stock_value: number;
  batch_number?: string;
  cost_price?: number;
  selling_price?: number;
  units_in_stock?: number;
  packs_in_stock?: number;
  expiry_date?: string;
  created_at: string;
  updated_at: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ||  'https://pharmasys.sirnkunja.co.ke/';


const API_URL = `${API_BASE_URL}api/products/`;

// Core API functions
export const getProducts = async (params?: {
  page?: string;
  search?: string;
  category?: string;
  is_active?: string;
}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append("page", params.page);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.category) queryParams.append("category", params.category);
    if (params?.is_active) queryParams.append("is_active", params.is_active);

    const url = queryParams.toString()
      ? `${API_URL}?${queryParams.toString()}`
      : API_URL;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch products.");
  }
};

export const getProductById = async (productId: number) => {
  try {
    const response = await api.get(`${API_URL}${productId}/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch product.");
  }
};

export const createProduct = async (productData: CreateProductData) => {
  try {
    const response = await api.post(API_URL, productData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create product.");
  }
};

export const updateProduct = async (
  productId: number,
  productData: UpdateProductData
) => {
  try {
    const response = await api.put(`${API_URL}${productId}/`, productData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to update product.");
  }
};

export const partialUpdateProduct = async (
  productId: number,
  productData: Partial<UpdateProductData>
) => {
  try {
    const response = await api.patch(`${API_URL}${productId}/`, productData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to update product.");
  }
};

export const deleteProduct = async (productId: number) => {
  try {
    const response = await api.delete(`${API_URL}${productId}/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete product.");
  }
};

// API Route Handlers
export async function GET(request: NextRequest) {
  try {
    const { pathname, searchParams } = new URL(request.url);
    const segments = pathname.split("/");

    // Check for specific product ID
    const productId = segments[segments.length - 1];
    if (productId && productId !== "products" && !isNaN(Number(productId))) {
      const product = await getProductById(Number(productId));
      return NextResponse.json(product);
    }

    // Get query parameters
    const page = searchParams.get("page") || undefined;
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const isActive = searchParams.get("is_active") || undefined;

    // Get all products with filters
    const products = await getProducts({
      page,
      search,
      category,
      is_active: isActive,
    });
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const product = await createProduct(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...productData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await updateProduct(id, productData);
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...productData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const product = await partialUpdateProduct(id, productData);
    return NextResponse.json(product);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update product" },
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
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    await deleteProduct(Number(id));
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}
