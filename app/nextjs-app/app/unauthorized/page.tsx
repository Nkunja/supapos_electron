'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ShieldX, 
  AlertTriangle,
  Home,
  LogIn,
  RefreshCw,
  Lock
} from 'lucide-react';


export default function UnauthorizedPage() {
  const [countdown, setCountdown] = useState(10);




  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-red-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 relative">
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                <ShieldX className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <Lock className="w-4 h-4 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              Access Denied
            </CardTitle>
            <CardDescription className="text-gray-600 text-base">
              Unauthorized Access
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Status Info */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900 text-sm">Authorization Status</h3>
                  <p className="text-red-700 text-sm mt-1">
                    HTTP 401 - Unauthorized Access
                  </p>
               
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-blue-800">
                <RefreshCw className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Redirecting to login in {countdown} seconds...
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-gray-900 text-xs font-medium">Still having issues?</p>
                    <p className="text-gray-700 text-xs mt-1">
                      Contact your system administrator or IT support team for assistance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            SupaPos • Business Management Software
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Error Code: 401 - Unauthorized
          </p>
        </div>
      </div>
    </div>
  );
}