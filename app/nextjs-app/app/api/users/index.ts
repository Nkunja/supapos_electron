import { NextRequest, NextResponse } from 'next/server';
import api from '../auth';

export interface User {
  id: number
  email: string
  first_name: string
  last_name: string
  full_name: string
  role: string
  phone_number: string
  is_active: boolean
  is_staff: boolean
  date_joined: string
  assigned_shop: string
  created_at: string
  updated_at: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pharmasys.sirnkunja.co.ke/';
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pharmacy-suite.onrender.com/';

// const API_BASE_URL = 'http://127.0.0.1:8000/';
const API_URL = `${API_BASE_URL}api/users/`;

export const getUsers = async () => {
  try {
    const response = await api.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch users.");
  }
};

export const getUserById = async (userId: number) => {
  try {
    const response = await api.get(`${API_URL}${userId}/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch user.");
  }
};

export const createUser = async (userData: any) => {
  try {
    const response = await api.post(API_URL, userData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create user.");
  }
};

export const updateUser = async (userId: number, userData: any) => {
  try {
    const response = await api.put(`${API_URL}${userId}/`, userData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to update user.");
  }
};

export const deleteUser = async (userId: number) => {
  try {
    const response = await api.delete(`${API_URL}${userId}/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete user.");
  }
};

// API Route Handlers
export async function GET(request: NextRequest) {
  try {
    const { pathname } = new URL(request.url);
    const segments = pathname.split('/');
    const userId = segments[segments.length - 1];

    if (userId && userId !== 'users' && !isNaN(Number(userId))) {
      const user = await getUserById(Number(userId));
      return NextResponse.json(user);
    }

    const users = await getUsers();
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userData = await request.json();
    const user = await createUser(userData);
    return NextResponse.json(user, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...userData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = await updateUser(id, userData);
    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update user' },
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
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    await deleteUser(Number(id));
    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete user' },
      { status: 500 }
    );
  }
}