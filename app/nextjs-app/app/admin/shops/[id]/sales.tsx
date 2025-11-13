'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Filter
} from 'lucide-react';
import { CompleteShopReport } from '@/types/shop-reports';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SalesProps {
  reportData: CompleteShopReport;
  formatCurrency: (amount: number) => string;
  formatDate: (dateString: string) => string;
}

export default function Sales({ reportData, formatCurrency, formatDate }: SalesProps) {
  const [dateFilter, setDateFilter] = useState<7 | 14 | 21 | 30>(7);

  // Filter daily sales data based on selected period
  const getFilteredData = (days: number) => {
    return reportData.sales_analytics.daily_sales
      .slice(-days) // Get last N days
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); // Sort chronologically
  };

  const filteredData = getFilteredData(dateFilter);

  // Chart options
  const barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.dataset.label || '';
            const value = context.dataset.label === 'Revenue' 
              ? formatCurrency(Number(context.parsed.y))
              : context.parsed.y;
            return `${label}: ${value}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        position: 'left',
        ticks: {
          callback: function(value) {
            return formatCurrency(Number(value));
          }
        }
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value) {
            return `${value} txns`;
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
  };

  const lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${formatCurrency(Number(context.parsed.y))}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
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


  const salesBarData = {
    labels: filteredData.map(day => formatDate(day.date)),
    datasets: [
      {
        label: 'Revenue',
        data: filteredData.map(day => day.sales),
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
        yAxisID: 'y',
      },
      {
        label: 'Transactions',
        data: filteredData.map(day => day.transactions),
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgb(16, 185, 129)',
        borderWidth: 1,
        yAxisID: 'y1',
      }
    ],
  };

  // Sales Trend Line Chart Data
  const salesTrendData = {
    labels: filteredData.map(day => formatDate(day.date)),
    datasets: [
      {
        label: 'Daily Revenue',
        data: filteredData.map(day => day.sales),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
        fill: true,
      }
    ],
  };

  // Calculate summary stats for filtered data
  const totalRevenue = filteredData.reduce((sum, day) => sum + day.sales, 0);
  const totalTransactions = filteredData.reduce((sum, day) => sum + day.transactions, 0);
  const avgDailyRevenue = totalRevenue / filteredData.length;
  const avgTransactionValue = totalRevenue / totalTransactions;

  // Get best and worst performing days
  const bestDay = filteredData.reduce((max, day) => day.sales > max.sales ? day : max, filteredData[0]);
  const worstDay = filteredData.reduce((min, day) => day.sales < min.sales ? day : min, filteredData[0]);

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-KE').format(value);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totalRevenue)}
            </div>
            <p className="text-xs text-gray-500">Last {dateFilter} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatNumber(totalTransactions)}
            </div>
            <p className="text-xs text-gray-500">Last {dateFilter} days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg Daily Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {formatCurrency(avgDailyRevenue)}
            </div>
            <p className="text-xs text-gray-500">Per day average</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(avgTransactionValue)}
            </div>
            <p className="text-xs text-gray-500">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Sales Analytics
            </CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <div className="flex gap-2">
                {[7, 14, 21, 30].map((days) => (
                  <Button
                    key={days}
                    variant={dateFilter === days ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setDateFilter(days as 7 | 14 | 21 | 30)}
                  >
                    {days}d
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <Bar data={salesBarData} options={barChartOptions} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Highlights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-green-800">Best Day</p>
                    <p className="text-xs text-green-600">{formatDate(bestDay.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-700">
                      {formatCurrency(bestDay.sales)}
                    </p>
                    <p className="text-xs text-green-600">{bestDay.transactions} transactions</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-red-800">Lowest Day</p>
                    <p className="text-xs text-red-600">{formatDate(worstDay.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-red-700">
                      {formatCurrency(worstDay.sales)}
                    </p>
                    <p className="text-xs text-red-600">{worstDay.transactions} transactions</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-blue-800">Growth Potential</p>
                    <p className="text-xs text-blue-600">If every day was your best day</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-700">
                      {formatCurrency(bestDay.sales * dateFilter)}
                    </p>
                    <p className="text-xs text-blue-600">
                      +{formatCurrency(bestDay.sales * dateFilter - totalRevenue)} potential
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reportData.sales_analytics.top_products.slice(0, 6).map((product, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{product.product_name}</p>
                      <p className="text-xs text-gray-600">{product.quantity_sold} units sold</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{formatCurrency(product.revenue)}</p>
                    <div className="w-20 bg-gray-200 rounded-full h-1.5 mt-1">
                      <div 
                        className="bg-blue-600 h-1.5 rounded-full" 
                        style={{ 
                          width: `${(product.revenue / Math.max(...reportData.sales_analytics.top_products.map(p => p.revenue))) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Salesperson Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Salesperson Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportData.sales_analytics.salesperson_performance.map((perf, index) => (
              <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <span className="font-medium text-sm">
                      {perf.created_by__first_name} {perf.created_by__last_name}
                    </span>
                    <p className="text-xs text-gray-500">{perf.created_by__email}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Total Sales</span>
                    <span className="font-bold text-blue-600">{formatCurrency(perf.total_sales)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Transactions</span>
                    <span className="font-medium">{formatNumber(perf.transactions)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Avg Transaction</span>
                    <span className="font-medium">{formatCurrency(perf.avg_transaction)}</span>
                  </div>
                  
                  {/* Performance indicator */}
                  <div className="pt-2 border-t">
                    <div className="flex justify-between items-center text-xs">
                      <span>Performance</span>
                      <div className="flex items-center gap-1">
                        <div className="w-12 bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-green-500 h-1.5 rounded-full" 
                            style={{ 
                              width: `${Math.min(100, (perf.total_sales / Math.max(...reportData.sales_analytics.salesperson_performance.map(p => p.total_sales))) * 100)}%` 
                            }}
                          />
                        </div>
                        <span className="text-green-600 font-medium">
                          {Math.round((perf.total_sales / Math.max(...reportData.sales_analytics.salesperson_performance.map(p => p.total_sales))) * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}