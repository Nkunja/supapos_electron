// 'use client'
// import axios from 'axios';
// import { jwtDecode } from 'jwt-decode';
// import { useState, useEffect, useRef } from 'react';
// import { useRouter } from 'next/navigation';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ;
// const API_URL = `${API_BASE_URL}api`;

// const api = axios.create({
//   baseURL: API_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   timeout: 5000,
// });

// interface DecodedToken {
//   exp: number;
//   user_id: string;
//   [key: string]: any;
// }

// interface AuthResponse {
//   message: string;
//   user?: User;
//   tokens?: {
//     access: string;
//     refresh: string;
//   };
//   isAuthenticated?: boolean;
//   serverError?:boolean;
// }

// interface User {
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

// let accessToken: string | null = null;
// let refreshToken: string | null = null;
// let currentUser: User | null = null;
// let serverReachable: boolean = true;
// let lastServerCheck: number = 0;

// const setCookie = (name: string, value: string, seconds: number) => {
//   if (typeof document !== 'undefined') {
//     const expires = new Date(Date.now() + seconds * 1000).toUTCString();
//     document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; secure; samesite=strict;`;
//   }
// };

// const getCookie = (name: string): string | null => {
//   if (typeof document !== 'undefined') {
//     const value = `; ${document.cookie}`;
//     const parts = value.split(`; ${name}=`);
//     if (parts.length === 2) {
//       return decodeURIComponent(parts.pop()?.split(';').shift() || '');
//     }
//   }
//   return null;
// };

// const removeCookie = (name: string) => {
//   if (typeof document !== 'undefined') {
//     document.cookie = `${name}=; Max-Age=-99999999; path=/;`;
//   }
// };

// const isTokenValid = (token: string | null): boolean => {
//   if (!token) return false;
//   try {
//     const decoded = jwtDecode<DecodedToken>(token);
//     return decoded.exp * 1000 > Date.now() + 10000; 
//   } catch (error) {
//     return false;
//   }
// };

// const loadTokensFromCookies = () => {
//   const cookieAccess = getCookie('access_token');
//   const cookieRefresh = getCookie('refresh_token');
//   const cookieUser = getCookie('user_info');
  
//   if (cookieAccess && isTokenValid(cookieAccess)) {
//     accessToken = cookieAccess;
//   }
  
//   if (cookieRefresh && isTokenValid(cookieRefresh)) {
//     refreshToken = cookieRefresh;
//   }
  
//   if (cookieUser) {
//     try {
//       currentUser = JSON.parse(cookieUser);
//     } catch (error) {
//       removeCookie('user_info');
//     }
//   }
// };

// const saveTokensAndUser = (access: string, refresh: string, user?: User) => {
//   accessToken = access;
//   refreshToken = refresh;
  
//   setCookie('access_token', access, 2 * 60 * 60); // 2 hours
//   setCookie('refresh_token', refresh, 7 * 24 * 60 * 60); // 7 days
  
//   if (user) {
//     currentUser = user;
//     setCookie('user_info', JSON.stringify(user), 7 * 24 * 60 * 60); // 7 days
//   }
// };

// const clearAuthData = () => {
//   accessToken = null;
//   refreshToken = null;
//   currentUser = null;
  
//   removeCookie('access_token');
//   removeCookie('refresh_token');
//   removeCookie('user_info');
// };

// const getRoleBasedRedirectUrl = (role: string): string => {
//   switch (role.toLowerCase()) {
//     case 'admin':
//       return '/admin';
//     case 'supervisor':
//       return '/supervisor';
//     case 'salesperson':
//       return '/sales';
//     default:
//       return '/sales';
//   }
// };

// if (typeof window !== 'undefined') {
//   loadTokensFromCookies();
// }

// export const fetchCurrentUser = async (): Promise<User | null> => {
//   if (!accessToken || !isTokenValid(accessToken)) {
//     return currentUser;
//   }
  
//   try {
//     const response = await api.get('/users/me/', {
//       headers: { Authorization: `Bearer ${accessToken}` },
//     });
    
//     serverReachable = true;
//     lastServerCheck = Date.now();
//     const user = response.data;
//     currentUser = user;
//     setCookie('user_info', JSON.stringify(user), 7 * 24 * 60 * 60);
//     return user;
//   } catch (error: any) {
//     if (error.code === 'ECONNABORTED' || 
//         error.code === 'ERR_NETWORK' ||
//         error.message.includes('timeout') ||
//         error.message.includes('Network Error') ||
//         !error.response) {
//       serverReachable = false;
//       lastServerCheck = Date.now();
//     }
    
