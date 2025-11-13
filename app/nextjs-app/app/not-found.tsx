'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Home, 
  ArrowLeft, 
  Search, 
  ShieldCheck, 
  Store, 
  Settings,
  LogIn,
  Compass,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { useAuthContext } from '@/lib/context/auth';
import { globalUserStore } from '@/lib/utils/AuthGuard';

export default function NotFound() {
  const router = useRouter();
  const { user, isLoggedIn, loading } = useAuthContext();
  const [redirectCountdown, setRedirectCountdown] = useState(10);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const currentUser = user || globalUserStore.userData;
  const userLoggedIn = isLoggedIn || !!globalUserStore.userData;


  const getDashboardUrl = () => {
    if (!currentUser) return '/login';
    
    switch (currentUser.role?.toLowerCase()) {
      case 'admin':
        return '/admin';
      case 'salesperson':
        return '/sales';
      case 'manager':
        return '/admin'; 
      default:
        return '/sales'; 
    }
  };

  const getDashboardName = () => {
    if (!currentUser) return 'Login';
    
    switch (currentUser.role?.toLowerCase()) {
      case 'admin':
        return 'Admin Dashboard';
      case 'salesperson':
        return 'Sales Dashboard';
      case 'manager':
        return 'Admin Dashboard';
      default:
        return 'Dashboard';
    }
  };

  const handleRedirect = (url: string) => {
    setIsRedirecting(true);
    router.push(url);
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      handleRedirect(getDashboardUrl());
    }
  };

  useEffect(() => {
    if (loading) return; 

    const timer = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRedirecting(true);
          router.push(getDashboardUrl());

          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, router]); 
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <p className="text-slate-600">Checking authentication...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm mb-6">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-6 relative">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                <AlertTriangle className="h-12 w-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-yellow-800 font-bold text-sm">!</span>
              </div>
            </div>
            <CardTitle className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
              404 - Page Not Found
            </CardTitle>
            <CardDescription className="text-lg text-slate-600">
              Oops! The page you're looking for doesn't exist or has been moved.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="text-center">
            <div className="mb-8 p-4 bg-slate-50 rounded-xl border">
              {userLoggedIn && currentUser ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
                    {currentUser.role === 'admin' ? (
                      <ShieldCheck className="h-6 w-6 text-white" />
                    ) : (
                      <Store className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900">
                      Welcome back, {currentUser.first_name}!
                    </p>
                    <p className="text-sm text-slate-600 capitalize">
                      {currentUser.role} • Redirecting to your dashboard
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full">
                    <LogIn className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900">Not signed in</p>
                    <p className="text-sm text-slate-600">Redirecting to login page</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Compass className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-blue-900">Auto-redirecting in</span>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {redirectCountdown}s
              </div>
              <p className="text-sm text-blue-700">
                Taking you to {getDashboardName()}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button
                onClick={() => handleRedirect(getDashboardUrl())}
                disabled={isRedirecting}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6"
              >
                {isRedirecting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : userLoggedIn ? (
                  <Home className="h-4 w-4 mr-2" />
                ) : (
                  <LogIn className="h-4 w-4 mr-2" />
                )}
                {userLoggedIn ? 'Go to Dashboard' : 'Sign In'}
              </Button>

              {/* Go Back */}
              <Button
                onClick={handleGoBack}
                variant="outline"
                className="font-semibold py-3 px-6 border-slate-300 hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
              <Button
                onClick={() => handleRedirect('/')}
                variant="outline"
                className="font-semibold py-3 px-6 border-slate-300 hover:bg-slate-50"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>

          </CardContent>
        </Card>

        <div className="text-center text-sm text-slate-500">
          <p>SupaPos © 2025 • Business Management Software</p>
        </div>
      </div>
    </div>
  );
}