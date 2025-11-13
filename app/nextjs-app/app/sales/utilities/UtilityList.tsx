"use client";
import React from "react";
import { Edit, Trash2, RotateCcw, Loader2 } from "lucide-react";
import { Utility } from "@/types/utility/utilities";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface UtilityListProps {
  utilities: Utility[];
  isLoading: boolean;
  totalCount: number;
  page: number;
  pageSize: number;
  onEdit: (utility: Utility) => void;
  onDelete: (id: number) => void;
  onRestoreInventory: (id: number) => void;
  onPageChange: (newPage: number) => void;
}

export const UtilityList: React.FC<UtilityListProps> = ({
  utilities,
  isLoading,
  totalCount,
  page,
  pageSize,
  onEdit,
  onDelete,
  onRestoreInventory,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalCount / pageSize);

  // Format currency for better display
  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K`;
    }
    return amount.toLocaleString();
  };

  // Format date for consistency
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <Card className="border border-gray-200 rounded-xl shadow-lg max-w-7xl mx-auto bg-white">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-t-xl">
        <CardTitle className="text-lg font-semibold text-gray-800">
          Utilities Dashboard
        </CardTitle>
        <CardDescription className="text-sm text-gray-600">
          Manage your recent expenses and inventory
        </CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          </div>
        ) : utilities.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p className="text-sm font-medium">No utilities found.</p>
            <p className="text-sm mt-2">
              Try adjusting your filters or add a new utility to get started.
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Card View */}
            <div className="block md:hidden">
              <div className="divide-y divide-gray-200">
                {utilities.map((utility) => (
                  <div
                    key={utility.id}
                    className="p-4 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-semibold text-gray-900 truncate">
                          {utility.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {utility.utility_type_display} •{" "}
                          {utility.source_type_display}
                        </p>
                      </div>
                      <div className="flex space-x-1 ml-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onEdit(utility)}
                          className="h-8 w-8 border-gray-300 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-800 transition-colors"
                          title="Edit utility"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onDelete(utility.id)}
                          className="h-8 w-8 border-gray-300 text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors"
                          title="Delete utility"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        {utility.is_inventory_based && utility.inventory_deducted && (
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onRestoreInventory(utility.id)}
                            className="h-8 w-8 border-gray-300 text-green-600 hover:bg-green-50 hover:text-green-800 transition-colors"
                            title="Restore inventory"
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-blue-600">
                          KSh {formatAmount(utility.amount)}
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          {utility.shop_name || "No shop"}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500 font-medium">
                        {formatDate(utility.expense_date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className=" mx-4 min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Shop
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {utilities.map((utility) => (
                    <tr
                      key={utility.id}
                      className="hover:bg-gray-50 transition-colors duration-200"
                    >
                      <td className="px-4 py-3 text-sm text-gray-900">
                        <div className="max-w-md truncate" title={utility.title}>
                          {utility.title}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {utility.utility_type_display}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {utility.source_type_display}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-blue-600">
                        KSh {formatAmount(utility.amount)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        <div
                          className="max-w-32 truncate"
                          title={utility.shop_name || "N/A"}
                        >
                          {utility.shop_name || "N/A"}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(utility.expense_date)}
                      </td>
                      {/* <td className="px-4 py-3 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onEdit(utility)}
                            className="h-8 w-8 border-gray-300 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-800 transition-colors"
                            title="Edit utility"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => onDelete(utility.id)}
                            className="h-8 w-8 border-gray-300 text-red-600 hover:bg-red-50 hover:text-red-800 transition-colors"
                            title="Delete utility"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          {utility.is_inventory_based &&
                            utility.inventory_deducted && (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => onRestoreInventory(utility.id)}
                                className="h-8 w-8 border-gray-300 text-green-600 hover:bg-green-50 hover:text-green-800 transition-colors"
                                title="Restore inventory"
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            )}
                        </div>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Pagination */}
        {totalCount > pageSize && (
          <div className="flex flex-col sm:flex-row justify-between items-center px-4 py-3 bg-gray-50 border-t border-gray-200 rounded-b-xl gap-3">
            <p className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold">
                {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalCount)}
              </span>{" "}
              of <span className="font-semibold">{totalCount}</span> utilities
            </p>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => onPageChange(Math.max(page - 1, 1))}
                disabled={page === 1}
                size="sm"
                className="text-sm px-3 h-9 border-gray-300 hover:bg-gray-100"
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600 bg-white border border-gray-300 rounded-lg px-3 py-1.5">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => onPageChange(Math.min(page + 1, totalPages))}
                disabled={page === totalPages}
                size="sm"
                className="text-sm px-3 h-9 border-gray-300 hover:bg-gray-100"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};