//     return currentUser;
//   }
// };

// export const login = async (email: string, password: string): Promise<AuthResponse> => {
//   try {
//     const response = await api.post('/auth/login/', { email, password });
//     const data = response.data as AuthResponse;

//     serverReachable = true;
//     lastServerCheck = Date.now();

//     if (data.message === 'Login successful' && data.tokens) {
//       saveTokensAndUser(data.tokens.access, data.tokens.refresh, data.user);
//     }

//     return data;
//   } catch (error: any) {
//     if (error.code === 'ECONNABORTED' || 
//         error.code === 'ERR_NETWORK' ||
//         error.message.includes('timeout') ||
//         error.message.includes('Network Error') ||
//         !error.response) {
//       serverReachable = false;
//       lastServerCheck = Date.now();
      
//       return {
//         message: 'Server currently unreachable. Please check your connection and try again.',
//         isAuthenticated: false,
//         serverError: true,
//       };
//     }

//     return {
//       message: error.response?.data?.message || 'Login failed',
//       isAuthenticated: false,
//     };
//   }
// };

// export const logout = async () => {
//   try {
//     if (accessToken && serverReachable) {
//       await api.post('/auth/logout/', 
//         { refresh_token: refreshToken },
//         { headers: { Authorization: `Bearer ${accessToken}` } }
//       );
//     }
//   } catch (error: any) {
//     if (error.code === 'ECONNABORTED' || 
//         error.code === 'ERR_NETWORK' ||
//         error.message.includes('timeout') ||
//         !error.response) {
//       serverReachable = false;
//       lastServerCheck = Date.now();
//     }
//   } finally {
//     clearAuthData();
//     if (typeof window !== 'undefined') {
//       window.location.href = '/login';
//     }
//   }
// };

// export const isAuthenticated = (): boolean => {
//   return !!(accessToken && isTokenValid(accessToken));
// };

// export const getCurrentUser = (): User | null => {
//   return currentUser;
// };

// export const hasValidAuth = (): boolean => {
//   return isAuthenticated() && !!currentUser;
// };

// export const isServerReachable = (): boolean => {
//   return serverReachable;
// };

// export const getLastServerCheck = (): number => {
//   return lastServerCheck;
// };

// export const checkServerConnection = async (): Promise<boolean> => {
//   try {
//     const response = await axios.get(`${API_URL}/health/`, { 
//       timeout: 3000,
//       headers: { 'Content-Type': 'application/json' }
//     });
    
//     serverReachable = true;
//     lastServerCheck = Date.now();
//     return true;
//   } catch (error) {
//     serverReachable = false;
//     lastServerCheck = Date.now();
//     return false;
//   }
// };

// api.interceptors.request.use(
//   (config) => {
//     if (accessToken && isTokenValid(accessToken)) {
//       config.headers['Authorization'] = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// api.interceptors.response.use(
//   (response) => {
//     serverReachable = true;
//     lastServerCheck = Date.now();
//     return response;
//   },
//   async (error) => {
//     if (error.code === 'ECONNABORTED' || 
//         error.code === 'ERR_NETWORK' ||
//         error.message.includes('timeout') ||
//         error.message.includes('Network Error') ||
//         !error.response) {
//       serverReachable = false;
//       lastServerCheck = Date.now();
//     }
    
//     if (error.response?.status === 401) {
//       clearAuthData();
//       if (typeof window !== 'undefined') {
//         window.location.href = '/login';
//       }
//     }
//     return Promise.reject(error);
//   }
// );

// export const useAuth = () => {
//   const [user, setUser] = useState<User | null>(currentUser);
//   const [isLoading, setIsLoading] = useState(true);
//   const [authChecked, setAuthChecked] = useState(false);
//   const [serverUnreachable, setServerUnreachable] = useState(false);
//   const router = useRouter();
//   const mounted = useRef(true);

//   useEffect(() => {
//     return () => {
//       mounted.current = false;
//     };
//   }, []);

//   useEffect(() => {
//     const initAuth = async () => {
//       if (!mounted.current) return;

//       try {
//         const authenticated = isAuthenticated();
//         const userData = getCurrentUser();
//         const serverStatus = isServerReachable();

//         if (authenticated && userData) {
//           setUser(userData);
//           setAuthChecked(true);
//           setIsLoading(false);
//           setServerUnreachable(!serverStatus);
//           return;
//         }

