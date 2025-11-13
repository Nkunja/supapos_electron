'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  WifiOff, 
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Mail,
  Server
} from 'lucide-react';

export default function ServerUnreachablePage() {


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 relative">
              <div className="w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <WifiOff className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                <Server className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <div className="mb-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-red-50 border-red-200 text-red-600">
                CONNECTION ERROR
              </span>
            </div>
            
            <CardTitle className="text-2xl font-bold text-red-800 mb-2">
              Server Unreachable
            </CardTitle>
            <CardDescription className="text-gray-600 text-base leading-relaxed">
              SupaPos servers are currently unreachable
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-red-50 border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-red-800 text-sm">Connection Status</h3>
                  <p className="text-red-600 text-sm mt-1">
                    SupaPos servers connection failed. Please wait as we get this resolved.
                  </p>
                </div>
              </div>
            </div>


            <div className="pt-4 border-t border-gray-200">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-blue-900 text-xs font-medium">This may be temporary</p>
                    <p className="text-blue-700 text-xs mt-1">
                      Please try again in a few minutes.
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
            Status: Connection Error
          </p>
        </div>
      </div>
    </div>
  );
}