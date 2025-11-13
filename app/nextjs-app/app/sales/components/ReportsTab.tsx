"use client";

import { useState } from "react";
import { StatsCards } from "./StatsCards";
import { TopProducts } from "./TopProducts";
import { RecentInvoices } from "./RecentInvoices";
import { SalesStats, Invoice } from "../types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, TrendingUp, RefreshCw, Search, X } from "lucide-react";

interface ReportsTabProps {
  salesStats: SalesStats | null;
  recentInvoices: Invoice[]; // All invoices (renamed from recentInvoices for backward compatibility)
  loadingInvoices: boolean;
  onRefreshInvoices: () => void;
  onPeriodChange?: (period: string) => void;
  loading?: boolean;
}

type PeriodOption = {
  label: string;
  value: string;
  description: string;
};

const PERIOD_OPTIONS: PeriodOption[] = [
  { label: "Today", value: "1", description: "Last 24 hours" },
  { label: "7 Days", value: "last_7_days", description: "Past week" },
  { label: "This Week", value: "week", description: "Current week" },
  { label: "This Month", value: "month", description: "Current month" },
  { label: "30 Days", value: "30", description: "Last 30 days" },
  { label: "45 Days", value: "45", description: "Last 45 days" },
  { label: "90 Days", value: "90", description: "Last 3 months" },
];

export function ReportsTab({
  salesStats,
  recentInvoices,
  loadingInvoices,
  onRefreshInvoices,
  onPeriodChange,
  loading = false,
}: ReportsTabProps) {
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [productSearch, setProductSearch] = useState("");

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    onPeriodChange?.(period);
  };

  const handleClearSearch = () => {
    setProductSearch("");
  };

  // Filter invoices by product name
  const filteredInvoices = recentInvoices.filter((invoice) => {
    if (!productSearch.trim()) return true;

    const searchLower = productSearch.toLowerCase();
    return invoice.items.some(
      (item) =>
        item.product_name?.toLowerCase().includes(searchLower) ||
        (item.product_generic_name &&
          item.product_generic_name.toLowerCase().includes(searchLower)) ||
        (item.product_form &&
          item.product_form.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="space-y-6">
      {/* Header with Period Selector */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sales Reports</h1>
            <p className="text-gray-600">Track your business performance</p>
          </div>
        </div>

        {/* Period Selector */}
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Calendar className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Time Period
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {PERIOD_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handlePeriodChange(option.value)}
                  disabled={loading}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${
                      selectedPeriod === option.value
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md transform scale-105"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:shadow-sm"
                    }
                    ${
                      loading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:scale-105"
                    }
                  `}
                  title={option.description}
                >
                  {loading && selectedPeriod === option.value && (
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin inline" />
                  )}
                  {option.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Product Search Bar */}
      <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <Search className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              Search by Product
            </span>
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search product name, generic name, or form..."
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-400"
            />
            {productSearch && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                title="Clear search"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            )}
          </div>
          {productSearch && (
            <p className="mt-2 text-sm text-gray-600">
              Found{" "}
              <span className="font-semibold text-blue-600">
                {filteredInvoices.length}
              </span>{" "}
              invoice(s) containing "{productSearch}"
            </p>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}
      {/* <StatsCards salesStats={salesStats} selectedPeriod={selectedPeriod} /> */}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="xl:col-span-1">
          <TopProducts salesStats={salesStats} />
        </div>

        {/* Recent Invoices */}
        <div className="xl:col-span-1">
          <RecentInvoices
            invoices={filteredInvoices}
            loading={loadingInvoices}
            onRefresh={onRefreshInvoices}
          />
        </div>
      </div>
    </div>
  );
}
