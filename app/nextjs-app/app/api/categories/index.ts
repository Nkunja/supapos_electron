import { NextRequest, NextResponse } from 'next/server';
import api from '../auth';

export interface Category {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CategoriesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Category[];
}

export interface CreateCategoryData {
  name: string;
  description: string;
  is_active?: boolean;
}

export interface UpdateCategoryData {
  name?: string;
  description?: string;
  is_active?: boolean;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ||  'https://pharmasys.sirnkunja.co.ke/';
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pharmacy-suite.onrender.com/';
const API_URL = `${API_BASE_URL}api/categories/`;

// Core API functions
export const getCategories = async (params?: {
  page?: string;
  search?: string;
  is_active?: string;
}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.is_active) queryParams.append('is_active', params.is_active);

    const url = queryParams.toString() ? `${API_URL}?${queryParams.toString()}` : API_URL;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch categories.");
  }
};

export const getCategoryById = async (categoryId: number) => {
  try {
    const response = await api.get(`${API_URL}${categoryId}/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch category.");
  }
};

export const createCategory = async (categoryData: CreateCategoryData) => {
  try {
    const response = await api.post(API_URL, categoryData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create category.");
  }
};

export const updateCategory = async (categoryId: number, categoryData: UpdateCategoryData) => {
  try {
    const response = await api.put(`${API_URL}${categoryId}/`, categoryData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to update category.");
  }
};

export const partialUpdateCategory = async (categoryId: number, categoryData: Partial<UpdateCategoryData>) => {
  try {
    const response = await api.patch(`${API_URL}${categoryId}/`, categoryData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to update category.");
  }
};

export const deleteCategory = async (categoryId: number) => {
  try {
    const response = await api.delete(`${API_URL}${categoryId}/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete category.");
  }
};

// API Route Handlers
export async function GET(request: NextRequest) {
  try {
    const { pathname, searchParams } = new URL(request.url);
    const segments = pathname.split('/');
    
    // Check for specific category ID
    const categoryId = segments[segments.length - 1];
    if (categoryId && categoryId !== 'categories' && !isNaN(Number(categoryId))) {
      const category = await getCategoryById(Number(categoryId));
      return NextResponse.json(category);
    }

    // Get query parameters
    const page = searchParams.get('page') || undefined;
    const search = searchParams.get('search') || undefined;
    const isActive = searchParams.get('is_active') || undefined;

    // Get all categories with filters
    const categories = await getCategories({ page, search, is_active: isActive });
    return NextResponse.json(categories);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const category = await createCategory(body);
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create category' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...categoryData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    const category = await updateCategory(id, categoryData);
    return NextResponse.json(category);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...categoryData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    const category = await partialUpdateCategory(id, categoryData);
    return NextResponse.json(category);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    await deleteCategory(Number(id));
    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete category' },
      { status: 500 }
    );
  }
} 