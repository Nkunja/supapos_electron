import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CompleteShopReport } from '@/types/shop-reports';

interface ProductsProps {
  reportData: CompleteShopReport;
  formatCurrency: (amount: number) => string;
  days: number;
}

export default function Products({ reportData, formatCurrency, days }: ProductsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products ({days} days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reportData.product_performance.top_selling_products.slice(0, 8).map((product, index) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{product.inventory__product__name}</p>
                    <p className="text-xs text-gray-600">{product.quantity_sold} units</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{formatCurrency(product.revenue)}</p>
                    <p className="text-xs text-gray-500">{product.transactions} orders</p>
                  </div>
                </div>
              ))}
              {reportData.product_performance.top_selling_products.length === 0 && (
                <p className="text-sm text-gray-500 py-4 text-center">No sales data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Slow Moving Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {reportData.product_performance.slow_moving_products.slice(0, 8).map((product, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-gray-600">{product.category__name}</p>
                  </div>
                  <Badge variant="outline" className="text-orange-600">
                    No Sales
                  </Badge>
                </div>
              ))}
              {reportData.product_performance.slow_moving_products.length === 0 && (
                <p className="text-sm text-gray-500 py-4 text-center">All products have recent sales</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>


    </div>
  );
}