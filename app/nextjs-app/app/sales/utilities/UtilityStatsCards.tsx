import React, { useState, useEffect } from "react";
import { DollarSign, Package, TrendingUp, AlertTriangle } from "lucide-react";
import { getUtilityStatistics } from "@/app/api/utilities";
import { UtilityStats, UTILITY_TYPE_CHOICES } from "@/types/utility/utilities";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getMyShops, getShopTotalCashSpent } from "@/app/api/shop";
import { Shop } from "@/types/shop";

interface UtilityStatsCardsProps {
  shopId?: number | null;
  filters?: {
    start_date?: string;
    end_date?: string;
    user_id?: number;
  };
}
interface Props {
  selectedShopId: number;
}

export const UtilityStatsCards: React.FC<UtilityStatsCardsProps> = ({
  shopId,
  filters,
}) => {
  const [stats, setStats] = useState<UtilityStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [totalCashSpent, setTotalCashSpent] = useState<number>(0);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getUtilityStatistics({
          shop_id: shopId ?? undefined,
          start_date: filters?.start_date,
          end_date: filters?.end_date,
          user_id: filters?.user_id,
        });
        setStats(response);
      } catch (err) {
        setError("Failed to load utility statistics");
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, [shopId, filters?.start_date, filters?.end_date, filters?.user_id]);

  useEffect(() => {
    const fetchCashSpent = async () => {
      try {
        const shops = await getMyShops();
        const shopList: Shop[] = Array.isArray(shops) ? shops : (shops.shops ?? []);
        if (shopList.length > 0) {
          const firstShopId = shopList[0].id;
          const data = await getShopTotalCashSpent(firstShopId);
          setTotalCashSpent(data.total_utility_cash_spent ?? 0);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchCashSpent();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center py-4">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Alert className="border-red-200 bg-red-50 mb-4">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800 text-sm">
          {error || "No statistics available"}
        </AlertDescription>
      </Alert>
    );
  }

  // Get the most used utility type label
  const mostUsedTypeLabel =
    UTILITY_TYPE_CHOICES.find(
      (type) => type.value === stats.most_used_utility_type
    )?.label || "N/A";

  // Ensure numeric values have fallbacks
  const totalAmountSpent = stats.total_amount_spent ?? 0;
  const totalInventoryValueUsed = stats.total_inventory_value_used ?? 0;
  //   const totalCashSpent = stats.total_cash_spent ?? 0;

  // Format large numbers to be more readable
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toLocaleString();
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
      <Card className="border-gray-200 shadow-sm p-3 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1 mr-2">
            <p className="text-xs font-medium text-gray-500 mb-1 truncate">
              Total Utilities
            </p>
            <p className="text-lg font-bold text-gray-900 truncate">
              {stats.total_utilities ?? 0}
            </p>
          </div>
          <div className="flex-shrink-0">
            <Package className="w-5 h-5 text-blue-500" />
          </div>
        </div>
      </Card>

      <Card className="border-gray-200 shadow-sm p-3 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1 mr-2">
            <p className="text-xs font-medium text-gray-500 mb-1 truncate">
              Total Spent
            </p>
            <p className="text-lg font-bold text-blue-600 truncate">
              KSh {formatCurrency(totalAmountSpent)}
            </p>
          </div>
          <div className="flex-shrink-0">
            <DollarSign className="w-5 h-5 text-blue-500" />
          </div>
        </div>
      </Card>

      <Card className="border-gray-200 shadow-sm p-3 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1 mr-2">
            <p className="text-xs font-medium text-gray-500 mb-1 truncate">
              Inventory Used
            </p>
            <p className="text-lg font-bold text-green-600 truncate">
              KSh {formatCurrency(totalInventoryValueUsed)}
            </p>
          </div>
          <div className="flex-shrink-0">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </div>
      </Card>

      <Card className="border-gray-200 shadow-sm p-3 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <div className="min-w-0 flex-1 mr-2">
            <p className="text-xs font-medium text-gray-500 mb-1 truncate">
              Cash Spent
            </p>
            <p className="text-lg font-bold text-purple-600 truncate">
              KSh {formatCurrency(totalCashSpent)}
            </p>
          </div>
          <div className="flex-shrink-0">
            <DollarSign className="w-5 h-5 text-purple-500" />
          </div>
        </div>
      </Card>
    </div>
  );
};
