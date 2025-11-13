'use client';

import { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  DollarSign,
  Activity,
  FileText,
  Shield,
  BarChart3,
  UserCheck
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function SupervisorDashboard() {
  const [timeFilter, setTimeFilter] = useState('today');

  const dashboardData = {
    revenue: {
      today: 47280,
      week: 285600,
      month: 1203400,
      trend: '+12.5%'
    },
    staff: {
      active: 12,
      total: 15,
      onBreak: 2,
      absent: 1
    },
    inventory: {
      lowStock: 23,
      outOfStock: 5,
      expiringSoon: 12,
      totalItems: 1247
    },
    approvals: {
      pending: 7,
      urgent: 3,
      completed: 45
    }
  };

  const recentActivities = [
    {
      id: 1,
      type: 'approval',
      message: 'Purchase Order #PO-2024-001 approved',
      user: 'John Doe',
      time: '10 minutes ago',
      status: 'completed'
    },
    {
      id: 2,
      type: 'alert',
      message: 'Low stock alert: Paracetamol 500mg',
      user: 'System',
      time: '25 minutes ago',
      status: 'warning'
    },
    {
      id: 3,
      type: 'user',
      message: 'New user Sarah Johnson registered',
      user: 'HR System',
      time: '1 hour ago',
      status: 'info'
    },
    {
      id: 4,
      type: 'sale',
      message: 'Large sale completed: KSh 15,600',
      user: 'Mary Smith',
      time: '2 hours ago',
      status: 'success'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'approval': return <UserCheck className="h-4 w-4" />;
      case 'alert': return <AlertTriangle className="h-4 w-4" />;
      case 'user': return <Users className="h-4 w-4" />;
      case 'sale': return <DollarSign className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-amber-100 text-amber-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      case 'success': return 'bg-emerald-100 text-emerald-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Supervisor Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor operations and manage your team</p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant={timeFilter === 'today' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeFilter('today')}
            className="rounded-xl"
          >
            Today
          </Button>
          <Button
            variant={timeFilter === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeFilter('week')}
            className="rounded-xl"
          >
            This Week
          </Button>
          <Button
            variant={timeFilter === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeFilter('month')}
            className="rounded-xl"
          >
            This Month
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Revenue Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">
              KSh {dashboardData.revenue[timeFilter as keyof typeof dashboardData.revenue].toLocaleString()}
            </div>
            <p className="text-xs text-green-600 mt-1">
              <span className="inline-flex items-center">
                {dashboardData.revenue.trend} from last period
              </span>
            </p>
          </CardContent>
        </Card>

        {/* Staff Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Staff Status</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">
              {dashboardData.staff.active}/{dashboardData.staff.total}
            </div>
            <p className="text-xs text-blue-600 mt-1">
              {dashboardData.staff.onBreak} on break, {dashboardData.staff.absent} absent
            </p>
          </CardContent>
        </Card>

        {/* Inventory Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-800">Inventory Alerts</CardTitle>
            <Package className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-900">
              {dashboardData.inventory.lowStock + dashboardData.inventory.outOfStock}
            </div>
            <p className="text-xs text-amber-600 mt-1">
              {dashboardData.inventory.lowStock} low stock, {dashboardData.inventory.outOfStock} out of stock
            </p>
          </CardContent>
        </Card>

        {/* Approvals Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              {dashboardData.approvals.pending}
            </div>
            <p className="text-xs text-purple-600 mt-1">
              {dashboardData.approvals.urgent} urgent, {dashboardData.approvals.completed} completed today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-gray-600" />
              <span>Recent Activity</span>
            </CardTitle>
            <CardDescription>Latest system activities and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-xs text-gray-500">by {activity.user}</p>
                      <span className="text-gray-300">•</span>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-gray-600" />
              <span>Quick Actions</span>
            </CardTitle>
            <CardDescription>Frequently used supervisor functions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white rounded-xl" size="sm">
              <UserCheck className="mr-2 h-4 w-4" />
              Review Approvals ({dashboardData.approvals.pending})
            </Button>
            <Button variant="outline" className="w-full justify-start rounded-xl" size="sm">
              <Users className="mr-2 h-4 w-4" />
              Manage Staff
            </Button>
            <Button variant="outline" className="w-full justify-start rounded-xl" size="sm">
              <Package className="mr-2 h-4 w-4" />
              Inventory Overview
            </Button>
            <Button variant="outline" className="w-full justify-start rounded-xl" size="sm">
              <BarChart3 className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
            <Button variant="outline" className="w-full justify-start rounded-xl" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              Purchase Orders
            </Button>
            <Button variant="outline" className="w-full justify-start rounded-xl" size="sm">
              <Activity className="mr-2 h-4 w-4" />
              View Audit Logs
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-red-800">
            <AlertTriangle className="h-5 w-5" />
            <span>Critical Alerts</span>
          </CardTitle>
          <CardDescription className="text-red-600">Items requiring immediate attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-red-200">
              <div className="p-2 bg-red-100 rounded-full">
                <Package className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <p className="font-medium text-red-900">Out of Stock</p>
                <p className="text-sm text-red-600">{dashboardData.inventory.outOfStock} items</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-amber-200">
              <div className="p-2 bg-amber-100 rounded-full">
                <Clock className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-amber-900">Urgent Approvals</p>
                <p className="text-sm text-amber-600">{dashboardData.approvals.urgent} pending</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-orange-200">
              <div className="p-2 bg-orange-100 rounded-full">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
              </div>
              <div>
                <p className="font-medium text-orange-900">Expiring Soon</p>
                <p className="text-sm text-orange-600">{dashboardData.inventory.expiringSoon} items</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}