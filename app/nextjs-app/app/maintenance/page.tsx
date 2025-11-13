'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Wrench, 
  Clock, 
  Server, 
  CheckCircle,
  Mail
} from 'lucide-react';
import { useAuthContext } from '@/lib/context/auth';

export default function MaintenancePage() {
  const { maintenanceDetails, retryConnection } = useAuthContext();
  const [currentTime, setCurrentTime] = useState(new Date());


  const message = maintenanceDetails?.message || 'SupaPos is currently undergoing scheduled maintenance';
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 flex items-center justify-center p-4">
       <div className="w-full max-w-xl">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4 relative">
              <div className="w-24 h-24 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Wrench className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                <Server className="w-5 h-5 text-white" />
              </div>
            </div>
            
            <div className="mb-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-50 border-amber-200 text-amber-600">
                PLANNED MAINTENANCE
              </span>
            </div>
            
            <CardTitle className="text-2xl font-bold text-amber-800 mb-2">
              Scheduled Maintenance
            </CardTitle>
            <CardDescription className="text-gray-600 text-base leading-relaxed">
              {message}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">

            <div className="bg-amber-50 border-amber-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-800 text-sm">Maintenance Status</h3>
                  <p className="text-amber-600 text-sm mt-1">
                    System temporarily unavailable
                  </p>
                  <div className="mt-2 space-y-1 text-xs">
                    <p className="text-amber-600">
                      <strong> Simplifying Life with Smart Solutions </strong> 
                    </p>
                  </div>
                </div>
              </div>
            </div>


            <div className="pt-4 border-t border-gray-200">
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-green-900 text-xs font-medium">We'll be back soon!</p>
                    <p className="text-green-700 text-xs mt-1">
                      Your data is safe and will be available when maintenance is complete.
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
            Status: Under Maintenance
          </p>
        </div>
      </div>
    </div>
  );
}