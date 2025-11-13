'use client';

import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthGuard from '@/lib/utils/AuthGuard';
import { SupervisorNavbar } from './nav';

import { useAuthContext } from '@/lib/context/auth';
import { SupervisorSidebar } from './sidebar';

interface SupervisorLayoutProps {
  children: React.ReactNode;
}

export default function SupervisorLayout({ children }: SupervisorLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  const { user } = useAuthContext();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    handleResize();
    
    window.addEventListener('resize', handleResize);
    
    setMounted(true);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <AuthGuard allowedRoles={['supervisor']} publicRoutes={['/login', '/forgot-password']}>
      <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
        <SupervisorNavbar 
          user={user}
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
          isSidebarOpen={isSidebarOpen}
        />
        
        <div className="flex flex-1 relative">
          <SupervisorSidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
          />
          
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
              onClick={() => setIsSidebarOpen(false)}
              aria-hidden="true"
            />
          )}
          
          <main
            className={`
              flex-1 flex flex-col
              transition-all duration-300 ease-in-out
            `}
          >
            <div className="flex-1 pt-1"> 
              <div className="h-full px-4 sm:px-2 lg:px-6 py-6">
                <div className="w-full mx-auto h-full">
                  <div className="min-h-[calc(100vh-8rem)]">
                    {children}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="mt-20" 
          toastClassName="shadow-xl border border-gray-200 rounded-lg"
        />
      </div>
    </AuthGuard>
  );
}