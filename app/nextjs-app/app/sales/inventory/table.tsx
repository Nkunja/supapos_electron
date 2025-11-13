import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, Calendar, AlertTriangle } from "lucide-react";
import { Inventory } from "@/types/inventory/inventory";

interface InventoryTableProps {
  inventoryData: Inventory[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  readOnly?: boolean;
}

const InventoryTable: React.FC<InventoryTableProps> = ({
  inventoryData,
  currentPage,
  pageSize,
  totalCount,
  loading,
  onPageChange,
  onPageSizeChange,
  readOnly = false,
}) => {
  // Calculate pagination values
  const totalPages = Math.ceil(inventoryData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = inventoryData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    onPageSizeChange(newPageSize);
  };

  const getTotalPieces = (totalUnits: number, piecesPerUnit: number) => {
    return (totalUnits ?? 0) * (piecesPerUnit ?? 1);
  };

  const getStockStatusColor = (
    totalUnits: number,
    piecesPerUnit: number,
    reorderLevel: number
  ) => {
    const totalPieces = getTotalPieces(totalUnits, piecesPerUnit);
    const reorder = reorderLevel ?? 0;

    if (totalPieces === 0) {
      return "text-red-600 bg-red-100 border-red-300";
    } else if (totalPieces <= reorder) {
      return "text-amber-600 bg-amber-100 border-amber-300";
    } else {
      return "text-green-600 bg-green-100 border-green-300";
    }
  };

  const getStockStatusText = (
    totalUnits: number,
    piecesPerUnit: number,
    reorderLevel: number
  ) => {
    const totalPieces = getTotalPieces(totalUnits, piecesPerUnit);
    const reorder = reorderLevel ?? 0;

    if (totalPieces === 0) {
      return "OUT OF STOCK";
    } else if (totalPieces <= reorder) {
      return "LOW STOCK";
    } else {
      return "IN STOCK";
    }
  };

  const getExpiryStatusColor = (expiryDate: string | undefined) => {
    if (!expiryDate) return "text-gray-600 bg-gray-100";

    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysToExpiry = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysToExpiry < 0) {
      return "text-red-600 bg-red-100 border-red-300";
    } else if (daysToExpiry <= 30) {
      return "text-orange-600 bg-orange-100 border-orange-300";
    } else {
      return "text-green-600 bg-green-100 border-green-300";
    }
  };

