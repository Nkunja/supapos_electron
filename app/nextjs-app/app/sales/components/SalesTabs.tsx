'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  BarChart3,
  TrendingUp,
  FileText,
  Calendar,
  DollarSign,
  Package,
  Users
} from 'lucide-react';

interface SalesTabsProps {
  children: React.ReactNode;
  activeTab: 'sale' | 'reports';
  onTabChange: (tab: 'sale' | 'reports') => void;
}

export function SalesTabs({ children, activeTab, onTabChange }: SalesTabsProps) {
  return (
    <div className="w-full">
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <Button
          variant={activeTab === 'sale' ? 'default' : 'ghost'}
          onClick={() => onTabChange('sale')}
          className="flex items-center space-x-2 flex-1"
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Make a Sale</span>
        </Button>
        <Button
          variant={activeTab === 'reports' ? 'default' : 'ghost'}
          onClick={() => onTabChange('reports')}
          className="flex items-center space-x-2 flex-1"
        >
          <BarChart3 className="h-4 w-4" />
          <span>Reports</span>
        </Button>
      </div>

      {/* Tab Content */}
      <div className="w-full">
        {children}
      </div>
    </div>
  );
} 