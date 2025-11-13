import api from "../../auth";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pharmasys.sirnkunja.co.ke/';
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pharmacy-suite.onrender.com/';

// const API_BASE_URL = 'http://127.0.0.1:8000/';
const API_URL = `${API_BASE_URL}api/auth/register/`;

export const register = async (userData: {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  role: string;
  password: string;
}) => {
  try {
    const cleanUserData = {
      first_name: userData.first_name?.trim(),
      last_name: userData.last_name?.trim(),
      email: userData.email?.trim().toLowerCase(),
      phone: userData.phone?.trim() || null,
      role: userData.role,
      password: userData.password
    };

    const response = await api.post(API_URL, cleanUserData);
    
    return {
      success: true,
      message: `User ${userData.first_name} ${userData.last_name} registered successfully!`,
      user: {
        id: response.data.user?.id,
        first_name: response.data.user?.first_name,
        last_name: response.data.user?.last_name,
        email: response.data.user?.email,
        role: response.data.user?.role,
        phone: response.data.user?.phone,
      }
    };

  } catch (apiError: any) {
    const errorResponse = apiError.response;
    
    if (!errorResponse) {
      throw new Error('Network error. Please check your connection.');
    }

    const data = errorResponse.data;

    throw new Error(data.detail || data.message || 'Registration failed');
  }
};