'use client';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Store, LogOut } from 'lucide-react';
import { User } from '../types';

interface SalesHeaderProps {
  user: User | null;
  onLogout: () => void;
}

export function SalesHeader({ user, onLogout }: SalesHeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <Store className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Sales Dashboard
              </h1>
              <p className="text-sm text-slate-600">{user?.assigned_shop?.name || 'Business Sales'}</p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 ring-2 ring-blue-100">
              <AvatarFallback className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-semibold text-slate-900">{user?.full_name}</p>
              <p className="text-xs text-slate-600 capitalize">{user?.role}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
} 