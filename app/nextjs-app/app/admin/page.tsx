'use client';

import { useState, useEffect } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Store, 
  Package, 
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  BarChart3,
  Plus,
  Eye,
  Settings,
  Bell
} from 'lucide-react';
import { getDashboardStats } from '@/app/api/dashboard/stats';


interface AdminStats {
  total_users: number;
  total_shops: number;
  total_salespersons: number;
  total_products?: number;
  total_inventory_items?: number;
  unresolved_alerts?: number;
  shops_without_salesperson?: number;
}


interface RecentActivity {
  id: number;
  type: 'sale' | 'inventory' | 'user' | 'alert';
  message: string;
  timestamp: string;
  status: 'success' | 'warning' | 'error';
}

export default function AdminDashboard() {

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      
      const data = await getDashboardStats();
      setStats(data);

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      // Set default values on error
      setStats({
        total_users: 0,
        total_shops: 0,
        total_salespersons: 0,
        total_products: 0,
        total_inventory_items: 0,
        unresolved_alerts: 0,
        shops_without_salesperson: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <ShoppingCart className="h-4 w-4" />;
      case 'inventory':
        return <Package className="h-4 w-4" />;
      case 'user':
        return <Users className="h-4 w-4" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-50';
      case 'warning':
        return 'text-orange-600 bg-orange-50';
      case 'error':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
   <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.total_users || 0}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  +2 this week
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Shops</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.total_shops || 0}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  All operational
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Store className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Products</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.total_products || 0}
                </p>
                <p className="text-sm text-purple-600 mt-1">
                  +15 this month
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Alerts</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats?.unresolved_alerts || 0}
                </p>
                <p className="text-sm text-orange-600 mt-1">
                  Needs attention
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>
              Frequently used administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Register User
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Store className="h-4 w-4 mr-2" />
              Add New Shop
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>
              Latest system activities and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                  <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t">
              <Button variant="outline" className="w-full">
                <Eye className="h-4 w-4 mr-2" />
                View All Activity
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Store className="h-5 w-5" />
              <span>Shop Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-green-900">Shops with Salesperson</p>
                  <p className="text-sm text-green-600">
                    {(stats?.total_shops || 0) - (stats?.shops_without_salesperson || 0)} shops
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-700">Active</Badge>
              </div>
              
              {(stats?.shops_without_salesperson || 0) > 0 && (
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium text-orange-900">Shops without Salesperson</p>
                    <p className="text-sm text-orange-600">
                      {stats?.shops_without_salesperson} shops need assignment
                    </p>
                  </div>
                  <Badge variant="outline" className="text-orange-600 border-orange-200">
                    Attention
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Package className="h-5 w-5" />
              <span>Inventory Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Inventory Items</span>
                <span className="font-semibold">{stats?.total_inventory_items || 0}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Products</span>
                <span className="font-semibold">{stats?.total_products || 0}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Low Stock Alerts</span>
                <Badge variant="outline" className="text-orange-600">
                  {stats?.unresolved_alerts || 0}
                </Badge>
              </div>
              
              <Button variant="outline" className="w-full mt-4">
                <Eye className="h-4 w-4 mr-2" />
                View Inventory Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
</>
  );
}