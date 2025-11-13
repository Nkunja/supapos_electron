'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAuthContext } from '../context/auth';
import { Loader, Shield } from 'lucide-react';
import { User } from '@/types/user';

export const globalUserStore = {
  userData: null as User | null,
  isLoaded: false,
  setUserData: function (data: User) {
    this.userData = data;
    this.isLoaded = true;
  },
  clearUserData: function () {
    this.userData = null;
    this.isLoaded = false;
  },
  getUserRole: function () {
    return this.userData?.role || null;
  },
};

interface AuthGuardProps {
  children: ReactNode;
  publicRoutes?: string[];
  allowedRoles?: string[]; 
}

export default function AuthGuard({
  children,
  publicRoutes = ['/login', '/forgot-password', '/contact-support'],
  allowedRoles = ['admin', 'supervisor', 'salesperson'],
}: AuthGuardProps) {
  const { 
    isLoggedIn, 
    user, 
    loading, 
    authChecked
  } = useAuthContext();
  
  const router = useRouter();
  const pathname = usePathname();
  const [canRender, setCanRender] = useState(false);

  useEffect(() => {
    if (!authChecked) {
      return;
    }
    const isPublicPath = publicRoutes.some((route) => pathname?.startsWith(route));
    
    if (isPublicPath) {
      setCanRender(true);
      return;
    }

    if (!isLoggedIn || !user) {
      if (pathname !== '/login') {
        toast.error('Please log in to access this page');
      }
      globalUserStore.clearUserData();
      router.replace('/login');
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      const userCorrectPath = getUserRolePath(user.role);
      
      if (pathname !== userCorrectPath) {
        toast.info(`Redirecting to ${user.role} dashboard...`);
        
        switch (user.role.toLowerCase()) {
          case 'admin':
            router.replace('/admin');
            break;
          case 'supervisor':
            router.replace('/supervisor');
            break;
          case 'salesperson':
            router.replace('/sales');
            break;
          default:
            toast.error('Invalid user role. Please contact support.');
            router.replace('/login');
        }
        return;
      }
    }

    globalUserStore.setUserData(user);
    setCanRender(true);

  }, [authChecked, isLoggedIn, user, pathname, allowedRoles, publicRoutes, router]);

  const getUserRolePath = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return '/admin';
      case 'supervisor':
        return '/supervisor';
      case 'salesperson':
        return '/sales';
      default:
        return '/login';
    }
  };

  if (!authChecked || loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <Loader className="h-8 w-8 text-blue-600 animate-spin mx-auto" />
          <div>
            <p className="text-gray-700 font-medium">SupaPos</p>
            <p className="text-gray-500 text-sm">
              {!authChecked ? 'Initializing...' : 'Checking permissions...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return canRender ? <>{children}</> : null;
}