import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DollarSign,
  Package,
  Users,
  AlertTriangle,
  Warehouse,
  TrendingUp,
  TrendingDown,
  Activity,
  ShoppingCart,
  Calendar,
  Target,
  Zap,
  CheckCircle,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { CompleteShopReport } from '@/types/shop-reports';

interface OverviewProps {
  reportData: CompleteShopReport;
  formatCurrency: (amount: number) => string;
}

export default function Overview({ reportData, formatCurrency }: OverviewProps) {
  // Calculate percentage values for visual indicators
  const healthyStockPercentage = (reportData.overview.inventory.healthy_stock_items / reportData.overview.inventory.total_products) * 100;
  const lowStockPercentage = (reportData.overview.inventory.low_stock_items / reportData.overview.inventory.total_products) * 100;
  const outOfStockPercentage = (reportData.overview.inventory.out_of_stock_items / reportData.overview.inventory.total_products) * 100;
  const expiredPercentage = (reportData.overview.inventory.expired_items / reportData.overview.inventory.total_products) * 100;

  // Calculate staff efficiency
  const staffEfficiency = (reportData.overview.shop.active_salespersons_count / reportData.overview.shop.salespersons_count) * 100;

  // Calculate profit margin
  const profitMargin = ((reportData.overview.inventory.total_stock_value - reportData.overview.inventory.total_cost_value) / reportData.overview.inventory.total_stock_value) * 100;

  // Format numbers with commas
  const formatNumber = (num: number) => new Intl.NumberFormat('en-KE').format(num);

  // Get alert severity
  const getAlertSeverity = () => {
    const alertCount = reportData.overview.alerts.unresolved_alerts;
    if (alertCount === 0) return { color: 'text-green-600', bg: 'bg-green-50', status: 'All Clear' };
    if (alertCount <= 5) return { color: 'text-yellow-600', bg: 'bg-yellow-50', status: 'Attention' };
    if (alertCount <= 10) return { color: 'text-orange-600', bg: 'bg-orange-50', status: 'Warning' };
    return { color: 'text-red-600', bg: 'bg-red-50', status: 'Critical' };
  };

  const alertSeverity = getAlertSeverity();

  return (
    <div className="space-y-6">
      {/* Hero Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Today's Sales Card */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">Today's Revenue</CardTitle>
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <DollarSign className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">
              {formatCurrency(reportData.overview.sales.today.sales)}
            </div>
            <div className="flex items-center gap-2 text-blue-100">
              <ShoppingCart className="h-3 w-3" />
              <span className="text-xs">
                {formatNumber(reportData.overview.sales.today.transactions)} transactions
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-blue-100">
              <Activity className="h-3 w-3" />
              <span>
                {reportData.overview.sales.today.items_sold} items sold
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Value Card */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-100">Inventory Worth</CardTitle>
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Package className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">
              {formatCurrency(reportData.overview.inventory.total_stock_value)}
            </div>
            <div className="flex items-center gap-2 text-emerald-100">
              <Warehouse className="h-3 w-3" />
              <span className="text-xs">
                {formatNumber(reportData.overview.inventory.total_products)} products in stock
              </span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-xs text-emerald-100">
              <Target className="h-3 w-3" />
              <span>
                {profitMargin.toFixed(1)}% profit margin
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Team Performance Card */}
        <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-100">Team Status</CardTitle>
            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-1">
              {reportData.overview.shop.active_salespersons_count}
              <span className="text-lg font-normal text-purple-200">
                /{reportData.overview.shop.salespersons_count}
              </span>
            </div>
            <div className="flex items-center gap-2 text-purple-100">
              <Activity className="h-3 w-3" />
              <span className="text-xs">
                {staffEfficiency.toFixed(0)}% staff active
              </span>
            </div>
            <div className="mt-2">
              <Progress 
                value={staffEfficiency} 
                className="h-1.5 bg-white/20"
              />
            </div>
          </CardContent>
        </Card>

        {/* Alerts Card */}
        <Card className={`relative overflow-hidden border-0 shadow-lg ${alertSeverity.bg}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">System Alerts</CardTitle>
            <div className={`p-2 ${alertSeverity.color} bg-white/80 rounded-lg`}>
              <AlertTriangle className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold mb-1 ${alertSeverity.color}`}>
              {reportData.overview.alerts.unresolved_alerts}
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Zap className="h-3 w-3" />
              <span className="text-xs">
                {alertSeverity.status}
              </span>
            </div>
            <Badge 
              variant={reportData.overview.alerts.unresolved_alerts === 0 ? 'default' : 'destructive'}
              className="mt-2 text-xs"
            >
              {reportData.overview.alerts.unresolved_alerts === 0 ? 'No Issues' : 'Needs Attention'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Performance Timeline */}
        <Card className="col-span-1 lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Sales Progression
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-blue-100">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Today</p>
                    <p className="text-xs text-gray-500">Current performance</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-600">{formatCurrency(reportData.overview.sales.today.sales)}</p>
                  <p className="text-xs text-gray-500">{reportData.overview.sales.today.transactions} txns</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-green-100">
                    <Calendar className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">This Week</p>
                    <p className="text-xs text-gray-500">7-day performance</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{formatCurrency(reportData.overview.sales.this_week.sales)}</p>
                  <p className="text-xs text-gray-500">{reportData.overview.sales.this_week.transactions} txns</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-purple-100">
                    <Calendar className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">This Month</p>
                    <p className="text-xs text-gray-500">Monthly target</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-purple-600">{formatCurrency(reportData.overview.sales.this_month.sales)}</p>
                  <p className="text-xs text-gray-500">{reportData.overview.sales.this_month.transactions} txns</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Health Dashboard */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Warehouse className="h-5 w-5 text-emerald-600" />
              Inventory Health Monitor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Healthy Stock */}
              <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full bg-green-100">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-700">
                  {reportData.overview.inventory.healthy_stock_items}
                </div>
                <p className="text-xs text-green-600 font-medium">Healthy Stock</p>
                <div className="mt-2">
                  <Progress value={healthyStockPercentage} className="h-1.5" />
                  <p className="text-xs text-green-500 mt-1">{healthyStockPercentage.toFixed(1)}%</p>
                </div>
              </div>

              {/* Low Stock */}
              <div className="text-center p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full bg-yellow-100">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="text-2xl font-bold text-yellow-700">
                  {reportData.overview.inventory.low_stock_items}
                </div>
                <p className="text-xs text-yellow-600 font-medium">Low Stock</p>
                <div className="mt-2">
                  <Progress value={lowStockPercentage} className="h-1.5" />
                  <p className="text-xs text-yellow-500 mt-1">{lowStockPercentage.toFixed(1)}%</p>
                </div>
              </div>

              {/* Out of Stock */}
              <div className="text-center p-4 rounded-lg bg-red-50 border border-red-200">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full bg-red-100">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="text-2xl font-bold text-red-700">
                  {reportData.overview.inventory.out_of_stock_items}
                </div>
                <p className="text-xs text-red-600 font-medium">Out of Stock</p>
                <div className="mt-2">
                  <Progress value={outOfStockPercentage} className="h-1.5" />
                  <p className="text-xs text-red-500 mt-1">{outOfStockPercentage.toFixed(1)}%</p>
                </div>
              </div>

              {/* Expired */}
              <div className="text-center p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-2 rounded-full bg-gray-100">
                  <Clock className="h-6 w-6 text-gray-600" />
                </div>
                <div className="text-2xl font-bold text-gray-700">
                  {reportData.overview.inventory.expired_items}
                </div>
                <p className="text-xs text-gray-600 font-medium">Expired</p>
                <div className="mt-2">
                  <Progress value={expiredPercentage} className="h-1.5" />
                  <p className="text-xs text-gray-500 mt-1">{expiredPercentage.toFixed(1)}%</p>
                </div>
              </div>
            </div>

            {/* Inventory Summary Bar */}
            <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-gray-50 to-gray-100">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-700">Inventory Overview</h4>
                <span className="text-sm text-gray-500">{formatNumber(reportData.overview.inventory.total_products)} total products</span>
              </div>
              <div className="flex rounded-lg overflow-hidden h-3">
                <div 
                  className="bg-green-500" 
                  style={{ width: `${healthyStockPercentage}%` }}
                  title={`Healthy: ${healthyStockPercentage.toFixed(1)}%`}
                />
                <div 
                  className="bg-yellow-500" 
                  style={{ width: `${lowStockPercentage}%` }}
                  title={`Low Stock: ${lowStockPercentage.toFixed(1)}%`}
                />
                <div 
                  className="bg-red-500" 
                  style={{ width: `${outOfStockPercentage}%` }}
                  title={`Out of Stock: ${outOfStockPercentage.toFixed(1)}%`}
                />
                <div 
                  className="bg-gray-500" 
                  style={{ width: `${expiredPercentage}%` }}
                  title={`Expired: ${expiredPercentage.toFixed(1)}%`}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="border border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-100">
                <ArrowUpRight className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Profit Potential</p>
                <p className="text-xs text-blue-600">
                  {formatCurrency(reportData.overview.inventory.potential_profit)} available
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-100">
                <Users className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">Team Efficiency</p>
                <p className="text-xs text-green-600">
                  {staffEfficiency.toFixed(0)}% staff utilization rate
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-100">
                <Target className="h-4 w-4 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-800">Stock Health</p>
                <p className="text-xs text-purple-600">
                  {healthyStockPercentage.toFixed(0)}% products in good condition
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}