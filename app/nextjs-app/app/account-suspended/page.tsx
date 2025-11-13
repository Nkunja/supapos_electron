'use client';

import { Card } from '@/components/ui/card';
export default function AccountSuspendedPage() {
 

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
     Account Suspended

        </Card>

        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            SupaPos • Business Management Software
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Account Status: Suspended
          </p>
        </div>
      </div>
    </div>
  );
}