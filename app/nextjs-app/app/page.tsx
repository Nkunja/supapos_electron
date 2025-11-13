'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/lib/context/auth';
import { globalUserStore } from '@/lib/utils/AuthGuard';

export default function HomePage() {
  const { isLoggedIn, user, loading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    function handleRouting() {
      if (loading) return;
      
      if (!isLoggedIn || !user) {
        router.replace('/login');
        return;
      }
      
      if (!globalUserStore.isLoaded || globalUserStore.userData?.id !== user.id) {
        globalUserStore.setUserData(user);
      }

      const userRole = globalUserStore.getUserRole() || user.role;

      switch (userRole.toLowerCase()) {
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
          router.replace('/login');
          break;
      }
    }

    handleRouting();
  }, [isLoggedIn, user, loading, router]);

  return null;
}