//         if (authenticated && !userData) {
//           try {
//             const freshUser = await fetchCurrentUser();
//             if (mounted.current) {
//               setUser(freshUser);
//               setServerUnreachable(!isServerReachable());
//             }
//           } catch (error) {
//             setServerUnreachable(!isServerReachable());
//           }
//         }

//         if (mounted.current) {
//           setAuthChecked(true);
//           setIsLoading(false);
//           setServerUnreachable(!isServerReachable());
//         }
//       } catch (error) {
//         if (mounted.current) {
//           setAuthChecked(true);
//           setIsLoading(false);
//           setServerUnreachable(true);
//         }
//       }
//     };

//     initAuth();
//   }, []);

//   const reactLogin = async (email: string, password: string) => {
//     const result = await login(email, password);
    
//     if ((result as any).serverError) {
//       setServerUnreachable(true);
//       return result;
//     }
    
//     if (result.message === 'Login successful' && result.user) {
//       if (mounted.current) {
//         setUser(result.user);
//         setServerUnreachable(false);
//         const redirectUrl = getRoleBasedRedirectUrl(result.user.role);
//         router.push(redirectUrl);
//       }
//     }
    
//     return result;
//   };

//   const reactLogout = async () => {
//     await logout();
//     if (mounted.current) {
//       setUser(null);
//     }
//   };

//   const retryConnection = async () => {
//     setIsLoading(true);
//     const connectionRestored = await checkServerConnection();
    
//     if (connectionRestored && mounted.current) {
//       setServerUnreachable(false);
//       if (isAuthenticated()) {
//         try {
//           const userData = await fetchCurrentUser();
//           setUser(userData);
//         } catch (error) {
//           console.warn('Failed to refresh user data after reconnection');
//         }
//       }
//     } else {
//       setServerUnreachable(true);
//     }
    
//     if (mounted.current) {
//       setIsLoading(false);
//     }
//   };

//   return {
//     user,
//     isAuthenticated: isAuthenticated(),
//     isLoading,
//     authChecked,
//     serverUnreachable,
//     login: reactLogin,
//     logout: reactLogout,
//     retryConnection,
//     fetchUser: async () => {
//       const userData = await fetchCurrentUser();
//       if (mounted.current) {
//         setUser(userData);
//         setServerUnreachable(!isServerReachable());
//       }
//       return userData;
//     },
//     getRoleBasedRedirectUrl,
//   };
// };

// export default api;

'use client'
import axios, { AxiosError } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_URL = `${API_BASE_URL}api`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000,
});

interface DecodedToken {
  exp: number;
  user_id: string;
  [key: string]: any;
}

interface MaintenanceInfo {
  enabled: boolean;
  type: string;
  message: string;
  estimated_duration: string;
  start_time: string | null;
  end_time: string | null;
  contact_email: string;
}

interface AuthResponse {
  message: string;
  user?: User;
  tokens?: {
    access: string;
    refresh: string;
  };
  isAuthenticated?: boolean;
  serverError?: boolean;
  maintenanceMode?: boolean;
  maintenanceInfo?: MaintenanceInfo | null;
}

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: string;
  phone_number: string;
  is_active: boolean;
  is_staff: boolean;
  date_joined: string;
  assigned_shop: string;
  created_at: string;
  updated_at: string;
}

interface ServerHealthResponse {
  status: string;
  maintenance?: MaintenanceInfo;
}

let accessToken: string | null = null;
let refreshToken: string | null = null;
let currentUser: User | null = null;
let serverReachable: boolean = true;
let lastServerCheck: number = 0;
let isMaintenanceMode: boolean = false;
let maintenanceInfo: MaintenanceInfo | null = null;

