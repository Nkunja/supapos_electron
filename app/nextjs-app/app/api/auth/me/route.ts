import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_BASE_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_BASE_URL;
// const API_BASE_URL = 'http://127.0.0.1:8000/api';

const backendApi = (accessToken?: string) => {
  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
  });

  return api;
};

// GET - Get current user info
export async function GET(request: NextRequest) {
  try {
    const accessToken = request.cookies.get('access_token')?.value;
    
    if (!accessToken) {
      return NextResponse.json(
        { 
          message: 'Not authenticated', 
          user: null,
          isAuthenticated: false 
        },
        { status: 401 }
      );
    }

    // Use authenticated API instance to get current user
    const api = backendApi(accessToken);
    const response = await api.get('/users/me/');

    return NextResponse.json({
      message: 'User data retrieved successfully',
      user: response.data,
      isAuthenticated: true,
    });

  } catch (error: any) {
    console.error('Get user error:', error.response?.data || error.message);
    
    // If token is invalid, try to refresh
    if (error.response?.status === 401) {
      return NextResponse.json(
        { 
          message: 'Authentication failed',
          user: null,
          isAuthenticated: false,
          error: 'Token expired or invalid'
        },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { 
        message: 'Failed to get user data',
        user: null,
        isAuthenticated: false,
        error: error.response?.data?.message || 'Unknown error'
      },
      { status: error.response?.status || 500 }
    );
  }
}