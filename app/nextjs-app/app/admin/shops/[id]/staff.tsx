import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User } from 'lucide-react';
import { CompleteShopReport } from '@/types/shop-reports';

interface StaffProps {
  reportData: CompleteShopReport;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
}

export default function Staff({ reportData, formatCurrency, formatDate }: StaffProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {reportData.salesperson_analytics.salesperson_analytics.map((staff, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <User className="h-4 w-4" />
                {staff.salesperson.first_name}
                {staff.salesperson.is_active ? (
                  <Badge variant="default" className="text-xs">Active</Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">Inactive</Badge>
                )}
              </CardTitle>
              <p className="text-xs text-gray-600">{staff.salesperson.email}, {staff.salesperson.first_name + " "+ staff.salesperson. last_name}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-2">Performance</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Today</span>
                      <span className="font-medium">{formatCurrency(staff.performance.today.sales)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span></span>
                      <span>{staff.performance.today.transactions} transactions</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>This Week</span>
                      <span className="font-medium">{formatCurrency(staff.performance.this_week.sales)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span></span>
                      <span>{staff.performance.this_week.transactions} transactions</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span>This Month</span>
                      <span className="font-medium">{formatCurrency(staff.performance.this_month.sales)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span></span>
                      <span>{staff.performance.this_month.transactions} transactions</span>
                    </div>
                    
                    <div className="flex justify-between pt-1 border-t">
                      <span>Avg/Transaction</span>
                      <span className="font-medium text-green-600">
                        {formatCurrency(staff.performance.this_month.avg_transaction)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium mb-2">Recent Activity</p>
                  <div className="space-y-1">
                    {staff.recent_activity.length > 0 ? (
                      staff.recent_activity.slice(0, 3).map((activity, idx) => (
                        <div key={idx} className="text-xs border-b pb-1 last:border-b-0">
                          <div className="flex justify-between">
                            <span className="font-medium">{activity.invoice_number}</span>
                            <span>{formatCurrency(activity.total_amount)}</span>
                          </div>
                          <div className="flex justify-between text-gray-500">
                            <span>{activity.customer_name || 'Walk-in customer'}</span>
                            <span>{formatDate(activity.created_at)}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-500">No recent activity</p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">
                {reportData.salesperson_analytics.salesperson_analytics.length}
              </p>
              <p className="text-sm text-gray-600">Total Staff</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {reportData.salesperson_analytics.salesperson_analytics.filter(s => s.salesperson.is_active).length}
              </p>
              <p className="text-sm text-gray-600">Active Staff</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {formatCurrency(
                  reportData.salesperson_analytics.salesperson_analytics.reduce(
                    (sum, staff) => sum + staff.performance.this_month.sales, 0
                  )
                )}
              </p>
              <p className="text-sm text-gray-600">Total Monthly Sales</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">
                {reportData.salesperson_analytics.salesperson_analytics.reduce(
                  (sum, staff) => sum + staff.performance.this_month.transactions, 0
                )}
              </p>
              <p className="text-sm text-gray-600">Total Transactions</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}