  const getExpiryStatusText = (expiryDate: string | undefined) => {
    if (!expiryDate) return "NO EXPIRY";

    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysToExpiry = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysToExpiry < 0) {
      return "EXPIRED";
    } else if (daysToExpiry <= 30) {
      return "NEAR EXPIRY";
    } else {
      return "FRESH";
    }
  };

  const getDaysToExpiry = (expiryDate: string | undefined) => {
    if (!expiryDate) return null;

    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysToExpiry = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    return daysToExpiry;
  };

  const isExpired = (expiryDate: string | undefined) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysToExpiry = Math.ceil(
      (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return daysToExpiry < 0;
  };

  const generatePaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if current page is far from start
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          items.push(
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => handlePageChange(i)}
                isActive={currentPage === i}
                className="cursor-pointer"
              >
                {i}
              </PaginationLink>
            </PaginationItem>
          );
        }
      }

      // Show ellipsis if current page is far from end
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Always show last page if there's more than 1 page
      if (totalPages > 1) {
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink
              onClick={() => handlePageChange(totalPages)}
              isActive={currentPage === totalPages}
              className="cursor-pointer"
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
      {/* Alert Banner for Expired Items Only */}
      {paginatedData.some((item) => isExpired(item.expiry_date)) && (
        <div className="bg-red-50 border-l-4 border-red-400 p-3 sm:p-4 mb-4">
          <div className="flex items-center">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-400 flex-shrink-0" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Expired Items Alert
              </h3>
              <p className="text-xs sm:text-sm text-red-700 mt-1">
                {
                  paginatedData.filter((item) => isExpired(item.expiry_date))
                    .length
                }{" "}
                items have expired and should not be sold
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Responsive Table with Horizontal Scroll */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <table
          className="min-w-full divide-y divide-gray-200"
          style={{ minWidth: "1000px" }}
        >
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-2 sm:px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[180px]">
                Product
              </th>
              <th className="px-2 sm:px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px]">
                Batch & Supplier
              </th>
              <th className="px-2 sm:px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px]">
                Purchase Order
              </th>
              <th className="px-2 sm:px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px]">
                Stock Status
              </th>
              <th className="px-2 sm:px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px]">
                Expiry Status
              </th>
              <th className="px-2 sm:px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px]">
                Quantity
              </th>
              <th className="px-2 sm:px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[80px]">
                Form
              </th>
              <th className="px-2 sm:px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px]">
                Expiry Date
              </th>
              <th className="px-2 sm:px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px]">
                Pricing (KSH)
              </th>
              {/* Quantity Overview - Replace the existing quantity_remaining and quantity_received cells */}
              <th className="px-2 sm:px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px]">
                Total Received
              </th>
              <th className="px-2 sm:px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px]">
                In Stock
              </th>
              <th className="px-2 sm:px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px]">
                Sold
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedData.map((item) => {
              const totalPieces = getTotalPieces(
                item.total_units || 0,
                item.pieces_per_unit || 1
              );
              const itemIsExpired = isExpired(item.expiry_date);

              return (
                <tr
                  key={item.id}
                  className={`transition-colors duration-200 ${
                    itemIsExpired ? "bg-red-50" : "hover:bg-gray-50"
                  }`}
                >
                  {/* Product */}
                  <td className="px-2 sm:px-3 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 flex items-center space-x-2">
                          <span className="truncate">
                            {item.product_name || "N/A"}
                          </span>
                          {itemIsExpired && (
                            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                          )}
                        </div>
                        {item.product_generic_name && (
                          <div className="text-xs text-gray-500 truncate">
                            {item.product_generic_name}
                          </div>
                        )}
                        {item.product_description && (
                          <div className="text-xs text-gray-400 truncate">
                            {item.product_description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Batch & Supplier */}
                  <td className="px-2 sm:px-3 py-4">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {item.batch_number || "N/A"}
                    </div>
                    {item.supplier && (
                      <div className="text-xs text-gray-600 mt-1 truncate">
                        <span className="font-medium">Supplier:</span>{" "}
                        {item.supplier}
                      </div>
                    )}
                    {item.barcode && (
                      <div className="text-xs text-gray-400 mt-1 truncate">
                        <span className="font-medium">Barcode:</span>{" "}
                        {item.barcode}
                      </div>
                    )}
                  </td>

                  {/* Purchase Order */}
                  <td className="px-2 sm:px-3 py-4">
                    {item.purchase_order ? (
                      <div className="text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 line-clamp-2">
                          <Package className="w-3 h-3 mr-1 flex-shrink-0" />
                          PO-{item.purchase_order_name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">No PO</span>
                    )}
                    {item.purchase_date && (
                      <div className="text-xs text-gray-500 mt-1 flex items-center">
                        <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">
                          {new Date(item.purchase_date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Stock Status */}
                  <td className="px-2 sm:px-3 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStockStatusColor(
                        item.total_units || 0,
                        item.pieces_per_unit || 1,
                        item.reorder_level
                      )}`}
                    >
                      <span className="hidden sm:inline">
                        {getStockStatusText(
                          item.total_units || 0,
                          item.pieces_per_unit || 1,
                          item.reorder_level
                        )}
                      </span>
                      <span className="sm:hidden">
                        {totalPieces === 0
                          ? "OUT"
                          : totalPieces <= (item.reorder_level || 0)
                          ? "LOW"
                          : "IN"}
                      </span>
                    </span>
                    <div className="text-xs text-gray-500 mt-1">
                      <span className="hidden sm:inline">
                        Reorder at: {item.reorder_level ?? 0}
                      </span>
                      <span className="sm:hidden">
                        R: {item.reorder_level ?? 0}
                      </span>
                    </div>
                  </td>

                  {/* Expiry Status */}
                  <td className="px-2 sm:px-3 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getExpiryStatusColor(
                        item.expiry_date
                      )}`}
                    >
                      <span className="hidden sm:inline">
                        {getExpiryStatusText(item.expiry_date)}
                      </span>
                      <span className="sm:hidden">
                        {item.expiry_date
                          ? getExpiryStatusText(item.expiry_date) === "FRESH"
                            ? "OK"
                            : getExpiryStatusText(item.expiry_date) ===
                              "NEAR EXPIRY"
                            ? "SOON"
                            : "EXP"
                          : "N/A"}
                      </span>
                    </span>
                    {getDaysToExpiry(item.expiry_date) !== null && (
                      <div className="text-xs text-gray-500 mt-1">
                        <span className="hidden sm:inline">
                          {getDaysToExpiry(item.expiry_date)} days
                        </span>
                        <span className="sm:hidden">
                          {getDaysToExpiry(item.expiry_date)}d
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Quantity */}
                  <td className="px-2 sm:px-3 py-4">
                    <div
                      className={`text-sm font-medium ${
                        totalPieces === 0 ? "text-red-600" : "text-gray-900"
                      }`}
                    >
                      <span className="hidden sm:inline">
                        {totalPieces.toLocaleString()} pieces
                      </span>
                      <span className="sm:hidden">
                        {totalPieces.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.total_units ?? 0} × {item.pieces_per_unit ?? 1}
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      {item.unit_of_measurement_display ||
                        item.unit_of_measurement ||
                        "pieces"}
                    </div>
                  </td>

                  {/* Form */}
                  <td className="px-2 sm:px-3 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                      {item.form_display || item.form || "N/A"}
                    </span>
                  </td>

                  {/* Expiry Date */}
                  <td className="px-2 sm:px-3 py-4">
                    <div className="text-sm text-gray-900">
                      <span className="hidden sm:inline">
                        {item.expiry_date
                          ? new Date(item.expiry_date).toLocaleDateString()
                          : "No expiry"}
                      </span>
                      <span className="sm:inline hidden">
                        {item.expiry_date
                          ? new Date(item.expiry_date).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                              }
                            )
                          : "No expiry"}
                      </span>
                    </div>
                    {item.purchase_date && (
                      <div className="text-xs text-gray-500 mt-1">
                        <span className="hidden sm:inline">
                          Purchased:{" "}
                          {new Date(item.purchase_date).toLocaleDateString()}
                        </span>
                        <span className="sm:hidden">
                          P:{" "}
                          {new Date(item.purchase_date).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      </div>
                    )}
                  </td>

                  {/* Pricing */}
                  <td className="px-2 sm:px-3 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      <span className="hidden sm:inline">
                        KSh{" "}
                        {Number(item.selling_price_per_piece ?? 0).toFixed(2)}
                      </span>
                      <span className="sm:hidden">
                        {Number(item.selling_price_per_piece ?? 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">
                      <span className="hidden sm:inline">
                        Cost: KSh{" "}
                        {Number(item.cost_price_per_piece ?? 0).toFixed(2)}
                      </span>
                      <span className="sm:hidden">
                        C: {Number(item.cost_price_per_piece ?? 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="text-xs text-green-600">
                      <span className="hidden sm:inline">
                        Profit: KSh{" "}
                        {(
                          Number(item.selling_price_per_piece ?? 0) -
                          Number(item.cost_price_per_piece ?? 0)
                        ).toFixed(2)}
                      </span>
                      <span className="sm:hidden">
                        P:{" "}
                        {(
                          Number(item.selling_price_per_piece ?? 0) -
                          Number(item.cost_price_per_piece ?? 0)
                        ).toFixed(2)}
                      </span>
                    </div>
                  </td>

                  {/* Total Received */}
                  <td className="px-2 sm:px-3 py-4">
                    <div className="text-sm font-medium text-blue-600">
                      <span className="hidden sm:inline">
                        {item.quantity_received?.toLocaleString() || "0"} pieces
                      </span>
                      <span className="sm:hidden">
                        {item.quantity_received?.toLocaleString() || "0"}
                      </span>
                    </div>
                    {item.purchase_order_name && (
                      <div className="text-xs text-gray-500 mt-1">
                        From: {item.purchase_order_name}
                      </div>
                    )}
                  </td>

                  {/* In Stock (Remaining) */}
                  <td className="px-2 sm:px-3 py-4">
                    {(() => {
                      const remaining = item.quantity_remaining || 0;
                      const received = item.quantity_received || 0;
                      const stockPercentage =
                        received > 0 ? (remaining / received) * 100 : 0;

                      return (
                        <div>
                          <div
                            className={`text-sm font-medium ${
                              remaining === 0
                                ? "text-red-600"
                                : remaining <= (item.reorder_level || 0)
                                ? "text-amber-600"
                                : "text-green-600"
                            }`}
                          >
                            <span className="hidden sm:inline">
                              {remaining.toLocaleString()} pieces
                            </span>
                            <span className="sm:hidden">
                              {remaining.toLocaleString()}
                            </span>
                          </div>
                          {/* Mini progress bar */}
                          <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className={`h-1.5 rounded-full transition-all ${
                                stockPercentage <= 25
                                  ? "bg-red-500"
                                  : stockPercentage <= 50
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                              style={{
                                width: `${Math.min(stockPercentage, 100)}%`,
                              }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {stockPercentage.toFixed(0)}% remaining
                          </div>
                        </div>
                      );
                    })()}
                  </td>

                  {/* Sold */}
                  <td className="px-2 sm:px-3 py-4">
                    {(() => {
                      const received = item.quantity_received || 0;
                      const remaining = item.quantity_remaining || 0;
                      const sold = received - remaining;
                      const soldPercentage =
                        received > 0 ? (sold / received) * 100 : 0;

                      return (
                        <div>
                          <div className="text-sm font-medium text-purple-600">
                            <span className="hidden sm:inline">
                              {sold.toLocaleString()} pieces
                            </span>
                            <span className="sm:hidden">
                              {sold.toLocaleString()}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {soldPercentage.toFixed(0)}% of received
                          </div>
                        </div>
                      );
                    })()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* No data state */}
      {paginatedData.length === 0 && !loading && (
        <div className="text-center py-8 sm:py-12">
          <Package className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mb-4" />
          <div className="text-gray-500 text-base sm:text-lg font-medium">
            No inventory items found
          </div>
          <div className="text-gray-400 text-sm mt-1">
            Try adjusting your search or filters
          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="bg-white px-3 sm:px-4 py-4 border-t border-gray-200">
        <div className="flex flex-col space-y-4">
          {/* Results info and page size selector */}
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
            <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
              Showing{" "}
              <span className="font-medium">
                {Math.min(startIndex + 1, inventoryData.length)}
              </span>{" "}
              to{" "}
              <span className="font-medium">
                {Math.min(endIndex, inventoryData.length)}
              </span>{" "}
              of <span className="font-medium">{inventoryData.length}</span>{" "}
              results
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm text-gray-700">Show:</span>
              <Select
                value={pageSize.toString()}
                onValueChange={(value) => handlePageSizeChange(parseInt(value))}
              >
                <SelectTrigger className="w-16 sm:w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Desktop Pagination */}
          {totalPages > 1 && (
            <div className="hidden sm:flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={
                        currentPage === 1 || loading
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                  {generatePaginationItems()}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={
                        currentPage === totalPages || loading
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}

          {/* Mobile Pagination */}
          {totalPages > 1 && (
            <div className="sm:hidden flex justify-center space-x-2">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                variant="outline"
                size="sm"
              >
                Previous
              </Button>
              <span className="flex items-center px-3 py-1 text-sm text-gray-500 bg-white border border-gray-300 rounded-md">
                {currentPage} of {totalPages}
              </span>
              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                variant="outline"
                size="sm"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryTable;
