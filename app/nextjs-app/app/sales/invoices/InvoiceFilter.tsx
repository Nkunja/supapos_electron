'"use client";'
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays, Filter, RefreshCw, X } from "lucide-react";

type PeriodOption = {
  label: string;
  value: string;
  description: string;
};

const PERIOD_OPTIONS: PeriodOption[] = [
  { label: "Today", value: "1", description: "Last 24 hours" },
  { label: "7 Days", value: "last_7_days", description: "Past week" },
  { label: "30 Days", value: "30", description: "Last 30 days" },
  { label: "45 Days", value: "45", description: "Last 45 days" },
  { label: "90 Days", value: "90", description: "Last 3 months" },
];

interface InvoiceFilterProps {
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  showCustomRange: boolean;
  setShowCustomRange: (show: boolean) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  isCustomRange: boolean;
  setIsCustomRange: (isCustom: boolean) => void;
  filterLoading: boolean;
  filterInvoicesByPeriod: (period: string) => void;
  filterInvoicesByDateRange: (start: string, end: string) => void;
}

export default function InvoiceFilter({
  selectedPeriod,
  setSelectedPeriod,
  showCustomRange,
  setShowCustomRange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  isCustomRange,
  setIsCustomRange,
  filterLoading,
  filterInvoicesByPeriod,
  filterInvoicesByDateRange,
}: InvoiceFilterProps) {
  const { toast } = require("react-toastify");

  const handlePeriodChange = (period: string) => {
    setSelectedPeriod(period);
    setIsCustomRange(false);
    setShowCustomRange(false);
    filterInvoicesByPeriod(period);
  };

  const handleCustomRangeToggle = () => {
    setShowCustomRange(!showCustomRange);
    if (showCustomRange) {
      setStartDate("");
      setEndDate("");
      if (isCustomRange) {
        setIsCustomRange(false);
        setSelectedPeriod("30");
        filterInvoicesByPeriod("30");
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
      filterInvoicesByDateRange(startDate, endDate);
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
    filterInvoicesByPeriod("30");
  };

  const formatDateRange = () => {
    if (startDate && endDate) {
      const start = new Date(startDate).toLocaleDateString();
      const end = new Date(endDate).toLocaleDateString();
      return `${start} - ${end}`;
    }
    return "";
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-gray-200/50 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <Filter className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            Filter by Date
          </span>
          {filterLoading && (
            <RefreshCw className="h-3 w-3 animate-spin text-blue-600" />
          )}
        </div>

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

        <div className="flex flex-wrap gap-2 mb-3">
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
              {filterLoading &&
                selectedPeriod === option.value &&
                !isCustomRange && (
                  <RefreshCw className="h-3 w-3 mr-1 animate-spin inline" />
                )}
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
                  {filterLoading ? (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin inline" />
                      Applying...
                    </>
                  ) : (
                    "Apply Range"
                  )}
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
      </CardContent>
    </Card>
  );
}