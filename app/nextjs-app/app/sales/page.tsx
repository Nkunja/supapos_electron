"use client";

import { useState, useEffect, useMemo } from "react";
import {
  TrendingUp,
  ShoppingCart,
  Package,
  DollarSign,
  Users,
  Calendar,
  BarChart3,
  Clock,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-toastify";
import Link from "next/link";

// import SalesStatsCards from "../admin/sales/components/SalesStatsCards";
// import { SalesStatsCards } from "../admin/sales/components";
// Import your API functions
import { getSalesStats, getRecentInvoices } from "@/app/api/sales";

// Import types
import { SalesStats, Invoice } from "./types";

export default function DashboardPage() {
  const [salesStats, setSalesStats] = useState<SalesStats | null>(null);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [invoicesLoading, setInvoicesLoading] = useState(true);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Load sales stats
        const statsData = await getSalesStats("7"); // Last 7 days for dashboard
        setSalesStats(statsData);

        // Load recent invoices
        const invoicesData = await getRecentInvoices(3); // Just 3 for overview
        setRecentInvoices(invoicesData.results || []);
      } catch (error) {
        console.error("Error loading dashboard data:", error);

        // Set default values on error
        setSalesStats({
          shop: { id: 1, name: "Business" },
          period_days: 7,
          summary: {
            total_sales: 0,
            total_invoices: 0,
            total_items_sold: 0,
            average_invoice_value: 0,
          },
          top_products: [],
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);
  const formatCurrency = (amount: number | string) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(Number(amount));
  };

  const filteredTotals = useMemo(() => {
    const totals = {
      totalAmount: 0,
      totalPaid: 0,
      totalTax: 0,
      totalDiscount: 0,
      invoiceCount: filteredInvoices.length,
    };

    filteredInvoices.forEach((invoice) => {
      totals.totalAmount += Number(invoice.total_amount) || 0;
      totals.totalPaid += Number(invoice.amount_paid) || 0;
      totals.totalTax += Number(invoice.tax_amount) || 0;
      totals.totalDiscount += Number(invoice.discount_amount) || 0;
    });

    return totals;
  }, [filteredInvoices]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentTime = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const quickActions = [
    {
      title: "Make a Sale",
      description: "Start a new sales transaction",
      icon: ShoppingCart,
      href: "/sales/pos",
      color: "blue",
    },
    {
      title: "View Reports",
      description: "Check sales analytics",
      icon: BarChart3,
      href: "/sales/reports",
      color: "green",
    },
    {
      title: "Manage Inventory",
      description: "Check stock levels",
      icon: Package,
      href: "/sales/inventory",
      color: "purple",
    },
    {
      title: "Process Returns",
      description: "Handle returns & refunds",
      icon: Users,
      href: "/sales/returns",
      color: "orange",
    },
  ];

  const colorClasses = {
    blue: "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200",
    green: "bg-green-50 hover:bg-green-100 text-green-700 border-green-200",
    purple:
      "bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200",
    orange:
      "bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200",
  };

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome Back!</h1>
            <p className="text-blue-100 text-lg">
              {currentDate} • {currentTime}
            </p>
            <p className="text-blue-200 mt-2">
              Ready to manage your business sales and inventory
            </p>
          </div>
          <div className="hidden lg:block">
            <div className="text-right">
              <p className="text-blue-100">System Status</p>
              <div className="flex items-center justify-end mt-2">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="font-medium">All Systems Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      {/* <div className="space-y-6">
        <SalesStatsCards
          filteredTotals={filteredTotals}
          formatCurrency={formatCurrency}
        />
      </div> */}

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className={`
                  block p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-md
                `}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 bg-white shadow-sm">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{action.title}</h3>
                  <p className="text-sm opacity-80 mb-3">
                    {action.description}
                  </p>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Sales */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Recent Sales</h3>
            <Link
              href="/sales/reports"
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              View all →
            </Link>
          </div>

          {recentInvoices.length > 0 ? (
            <div className="space-y-4">
              {recentInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <ShoppingCart className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        #{invoice.invoice_number}
                      </p>
                      <p className="text-sm text-gray-600">
                        {invoice.customer_name}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      KSH {parseFloat(invoice.total_amount).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(invoice.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No recent sales</p>
            </div>
          )}
        </div>

        {/* System Overview */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            System Overview
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                  <Clock className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-green-800">System Backup</p>
                  <p className="text-sm text-green-600">
                    Completed successfully
                  </p>
                </div>
              </div>
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                Today
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                  <Package className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-blue-800">Inventory Status</p>
                  <p className="text-sm text-blue-600">All systems normal</p>
                </div>
              </div>
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">
                Online
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                  <Users className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-purple-800">Active Session</p>
                  <p className="text-sm text-purple-600">
                    Ready for transactions
                  </p>
                </div>
              </div>
              <span className="text-xs text-purple-600 bg-purple-100 px-2 py-1 rounded">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
