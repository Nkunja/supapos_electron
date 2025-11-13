'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Package, DollarSign } from 'lucide-react';
import { SalesStats } from '../types';

interface TopProductsProps {
  salesStats: SalesStats | null;
}

export function TopProducts({ salesStats }: TopProductsProps) {
  if (!salesStats || !salesStats.top_products || salesStats.top_products.length === 0) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-orange-600" />
            <span>Top Products</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No top products data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-orange-600" />
          <span>Top Products</span>
          <Badge variant="secondary" className="ml-auto">
            Last {salesStats.period_days} days
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {salesStats.top_products.map((product, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-10 h-10 bg-orange-100 rounded-full">
                  <span className="text-orange-600 font-bold text-sm">
                    #{index + 1}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {product.inventory__product__name}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Package className="h-4 w-4" />
                      <span>{product.total_quantity} units sold</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-bold text-lg text-green-600">
                    KSh {product.total_revenue.toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Revenue
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {salesStats.top_products.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Total Revenue from Top Products:</span>
              <span className="font-semibold text-green-600">
                KSh {salesStats.top_products
                  .reduce((sum, product) => sum + product.total_revenue, 0)
                  .toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 