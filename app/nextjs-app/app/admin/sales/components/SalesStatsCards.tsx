"use client";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, Activity } from "lucide-react";

type StatsCardProps = {
  filteredTotals: {
    totalAmount: number;
    totalTax: number;
    invoiceCount: number;
  };
  lastRefresh?: Date;
  onRefresh?: () => void;
  isRefreshing?: boolean;
  formatCurrency: (amount: number) => string;
};

export function SalesStatsCards({
  filteredTotals,
  formatCurrency,
}: StatsCardProps) {
  return (
    <div className=" mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Sales</p>
              <p className="text-2xl font-bold text-blue-900">
                {formatCurrency(filteredTotals.totalAmount)}
              </p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">
                Tax Collected
              </p>
              <p className="text-2xl font-bold text-purple-900">
                {formatCurrency(filteredTotals.totalTax)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">
                Invoice Count
              </p>
              <p className="text-2xl font-bold text-orange-900">
                {filteredTotals.invoiceCount}
              </p>
            </div>
            <Activity className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
