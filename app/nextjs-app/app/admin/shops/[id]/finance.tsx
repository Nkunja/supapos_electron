'use client';

import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Calendar,
  Target,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { CompleteShopReport, EnhancedFinancialSummary } from '@/types/shop-reports';

// Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface FinancialProps {
  reportData: CompleteShopReport;
  formatCurrency: (amount: number) => string;
}

export default function Financial({ reportData, formatCurrency }: FinancialProps) {
  // Check if we have enhanced financial data
  const hasEnhancedData = 'daily_trends' in reportData.financial_summary;
  const financialData = reportData.financial_summary as EnhancedFinancialSummary;

  // If we don't have enhanced data, show basic financial view
  if (!hasEnhancedData) {
    return (
      <div className="space-y-6">
        {/* Basic Financial View */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {formatCurrency(reportData.financial_summary.financial_periods.this_month.revenue)}
                </div>
                <p className="text-sm text-gray-600">
                  {reportData.financial_summary.financial_periods.this_month.transactions} transactions
                </p>
                <p className="text-xs text-gray-500">
                  Avg: {formatCurrency(reportData.financial_summary.financial_periods.this_month.avg_transaction)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {formatCurrency(reportData.financial_summary.financial_periods.this_week.revenue)}
                </div>
                <p className="text-sm text-gray-600">
                  {reportData.financial_summary.financial_periods.this_week.transactions} transactions
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {formatCurrency(reportData.financial_summary.financial_periods.today.revenue)}
                </div>
                <p className="text-sm text-gray-600">
                  {reportData.financial_summary.financial_periods.today.transactions} transactions
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Valuation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-600">Cost Value</p>
                <p className="text-xl font-bold">
                  {formatCurrency(reportData.financial_summary.inventory_valuation.total_cost_value)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Selling Value</p>
                <p className="text-xl font-bold">
                  {formatCurrency(reportData.financial_summary.inventory_valuation.total_selling_value)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Profit Margin</p>
                <p className="text-xl font-bold text-green-600">
                  {reportData.financial_summary.inventory_valuation.potential_profit_margin.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Methods Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reportData.financial_summary.payment_methods.map((method, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div>
                    <p className="font-medium text-sm capitalize">{method.payment_method}</p>
                    <p className="text-xs text-gray-600">{method.count} transactions</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{formatCurrency(method.total_amount)}</p>
                  </div>
                </div>
              ))}
              {reportData.financial_summary.payment_methods.length === 0 && (
                <p className="text-sm text-gray-500 py-4 text-center">No payment data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Notice */}
        <Card className="border-dashed border-2 border-blue-300 bg-blue-50">
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-12 w-12 mx-auto mb-4 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Enhanced Analytics Available</h3>
            <p className="text-sm text-blue-600">
              Upgrade to enhanced financial reporting to see charts, trends, and advanced KPIs.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Enhanced Financial View with Charts
  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-KE').format(value);
  };

  // Chart options
  const lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return formatCurrency(Number(value));
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  const barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return formatCurrency(Number(value));
          }
        }
      }
    },
  };

  // Daily Revenue Trend Chart Data
  const dailyRevenueData = {
    labels: financialData.daily_trends.map(day => day.day_name),
    datasets: [
      {
        label: 'Revenue',
        data: financialData.daily_trends.map(day => day.revenue),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
        fill: true,
      }
    ],
  };

  // Monthly Revenue Trend Chart Data
  const monthlyRevenueData = {
    labels: financialData.monthly_trends.map(month => month.month_short),
    datasets: [
      {
        label: 'Monthly Revenue',
        data: financialData.monthly_trends.map(month => month.revenue),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      }
    ],
  };

  // Payment Methods Chart Data
  const paymentMethodsData = {
    labels: financialData.payment_methods.map(method => method.payment_method.toUpperCase()),
    datasets: [
      {
        data: financialData.payment_methods.map(method => method.total_amount),
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 2,
      }
    ],
  };

  return (
    <div className="space-y-6">
      {/* Key Performance Indicators */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Growth</CardTitle>
            {financialData.growth_metrics.monthly_growth_rate >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${financialData.growth_metrics.monthly_growth_rate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercentage(financialData.growth_metrics.monthly_growth_rate)}
            </div>
            <p className="text-xs text-muted-foreground">vs last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Daily Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(financialData.kpis.avg_daily_revenue)}
            </div>
            <p className="text-xs text-muted-foreground">this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(financialData.kpis.total_customers_this_month)}
            </div>
            <p className="text-xs text-muted-foreground">this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Margin</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {financialData.growth_metrics.profit_margin_estimate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">estimated</p>
          </CardContent>
        </Card>
      </div>

      {/* Period Comparison - Enhanced */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="text-3xl font-bold text-blue-600">
                  {formatCurrency(financialData.financial_periods.this_month.revenue)}
                </div>
                <p className="text-sm text-gray-600">
                  {formatNumber(financialData.financial_periods.this_month.transactions)} transactions
                </p>
              </div>
              
              <div className="pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span>Avg Transaction</span>
                  <span className="font-medium">
                    {formatCurrency(financialData.financial_periods.this_month.avg_transaction)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Discounts</span>
                  <span className="text-red-600">
                    -{formatCurrency(financialData.financial_periods.this_month.discounts_given)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax Collected</span>
                  <span className="text-green-600">
                    {formatCurrency(financialData.financial_periods.this_month.tax_collected)}
                  </span>
                </div>
              </div>

              <Badge 
                variant={financialData.growth_metrics.monthly_growth_rate >= 0 ? 'default' : 'destructive'}
                className="w-full justify-center"
              >
                {formatPercentage(financialData.growth_metrics.monthly_growth_rate)} vs last month
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="text-3xl font-bold text-green-600">
                  {formatCurrency(financialData.financial_periods.this_week.revenue)}
                </div>
                <p className="text-sm text-gray-600">
                  {formatNumber(financialData.financial_periods.this_week.transactions)} transactions
                </p>
              </div>
              
              <div className="pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span>Avg Transaction</span>
                  <span className="font-medium">
                    {formatCurrency(financialData.financial_periods.this_week.avg_transaction)}
                  </span>
                </div>
              </div>

              <Badge 
                variant={financialData.growth_metrics.weekly_growth_rate >= 0 ? 'default' : 'destructive'}
                className="w-full justify-center"
              >
                {formatPercentage(financialData.growth_metrics.weekly_growth_rate)} vs last week
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="text-3xl font-bold text-purple-600">
                  {formatCurrency(financialData.financial_periods.today.revenue)}
                </div>
                <p className="text-sm text-gray-600">
                  {formatNumber(financialData.financial_periods.today.transactions)} transactions
                </p>
              </div>
              
              <div className="pt-2 border-t">
                <div className="flex justify-between text-sm">
                  <span>Avg Transaction</span>
                  <span className="font-medium">
                    {formatCurrency(financialData.financial_periods.today.avg_transaction)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Tabs */}
      <Tabs defaultValue="daily" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="daily">Daily Trends</TabsTrigger>
          <TabsTrigger value="monthly">Monthly Analysis</TabsTrigger>
          <TabsTrigger value="payments">Payment Methods</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5" />
                Daily Revenue Trends (Last 7 Days)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Line data={dailyRevenueData} options={lineChartOptions} />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {financialData.daily_trends.map((day, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{day.day_name}</CardTitle>
                  <p className="text-sm text-gray-600">{new Date(day.date).toLocaleDateString()}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Revenue</span>
                      <span className="font-bold">{formatCurrency(day.revenue)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Transactions</span>
                      <span>{day.transactions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Avg Transaction</span>
                      <span>{formatCurrency(day.avg_transaction)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="monthly" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Monthly Revenue Trends (Last 12 Months)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <Bar data={monthlyRevenueData} options={barChartOptions} />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {financialData.monthly_trends.slice(-6).map((month, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{month.month_short}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatCurrency(month.revenue)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatNumber(month.transactions)} transactions
                    </div>
                    <div className="text-xs text-gray-500">
                      Avg: {formatCurrency(month.avg_transaction)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Payment Methods Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center">
                  <Doughnut 
                    data={paymentMethodsData} 
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'bottom' as const,
                        },
                        tooltip: {
                          callbacks: {
                            label: function(context: { label: string; parsed: any; dataset: { data: any[]; }; }) {
                              const label = context.label || '';
                              const value = formatCurrency(Number(context.parsed));
                              const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                              const percentage = ((Number(context.parsed) / total) * 100).toFixed(1);
                              return `${label}: ${value} (${percentage}%)`;
                            }
                          }
                        }
                      }
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Methods Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {financialData.payment_methods.map((method, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm capitalize">{method.payment_method}</p>
                        <p className="text-xs text-gray-600">{formatNumber(method.count)} transactions</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{formatCurrency(method.total_amount)}</p>
                        <p className="text-xs text-gray-500">
                          {((method.total_amount / financialData.payment_methods.reduce((sum, m) => sum + m.total_amount, 0)) * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Inventory Valuation - Enhanced */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory & Profit Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Inventory Cost</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(financialData.inventory_valuation.total_cost_value)}
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Inventory Value</p>
              <p className="text-2xl font-bold text-blue-600">
                {formatCurrency(financialData.inventory_valuation.total_selling_value)}
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Potential Profit</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(financialData.inventory_valuation.total_selling_value - financialData.inventory_valuation.total_cost_value)}
              </p>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Profit Margin</p>
              <p className="text-2xl font-bold text-green-600">
                {financialData.inventory_valuation.potential_profit_margin.toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Best Performance Insights */}
      {financialData.kpis.best_day_this_month && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Best Day This Month</p>
                <p className="text-lg font-bold text-blue-600">
                  {new Date(financialData.kpis.best_day_this_month.created_at__date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  {formatCurrency(financialData.kpis.best_day_this_month.daily_revenue)}
                </p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Estimated Monthly Profit</p>
                <p className="text-lg font-bold text-green-600">
                  {formatCurrency(financialData.growth_metrics.estimated_monthly_profit)}
                </p>
                <p className="text-sm text-gray-600">
                  {financialData.growth_metrics.profit_margin_estimate.toFixed(1)}% margin
                </p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Monthly Growth</p>
                <p className={`text-lg font-bold ${financialData.growth_metrics.monthly_growth_rate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatPercentage(financialData.growth_metrics.monthly_growth_rate)}
                </p>
                <p className="text-sm text-gray-600">vs last month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}