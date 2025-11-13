// 'use client';

// import { useAuth } from '@/app/api/auth';
// import { User } from '@/app/api/users';
// import { useRouter } from 'next/navigation';
// import { createContext, ReactNode, useContext, useEffect, useRef } from 'react';
// import { toast } from 'react-toastify';

// interface AuthContextType {
//   user: User | null;
//   isLoggedIn: boolean;
//   loading: boolean;
//   authChecked: boolean;
//   serverUnreachable: boolean;
//   login: (email: string, password: string) => Promise<any>;
//   logout: () => void;
//   refreshUser: () => Promise<void>;
//   retryConnection: () => Promise<void>;
//   navigateToRoleDashboard: () => void;
//   getRoleBasedRedirectUrl: (role: string) => string;
// }

// const AuthContext = createContext<AuthContextType>({
//   user: null,
//   isLoggedIn: false,
//   loading: true,
//   authChecked: false,
//   serverUnreachable: false,
//   login: async () => ({}),
//   logout: () => {},
//   refreshUser: async () => {},
//   retryConnection: async () => {},
//   navigateToRoleDashboard: () => {},
//   getRoleBasedRedirectUrl: () => '/',
// });

// export const useAuthContext = () => useContext(AuthContext);

// interface AuthProviderProps {
//   children: ReactNode;
// }

// export function AuthProvider({ children }: AuthProviderProps) {
//   const { 
//     user, 
//     isAuthenticated, 
//     isLoading,
//     authChecked,
//     serverUnreachable,
//     login: authLogin,
//     logout: authLogout, 
//     fetchUser,
//     retryConnection,
//     getRoleBasedRedirectUrl 
//   } = useAuth();
  
//   const router = useRouter();
//   const mountedRef = useRef(true);

//   useEffect(() => {
//     return () => {
//       mountedRef.current = false;
//     };
//   }, []);

//   const handleLogout = async () => {
//     if (!mountedRef.current) return;
    
//     try {
//       await authLogout();
//       toast.success('Logged out successfully');
//     } catch (error) {
//       toast.error('Error during logout');
//     }
//   };

//   const refreshUser = async () => {
//     if (!mountedRef.current || !isAuthenticated) return;
    
//     try {
//       await fetchUser();
//     } catch (error) {
//       toast.error('Error refreshing user data');
//     }
//   };

//   const navigateToRoleDashboard = () => {
//     if (!mountedRef.current) return;
    
//     if (user?.role) {
//       const redirectUrl = getRedirectUrl(user.role);
//       router.push(redirectUrl);
//     } else {
//       router.push('/login');
//     }
//   };

//   const getRedirectUrl = (role: string): string => {
//     const normalizedRole = role.toLowerCase();
//     switch (normalizedRole) {
//       case 'admin':
//         return '/admin';
//       case 'supervisor':
//         return '/supervisor';
//       case 'salesperson':
//         return '/sales';
//       default:
//         return '/sales';
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isLoggedIn: isAuthenticated,
//         loading: isLoading,
//         authChecked,
//         serverUnreachable,
//         login: authLogin,
//         logout: handleLogout,
//         refreshUser,
//         retryConnection,
//         navigateToRoleDashboard,
//         getRoleBasedRedirectUrl: getRedirectUrl,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }



'use client';

import { useAuth, AuthResponse, User, MaintenanceInfo } from '@/app/api/auth';
import { useRouter } from 'next/navigation';
import { createContext, JSX, ReactNode, useContext, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  loading: boolean;
  authChecked: boolean;
  serverUnreachable: boolean;
  maintenanceMode: boolean;
  maintenanceDetails: MaintenanceInfo | null;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  retryConnection: () => Promise<AuthResponse>;
  navigateToRoleDashboard: () => void;
  getRoleBasedRedirectUrl: (role: string) => string;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  loading: true,
  authChecked: false,
  serverUnreachable: false,
  maintenanceMode: false,
  maintenanceDetails: null,
  login: async () => ({ message: '', isAuthenticated: false }),
  logout: async () => {},
  refreshUser: async () => {},
  retryConnection: async () => ({ message: '', isAuthenticated: false }),
  navigateToRoleDashboard: () => {},
  getRoleBasedRedirectUrl: () => '/',
});

export const useAuthContext = (): AuthContextType => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const { 
    user, 
    isAuthenticated, 
    isLoading,
    authChecked,
    serverUnreachable,
    maintenanceMode,
    maintenanceDetails,
    login: authLogin,
    logout: authLogout, 
    fetchUser,
    retryConnection,
    getRoleBasedRedirectUrl 
  } = useAuth();
  
  const router = useRouter();
  const mountedRef = useRef<boolean>(true);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

useEffect(() => {
  if (!mountedRef.current || !authChecked) return;

  const currentPath = window.location.pathname;

  const isPublicRoute =
    currentPath === '/login' ||
    currentPath.startsWith('/auth/') ||
    currentPath === '/maintenance' ||
    currentPath === '/server-unreachable';

  // Redirect logic
  if (maintenanceMode && currentPath !== '/maintenance') {
    router.push('/maintenance');
  } else if (serverUnreachable && currentPath !== '/server-unreachable') {
    router.push('/server-unreachable');
  } else if (!isAuthenticated && !isLoading && !isPublicRoute) {
 
    router.push('/login');
  } else if (isAuthenticated && user?.role && !isPublicRoute) {
    const redirectUrl = getRedirectUrl(user.role);
    if (!currentPath.startsWith(redirectUrl)) {
      router.push(redirectUrl);
    }
  }
}, [maintenanceMode, serverUnreachable, isAuthenticated, isLoading, authChecked, user, router]);

  const handleLogout = async (): Promise<void> => {
    if (!mountedRef.current) return;
    
    try {
      await authLogout();
      if (mountedRef.current) {
        toast.success('Logged out successfully');
      }
    } catch (error) {
      if (mountedRef.current) {
        toast.error('Error during logout');
      }
    }
  };

  const refreshUser = async (): Promise<void> => {
    if (!mountedRef.current || !isAuthenticated) return;
    
    try {
      await fetchUser();
    } catch (error) {
      if (mountedRef.current) {
        toast.error('Error refreshing user data');
      }
    }
  };

  const navigateToRoleDashboard = (): void => {
    if (!mountedRef.current) return;
    
    if (user?.role) {
      const redirectUrl = getRedirectUrl(user.role);
      router.push(redirectUrl);
    } else {
      router.push('/login');
    }
  };

  const getRedirectUrl = (role: string): string => {
    const normalizedRole = role.toLowerCase();
    switch (normalizedRole) {
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

  const handleRetryConnection = async (): Promise<AuthResponse> => {
    try {
      const result = await retryConnection();
      return result;
    } catch (error) {
      if (mountedRef.current) {
        toast.error('Failed to reconnect to server');
      }
      return { message: 'Connection failed', isAuthenticated: false, serverError: true };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: isAuthenticated,
        loading: isLoading,
        authChecked,
        serverUnreachable,
        maintenanceMode,
        maintenanceDetails,
        login: authLogin,
        logout: handleLogout,
        refreshUser,
        retryConnection: handleRetryConnection,
        navigateToRoleDashboard,
        getRoleBasedRedirectUrl: getRedirectUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}