const setCookie = (name: string, value: string, seconds: number): void => {
  if (typeof document !== 'undefined') {
    const expires = new Date(Date.now() + seconds * 1000).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; secure; samesite=strict;`;
  }
};

const getCookie = (name: string): string | null => {
  if (typeof document !== 'undefined') {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const part = parts.pop();
      return part ? decodeURIComponent(part.split(';').shift() || '') : null;
    }
  }
  return null;
};

const removeCookie = (name: string): void => {
  if (typeof document !== 'undefined') {
    document.cookie = `${name}=; Max-Age=-99999999; path=/;`;
  }
};

const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    return decoded.exp * 1000 > Date.now() + 10000;
  } catch (error) {
    return false;
  }
};

const loadTokensFromCookies = (): void => {
  const cookieAccess = getCookie('access_token');
  const cookieRefresh = getCookie('refresh_token');
  const cookieUser = getCookie('user_info');
  
  if (cookieAccess && isTokenValid(cookieAccess)) {
    accessToken = cookieAccess;
  }
  
  if (cookieRefresh && isTokenValid(cookieRefresh)) {
    refreshToken = cookieRefresh;
  }
  
  if (cookieUser) {
    try {
      currentUser = JSON.parse(cookieUser) as User;
    } catch (error) {
      removeCookie('user_info');
    }
  }
};

const saveTokensAndUser = (access: string, refresh: string, user?: User): void => {
  accessToken = access;
  refreshToken = refresh;
  
  setCookie('access_token', access, 2 * 60 * 60);
  setCookie('refresh_token', refresh, 7 * 24 * 60 * 60);
  
  if (user) {
    currentUser = user;
    setCookie('user_info', JSON.stringify(user), 7 * 24 * 60 * 60);
  }
};

const clearAuthData = (): void => {
  accessToken = null;
  refreshToken = null;
  currentUser = null;
  
  removeCookie('access_token');
  removeCookie('refresh_token');
  removeCookie('user_info');
};

const getRoleBasedRedirectUrl = (role: string): string => {
  switch (role.toLowerCase()) {
    case 'admin':
      return '/admin';
    case 'supervisor':
      return '/supervisor';
    case 'salesperson':
      return '/sales';
    default:
      return '/sales';
  }
};

if (typeof window !== 'undefined') {
  loadTokensFromCookies();
}

export const fetchCurrentUser = async (): Promise<User | null> => {
  if (!accessToken || !isTokenValid(accessToken)) {
    return currentUser;
  }
  
  try {
    const response = await api.get<User>('/users/me/', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    
    serverReachable = true;
    isMaintenanceMode = false;
    maintenanceInfo = null;
    lastServerCheck = Date.now();
    const user = response.data;
    currentUser = user;
    setCookie('user_info', JSON.stringify(user), 7 * 24 * 60 * 60);
    return user;
  } catch (error: any) {
    if (error.code === 'ECONNABORTED' || 
        error.code === 'ERR_NETWORK' ||
        error.message?.includes('timeout') ||
        error.message?.includes('Network Error') ||
        !error.response) {
      serverReachable = false;
      lastServerCheck = Date.now();
    } else if (error.response?.status === 503) {
      serverReachable = true;
      isMaintenanceMode = true;
      maintenanceInfo = error.response?.data?.maintenance || error.response?.data || null;
      lastServerCheck = Date.now();
    }
    
    return currentUser;
  }
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const healthCheck = await checkServerConnection();
    if (healthCheck.maintenanceMode) {
      return healthCheck;
    }
    if (healthCheck.serverError) {
      return healthCheck;
    }

    const response = await api.post<AuthResponse>('/auth/login/', { email, password });
    const data = response.data;

    serverReachable = true;
    isMaintenanceMode = false;
    maintenanceInfo = null;
    lastServerCheck = Date.now();

    if (data.message === 'Login successful' && data.tokens) {
      saveTokensAndUser(data.tokens.access, data.tokens.refresh, data.user);
    }

    return data;
  } catch (error: any) {
    if (error.code === 'ECONNABORTED' || 
        error.code === 'ERR_NETWORK' ||
        error.message?.includes('timeout') ||
        error.message?.includes('Network Error') ||
        !error.response) {
      serverReachable = false;
      lastServerCheck = Date.now();
      
      return {
        message: 'Server currently unreachable. Please check your connection and try again.',
        isAuthenticated: false,
        serverError: true,
      };
    } else if (error.response?.status === 503) {
      serverReachable = true;
      isMaintenanceMode = true;
      maintenanceInfo = error.response?.data?.maintenance || error.response?.data || null;
      lastServerCheck = Date.now();
      
      return {
        message: 'Server is currently under maintenance.',
        isAuthenticated: false,
        maintenanceMode: true,
        maintenanceInfo: maintenanceInfo
      };
    }

    return {
      message: error.response?.data?.message || 'Login failed',
      isAuthenticated: false,
    };
  }
};

export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout/', 
      { refresh_token: refreshToken }, 
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
  } catch (error) {
    // ignored, pass
  } finally {
    clearAuthData();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
};



/**
 * Request password reset - sends email with reset link
 */
export const requestPasswordReset = async (email: string) => {
  try {
    const { data } = await api.post('/auth/password-reset/', { email });

    return {
      success: true,
      message: data?.message || 'Password reset email sent successfully.',
    };
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.detail ||
      'Failed to send reset email. Please try again.';

    return {
      success: false,
      message,
    };
  }
};


/**
 * Confirm password reset with token
 */
export const confirmPasswordReset = async (
  uid: string,
  token: string,
  newPassword: string,
  confirmPassword: string
) => {
  try {
    const response = await api.post('/auth/password-reset/confirm/', {
      uid,
      token,
      new_password: newPassword,
      confirm_password: confirmPassword
    });

    return {
      success: true,
      message: response.data.message
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.response?.data?.message || 'Failed to reset password. Please try again.'
    };
  }
};


export const isAuthenticated = (): boolean => {
  return !!(accessToken && isTokenValid(accessToken));
};

export const getCurrentUser = (): User | null => {
  return currentUser;
};

export const hasValidAuth = (): boolean => {
  return isAuthenticated() && !!currentUser;
};

export const isServerReachable = (): boolean => {
  return serverReachable;
};

export const getLastServerCheck = (): number => {
  return lastServerCheck;
};

export const isServerInMaintenance = (): boolean => {
  return isMaintenanceMode;
};

export const getMaintenanceInfo = (): MaintenanceInfo | null => {
  return maintenanceInfo;
};

export const checkServerConnection = async (): Promise<AuthResponse> => {
  try {
    const response = await axios.get<ServerHealthResponse>(`${API_URL}/health/`, { 
      timeout: 3000,
      headers: { 'Content-Type': 'application/json' }
    });
    
    serverReachable = true;
    isMaintenanceMode = response.data.status === 'maintenance';
    maintenanceInfo = response.data.status === 'maintenance' ? (response.data.maintenance || null) : null;
    lastServerCheck = Date.now();
    
    return {
      message: isMaintenanceMode ? 'Server is in maintenance mode' : 'Server is reachable',
      isAuthenticated: isAuthenticated(),
      serverError: false,
      maintenanceMode: isMaintenanceMode,
      maintenanceInfo: maintenanceInfo
    };
  } catch (error: any) {
    lastServerCheck = Date.now();
    
    if (error.response?.status === 503) {
      serverReachable = true;
      isMaintenanceMode = true;
      maintenanceInfo = error.response?.data?.maintenance || error.response?.data || null;
      
      return {
        message: 'Server is in maintenance mode',
        isAuthenticated: isAuthenticated(),
        serverError: false,
        maintenanceMode: true,
        maintenanceInfo: maintenanceInfo
      };
    }
    
    serverReachable = false;
    isMaintenanceMode = false;
    maintenanceInfo = null;
    
    return {
      message: 'Server is unreachable',
      isAuthenticated: isAuthenticated(),
      serverError: true,
      maintenanceMode: false,
    };
  }
};

// Request interceptor
api.interceptors.request.use(
  (config) => {
    if (accessToken && isTokenValid(accessToken)) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    serverReachable = true;
    isMaintenanceMode = false;
    maintenanceInfo = null;
    lastServerCheck = Date.now();
    return response;
  },
  async (error: AxiosError) => {
    if (error.code === 'ECONNABORTED' || 
        error.code === 'ERR_NETWORK' ||
        error.message?.includes('timeout') ||
        error.message?.includes('Network Error') ||
        !error.response) {
      serverReachable = false;
      lastServerCheck = Date.now();
    } else if (error.response?.status === 503) {
      serverReachable = true;
      isMaintenanceMode = true;
      const responseData = error.response?.data as any;
      maintenanceInfo = responseData?.maintenance || responseData || null;
      lastServerCheck = Date.now();
    }
    
    if (error.response?.status === 401) {
      clearAuthData();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(currentUser);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  const [serverUnreachable, setServerUnreachable] = useState<boolean>(false);
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);
  const [maintenanceDetails, setMaintenanceDetails] = useState<MaintenanceInfo | null>(null);
  const router = useRouter();
  const mounted = useRef<boolean>(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      if (!mounted.current) return;

      try {
        // Check server health first
        const healthCheck = await checkServerConnection();
        if (healthCheck.maintenanceMode) {
          setMaintenanceMode(true);
          setMaintenanceDetails(healthCheck.maintenanceInfo || null);
          setServerUnreachable(false);
          setAuthChecked(true);
          setIsLoading(false);
          router.push('/maintenance');
          return;
        }
        if (healthCheck.serverError) {
          setServerUnreachable(true);
          setMaintenanceMode(false);
          setMaintenanceDetails(null);
          setAuthChecked(true);
          setIsLoading(false);
          router.push('/server-unreachable');
          return;
        }

        const authenticated = isAuthenticated();
        const userData = getCurrentUser();

        if (authenticated && userData) {
          setUser(userData);
          setAuthChecked(true);
          setIsLoading(false);
          setServerUnreachable(false);
          setMaintenanceMode(false);
          setMaintenanceDetails(null);
          return;
        }

        if (authenticated && !userData) {
          try {
            const freshUser = await fetchCurrentUser();
            if (mounted.current) {
              setUser(freshUser);
              setServerUnreachable(!isServerReachable());
              setMaintenanceMode(isServerInMaintenance());
              setMaintenanceDetails(maintenanceInfo);
            }
          } catch (error) {
            setServerUnreachable(!isServerReachable());
            setMaintenanceMode(isServerInMaintenance());
            setMaintenanceDetails(maintenanceInfo);
          }
        }

        if (mounted.current) {
          setAuthChecked(true);
          setIsLoading(false);
          setServerUnreachable(!isServerReachable());
          setMaintenanceMode(isServerInMaintenance());
          setMaintenanceDetails(maintenanceInfo);
        }
      } catch (error) {
        if (mounted.current) {
          setAuthChecked(true);
          setIsLoading(false);
          setServerUnreachable(true);
          setMaintenanceMode(isServerInMaintenance());
          setMaintenanceDetails(maintenanceInfo);
        }
      }
    };

    initAuth();
  }, [router]);

  const reactLogin = async (email: string, password: string): Promise<AuthResponse> => {
    const result = await login(email, password);
    
    if (result.serverError) {
      setServerUnreachable(true);
      setMaintenanceMode(false);
      setMaintenanceDetails(null);
      router.push('/server-unreachable');
      return result;
    }
    
    if (result.maintenanceMode) {
      setServerUnreachable(false);
      setMaintenanceMode(true);
      setMaintenanceDetails(result.maintenanceInfo || null);
      router.push('/maintenance');
      return result;
    }
    
    if (result.message === 'Login successful' && result.user) {
      if (mounted.current) {
        setUser(result.user);
        setServerUnreachable(false);
        setMaintenanceMode(false);
        setMaintenanceDetails(null);
        const redirectUrl = getRoleBasedRedirectUrl(result.user.role);
        router.push(redirectUrl);
      }
    }
    
    return result;
  };

  const reactLogout = async (): Promise<void> => {
    await logout();
    if (mounted.current) {
      setUser(null);
      setMaintenanceMode(false);
      setMaintenanceDetails(null);
    }
  };

  const retryConnection = async (): Promise<AuthResponse> => {
    setIsLoading(true);
    const connectionStatus = await checkServerConnection();
    
    if (connectionStatus.serverError) {
      setServerUnreachable(true);
      setMaintenanceMode(false);
      setMaintenanceDetails(null);
      router.push('/server-unreachable');
    } else if (connectionStatus.maintenanceMode) {
      setServerUnreachable(false);
      setMaintenanceMode(true);
      setMaintenanceDetails(connectionStatus.maintenanceInfo || null);
      router.push('/maintenance');
    } else if (connectionStatus.message === 'Server is reachable' && mounted.current) {
      setServerUnreachable(false);
      setMaintenanceMode(false);
      setMaintenanceDetails(null);
      if (isAuthenticated()) {
        try {
          const userData = await fetchCurrentUser();
          setUser(userData);
        } catch (error) {
          console.warn('Failed to refresh user data after reconnection');
        }
      }
    }
    
    if (mounted.current) {
      setIsLoading(false);
    }
    return connectionStatus;
  };

  const fetchUser = async (): Promise<User | null> => {
    const userData = await fetchCurrentUser();
    if (mounted.current) {
      setUser(userData);
      setServerUnreachable(!isServerReachable());
      setMaintenanceMode(isServerInMaintenance());
      setMaintenanceDetails(maintenanceInfo);
    }
    return userData;
  };

  return {
    user,
    isAuthenticated: isAuthenticated(),
    isLoading,
    authChecked,
    serverUnreachable,
    maintenanceMode,
    maintenanceDetails,
    login: reactLogin,
    logout: reactLogout,
    retryConnection,
    fetchUser,
    getRoleBasedRedirectUrl,
  };
};

export type { User, AuthResponse, MaintenanceInfo };
export default api;