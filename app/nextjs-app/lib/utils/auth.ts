// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';
// import { useState, useEffect } from 'react';

// // Types
// interface DecodedToken {
//   exp: number;
//   user_id: string;
//   [key: string]: any;
// }

// export interface AuthResponse {
//   message: string;
//   isAuthenticated: boolean;
//   user?: {
//     id: number;
//     email: string;
//     first_name: string;
//     last_name: string;
//     full_name: string;
//     role: string;
//     phone_number: string;
//     is_active: boolean;
//     is_staff: boolean;
//     date_joined: string;
//     assigned_shop: string;
//     created_at: string;
//     updated_at: string;
//   };
//   token?: string;
//   error?: string;
// }

// export interface User {
//   id: number;
//   email: string;
//   first_name: string;
//   last_name: string;
//   full_name: string;
//   role: string;
//   phone_number: string;
//   is_active: boolean;
//   is_staff: boolean;
//   date_joined: string;
//   assigned_shop: string;
//   created_at: string;
//   updated_at: string;
// }

// // Create API instance for frontend calls to your Next.js API routes
// const api = axios.create({
//   baseURL: '/api',
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Token validation
// const isTokenValid = (token: string | null): boolean => {
//   if (!token) return false;
  
//   try {
//     const decoded = jwtDecode<DecodedToken>(token);
//     return decoded.exp * 1000 > Date.now();
//   } catch (error) {
//     return false;
//   }
// };

// // API functions
// export const checkAuthStatus = async (): Promise<AuthResponse> => {
//   try {
//     const response = await api.get('/auth');
//     return response.data;
//   } catch (error: any) {
//     return {
//       message: error.response?.data?.message || 'Not authenticated',
//       isAuthenticated: false,
//       error: error.response?.data?.error,
//     };
//   }
// };

// export const login = async (email: string, password: string): Promise<AuthResponse> => {
//   try {
//     const response = await api.post('/auth', {
//       action: 'login',
//       email,
//       password,
//     });

//     return response.data;
//   } catch (error: any) {
//     throw new Error(error.response?.data?.message || 'Login failed');
//   }
// };

// export const logout = async (): Promise<AuthResponse> => {
//   try {
//     const response = await api.post('/auth', {
//       action: 'logout',
//     });

//     return response.data;
//   } catch (error: any) {
//     // Even if logout fails, consider it successful for frontend
//     return {
//       message: 'Logged out',
//       isAuthenticated: false,
//     };
//   }
// };

// export const refreshToken = async (): Promise<AuthResponse> => {
//   try {
//     const response = await api.post('/auth', {
//       action: 'refresh',
//     });

//     return response.data;
//   } catch (error: any) {
//     return {
//       message: error.response?.data?.message || 'Token refresh failed',
//       isAuthenticated: false,
//       error: error.response?.data?.error,
//     };
//   }
// };

// // Check if user is authenticated (client-side check only)
// export const isAuthenticated = async (): Promise<boolean> => {
//   try {
//     const authStatus = await checkAuthStatus();
//     return authStatus.isAuthenticated;
//   } catch (error) {
//     return false;
//   }
// };

// // Custom hook for authentication
// export const useAuth = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [token, setToken] = useState<string | null>(null);

//   // Check authentication status on mount and when needed
//   const checkAuth = async () => {
//     try {
//       setIsLoading(true);
//       const authStatus = await checkAuthStatus();
      
//       setIsAuthenticated(authStatus.isAuthenticated);
//       setUser(authStatus.user || null);
//       setToken(authStatus.token || null);
      
//       return authStatus.isAuthenticated;
//     } catch (error) {
//       setIsAuthenticated(false);
//       setUser(null);
//       setToken(null);
//       return false;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Login function for React components
//   const handleLogin = async (email: string, password: string) => {
//     try {
//       setIsLoading(true);
//       const response = await login(email, password);
      
//       if (response.isAuthenticated) {
//         setIsAuthenticated(true);
//         setUser(response.user || null);
//         setToken(response.token || null);
//       }
      
//       return response;
//     } catch (error) {
//       setIsAuthenticated(false);
//       setUser(null);
//       setToken(null);
//       throw error;
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Logout function for React components
//   const handleLogout = async () => {
//     try {
//       setIsLoading(true);
//       await logout();
//     } catch (error) {
//       console.warn('Logout error:', error);
//     } finally {
//       setIsAuthenticated(false);
//       setUser(null);
//       setToken(null);
//       setIsLoading(false);
//     }
//   };

//   // Refresh authentication
//   const handleRefresh = async () => {
//     try {
//       const response = await refreshToken();
      
//       if (response.isAuthenticated) {
//         // Re-check auth status to get updated user info
//         await checkAuth();
//         return true;
//       } else {
//         setIsAuthenticated(false);
//         setUser(null);
//         setToken(null);
//         return false;
//       }
//     } catch (error) {
//       setIsAuthenticated(false);
//       setUser(null);
//       setToken(null);
//       return false;
//     }
//   };

//   // Initialize authentication on mount
//   useEffect(() => {
//     checkAuth();
//   }, []);

//   // Periodic token refresh (every 30 minutes)
//   useEffect(() => {
//     if (!isAuthenticated) return;

//     const interval = setInterval(async () => {
//       if (token && !isTokenValid(token)) {
//         await handleRefresh();
//       }
//     }, 30 * 60 * 1000); // 30 minutes

//     return () => clearInterval(interval);
//   }, [isAuthenticated, token]);

//   return {
//     user,
//     isAuthenticated,
//     isLoading,
//     token,
//     login: handleLogin,
//     logout: handleLogout,
//     checkAuth,
//     refreshAuth: handleRefresh,
//   };
// };

// // Create an authenticated API instance for making requests to your backend
// export const createAuthenticatedApi = () => {
//   const authApi = axios.create({
//     baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
//     headers: {
//       'Content-Type': 'application/json',
//     },
//   });

//   // Request interceptor to add token from cookies (handled by browser)
//   authApi.interceptors.request.use(
//     async (config) => {
//       return config;
//     },
//     (error) => {
//       return Promise.reject(error);
//     }
//   );

//   // Response interceptor to handle 401 errors
//   authApi.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//       if (error.response?.status === 401) {
//         // Try to refresh token through your API route
//         try {
//           await refreshToken();
//           // Retry the original request
//           return authApi(error.config);
//         } catch (refreshError) {
//           // Refresh failed, redirect to login
//           if (typeof window !== 'undefined') {
//             window.location.href = '/auth/login';
//           }
//         }
//       }
//       return Promise.reject(error);
//     }
//   );

//   return authApi;
// };

// export default api;