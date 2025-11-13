import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle,
  AlertCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { CompleteShopReport } from '@/types/shop-reports';

interface InventoryProps {
  reportData: CompleteShopReport;
  formatDate: (dateString: string) => string;
}

export default function Inventory({ reportData, formatDate }: InventoryProps) {
  return (
    <div className="space-y-6">
      {/* Stock Status Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle className="h-4 w-4 text-green-600" />
              Healthy Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {reportData.inventory_analytics.stock_analysis.healthy_stock.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              Low Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {reportData.inventory_analytics.stock_analysis.low_stock.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <XCircle className="h-4 w-4 text-red-600" />
              Out of Stock
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {reportData.inventory_analytics.stock_analysis.out_of_stock.length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-orange-600" />
              Near Expiry
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {reportData.inventory_analytics.stock_analysis.near_expiry.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Issues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Low Stock Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {reportData.inventory_analytics.stock_analysis.low_stock.slice(0, 10).map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium text-sm">{item.product_name}</p>
                    <p className="text-xs text-gray-600">{item.units_available} units left</p>
                  </div>
                  <Badge variant="outline" className="text-yellow-600">
                    Low
                  </Badge>
                </div>
              ))}
              {reportData.inventory_analytics.stock_analysis.low_stock.length === 0 && (
                <p className="text-sm text-gray-500 py-4 text-center">No low stock items</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Expired Items */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Expired Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {reportData.inventory_analytics.stock_analysis.expired.slice(0, 10).map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium text-sm">{item.product_name}</p>
                    <p className="text-xs text-gray-600">
                      Expired: {item.expiry_date ? formatDate(item.expiry_date) : 'N/A'}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-red-600">
                    Expired
                  </Badge>
                </div>
              ))}
              {reportData.inventory_analytics.stock_analysis.expired.length === 0 && (
                <p className="text-sm text-gray-500 py-4 text-center">No expired items</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Near Expiry Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Near Expiry Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {reportData.inventory_analytics.stock_analysis.near_expiry.slice(0, 10).map((item, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <div>
                  <p className="font-medium text-sm">{item.product_name}</p>
                  <p className="text-xs text-gray-600">
                    Expires in {item.days_to_expiry} days ({item.expiry_date ? formatDate(item.expiry_date) : 'N/A'})
                  </p>
                </div>
                <Badge variant="outline" className="text-orange-600">
                  {item.days_to_expiry}d left
                </Badge>
              </div>
            ))}
            {reportData.inventory_analytics.stock_analysis.near_expiry.length === 0 && (
              <p className="text-sm text-gray-500 py-4 text-center">No items near expiry</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}