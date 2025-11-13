"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Filter,
  Calendar,
  Download,
  CalendarDays,
  X,
  RefreshCw,
} from "lucide-react";
import { FilterOptions, PeriodFilter } from "../types";
import { toast } from "react-toastify";

interface SalesFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  totalInvoices: number;
  filteredInvoices?: any[];
  filterLoading?: boolean;
  onCustomDateRange?: (start: string, end: string) => void;
}

type PeriodOption = {
  label: string;
  value: string;
  description: string;
};

const PERIOD_OPTIONS: PeriodOption[] = [
  { label: "Today", value: "1", description: "Last 24 hours" },
  { label: "7 Days", value: "7", description: "Past week" },
  { label: "30 Days", value: "30", description: "Last 30 days" },
  { label: "45 Days", value: "45", description: "Last 45 days" },
  { label: "90 Days", value: "90", description: "Last 3 months" },
];

export function SalesFilters({
  filters,
  onFiltersChange,
  totalInvoices,
  filteredInvoices = [],
  filterLoading = false,
  onCustomDateRange,
}: SalesFiltersProps) {
  const [searchValue, setSearchValue] = useState(filters.search || "");
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCustomRange, setIsCustomRange] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("30");

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "completed", label: "Completed" },
    { value: "pending", label: "Pending" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const paymentMethodOptions = [
    { value: "all", label: "All Methods" },
    { value: "cash", label: "Cash" },
    { value: "mpesa", label: "M-Pesa" },
    { value: "bank", label: "Bank Transfer" },
  ];

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    setIsCustomRange(false);
    setShowCustomRange(false);

    // Update filters with the period
    onFiltersChange({
      ...filters,
      period: period as PeriodFilter,
      date_from: undefined,
      date_to: undefined,
    });
  };

  const handleCustomRangeToggle = () => {
    setShowCustomRange(!showCustomRange);
    if (showCustomRange) {
      setStartDate("");
      setEndDate("");
      if (isCustomRange) {
        setIsCustomRange(false);
        setSelectedPeriod("30");
        onFiltersChange({
          ...filters,
          period: "30" as PeriodFilter,
        });
      }
    }
  };

  const handleDateRangeSubmit = () => {
    if (startDate && endDate) {
      if (new Date(startDate) > new Date(endDate)) {
        toast.error("Start date cannot be later than end date");
        return;
      }
      setIsCustomRange(true);
      setSelectedPeriod("custom");
      setShowCustomRange(false);

      // Notify parent component about custom date range
      if (onCustomDateRange) {
        onCustomDateRange(startDate, endDate);
      }

      onFiltersChange({
        ...filters,
        period: "custom" as PeriodFilter,
      });
    } else {
      toast.error("Please select both start and end dates");
    }
  };

  const clearCustomRange = () => {
    setStartDate("");
    setEndDate("");
    setIsCustomRange(false);
    setSelectedPeriod("30");
    setShowCustomRange(false);

    // Clear custom date range in parent
    if (onCustomDateRange) {
      onCustomDateRange("", "");
    }

    onFiltersChange({
      ...filters,
      period: "30" as PeriodFilter,
    });
  };

  const formatDateRange = () => {
    if (startDate && endDate) {
      const start = new Date(startDate).toLocaleDateString();
      const end = new Date(endDate).toLocaleDateString();
      return `${start} - ${end}`;
    }
    return "";
  };

  const handleStatusChange = (status: string) => {
    onFiltersChange({
      ...filters,
      status: status === "all" ? undefined : status,
    });
  };

  const handlePaymentMethodChange = (payment_method: string) => {
    onFiltersChange({
      ...filters,
      payment_method: payment_method === "all" ? undefined : payment_method,
    });
  };

  const handleSearch = () => {
    onFiltersChange({ ...filters, search: searchValue || undefined });
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const clearFilters = () => {
    setSearchValue("");
    setStartDate("");
    setEndDate("");
    setIsCustomRange(false);
    setSelectedPeriod("30");
    setShowCustomRange(false);

    onFiltersChange({
      period: "30" as PeriodFilter,
      status: undefined,
      payment_method: undefined,
      search: undefined,
    });
  };

  const exportToCSV = () => {
    if (!filteredInvoices || filteredInvoices.length === 0) {
      toast.error("No data to export");
      return;
    }

    try {
      // Define CSV headers
      const headers = [
        "Invoice Number",
        "Date",
        "Customer",
        "Status",
        "Payment Method",
        "Total Amount",
        "Amount Paid",
        "Balance",
        "Tax Amount",
        "Discount Amount",
      ];

      // Convert invoices to CSV rows
      const rows = filteredInvoices.map((invoice) => [
        invoice.invoice_number || "",
        new Date(invoice.created_at).toLocaleDateString(),
        invoice.customer_name || invoice.customer?.name || "",
        invoice.status || "",
        invoice.payment_method || "",
        invoice.total_amount || "0",
        invoice.amount_paid || "0",
        (
          Number(invoice.total_amount || 0) - Number(invoice.amount_paid || 0)
        ).toString(),
        invoice.tax_amount || "0",
        invoice.discount_amount || "0",
      ]);

      // Combine headers and rows
      const csvContent = [
        headers.join(","),
        ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
      ].join("\n");

      // Create and download the file
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);

      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `sales_export_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`Exported ${filteredInvoices.length} invoices to CSV`);
    } catch (error) {
      console.error("Error exporting to CSV:", error);
      toast.error("Failed to export data");
    }
  };

  const hasActiveFilters =
    filters.status || filters.payment_method || filters.search || isCustomRange;

  return (
    <Card className="mb-6 bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Sales Filters</span>
            <Badge variant="secondary" className="ml-2">
              {totalInvoices} invoices
            </Badge>
          </CardTitle>
          <Button
            onClick={exportToCSV}
            disabled={!filteredInvoices || filteredInvoices.length === 0}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            size="sm"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Period Filter - Horizontal Buttons */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Filter by Period</span>
            {filterLoading && (
              <RefreshCw className="h-3 w-3 animate-spin text-blue-600 ml-2" />
            )}
          </label>

          {isCustomRange && (
            <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Custom Range: {formatDateRange()}
                  </span>
                </div>
                <button
                  onClick={clearCustomRange}
                  className="p-1 hover:bg-blue-100 rounded transition-colors"
                  title="Clear custom range"
                >
                  <X className="h-3 w-3 text-blue-600" />
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {PERIOD_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handlePeriodChange(option.value)}
                disabled={filterLoading}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${
                    selectedPeriod === option.value && !isCustomRange
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md transform scale-105"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:shadow-sm"
                  }
                  ${
                    filterLoading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:scale-105"
                  }
                `}
                title={option.description}
              >
                {option.label}
              </button>
            ))}

            <button
              onClick={handleCustomRangeToggle}
              disabled={filterLoading}
              className={`
                px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1
                ${
                  showCustomRange || isCustomRange
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:shadow-sm"
                }
                ${
                  filterLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-105"
                }
              `}
              title="Select custom date range"
            >
              <CalendarDays className="h-3 w-3" />
              Custom Range
            </button>
          </div>

          {showCustomRange && (
            <div className="border-t pt-3 mt-3">
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleDateRangeSubmit}
                    disabled={!startDate || !endDate || filterLoading}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Apply Range
                  </button>
                  <button
                    onClick={handleCustomRangeToggle}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Other Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Status Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <Select
              value={filters.status || "all"}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Payment Method Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <Select
              value={filters.payment_method || "all"}
              onValueChange={handlePaymentMethodChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Search</label>
            <div className="flex space-x-2">
              <Input
                placeholder="Invoice number, customer..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="flex-1"
              />
              <Button size="sm" onClick={handleSearch}>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              <span className="text-sm text-gray-600">Active filters:</span>
              {filters.status && (
                <Badge variant="secondary" className="text-xs">
                  Status: {filters.status}
                </Badge>
              )}
              {filters.payment_method && (
                <Badge variant="secondary" className="text-xs">
                  Payment: {filters.payment_method}
                </Badge>
              )}
              {filters.search && (
                <Badge variant="secondary" className="text-xs">
                  Search: "{filters.search}"
                </Badge>
              )}
              {isCustomRange && (
                <Badge variant="secondary" className="text-xs">
                  Custom Date Range
                </Badge>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
