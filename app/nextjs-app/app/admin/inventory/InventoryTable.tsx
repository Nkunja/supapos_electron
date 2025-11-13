import React from "react";
import { Button } from "@/components/ui/button";
import { Edit3, Trash2, AlertTriangle, Package, Calendar } from "lucide-react";
import { Inventory } from "@/types/inventory/inventory";

interface InventoryTableProps {
  inventoryData: Inventory[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onEdit: (inventory: Inventory) => void;
  onDelete: (id: number) => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({
  inventoryData,
  currentPage,
  pageSize,
  totalCount,
  loading,
  onPageChange,
  onEdit,
  onDelete,
}) => {
  const getTotalPieces = (totalUnits: number, piecesPerUnit: number) => {
    return (totalUnits ?? 0) * (piecesPerUnit ?? 1);
  };

  const getStockStatusColor = (totalUnits: number, piecesPerUnit: number, reorderLevel: number) => {
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

  const getStockStatusText = (totalUnits: number, piecesPerUnit: number, reorderLevel: number) => {
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
    const daysToExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

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
    const daysToExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

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
    const daysToExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    return daysToExpiry;
  };

  const isLowStockOrOutOfStock = (totalUnits: number, piecesPerUnit: number, reorderLevel: number) => {
    const totalPieces = getTotalPieces(totalUnits, piecesPerUnit);
    return totalPieces <= (reorderLevel ?? 0);
  };

  const isExpiredOrNearExpiry = (expiryDate: string | undefined) => {
    if (!expiryDate) return false;
    const daysToExpiry = getDaysToExpiry(expiryDate);
    return daysToExpiry !== null && daysToExpiry <= 30;
  };

  return (
    <div className="bg-white rounded-b-lg">
      {/* Alert Banner for Critical Items */}
      {inventoryData.some(
        (item) =>
          getTotalPieces(item.total_units || 0, item.pieces_per_unit || 1) === 0 ||
          isLowStockOrOutOfStock(item.total_units || 0, item.pieces_per_unit || 1, item.reorder_level) ||
          isExpiredOrNearExpiry(item.expiry_date)
      ) && (
        <div className="bg-red-50 border-l-4 border-red-400 p-3 sm:p-4">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Inventory Alerts</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-red-700 mt-2">
                {inventoryData.filter((item) => getTotalPieces(item.total_units || 0, item.pieces_per_unit || 1) === 0)
                  .length > 0 && (
                  <li>
                    {inventoryData.filter((item) => getTotalPieces(item.total_units || 0, item.pieces_per_unit || 1) === 0)
                      .length}{" "}
                    items are out of stock
                  </li>
                )}
                {inventoryData.filter(
                  (item) =>
                    getTotalPieces(item.total_units || 0, item.pieces_per_unit || 1) > 0 &&
                    isLowStockOrOutOfStock(item.total_units || 0, item.pieces_per_unit || 1, item.reorder_level)
                ).length > 0 && (
                  <li>
                    {inventoryData.filter(
                      (item) =>
                        getTotalPieces(item.total_units || 0, item.pieces_per_unit || 1) > 0 &&
                        isLowStockOrOutOfStock(item.total_units || 0, item.pieces_per_unit || 1, item.reorder_level)
                    ).length}{" "}
                    items are below reorder level
                  </li>
                )}
                {inventoryData.filter((item) => isExpiredOrNearExpiry(item.expiry_date)).length > 0 && (
                  <li>
                    {inventoryData.filter((item) => isExpiredOrNearExpiry(item.expiry_date)).length} items are expired or
                    near expiry
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}


      <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200" style={{ minWidth: "1400px" }}>
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[180px]">
                Product
              </th>
              <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px]">
                Shop
              </th>
              <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[140px]">
                Batch & Supplier
              </th>
              <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px]">
                Purchase Order
              </th>
              <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px]">
                Stock Status
              </th>
              <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px]">
                Expiry Status
              </th>
              <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px]">
                Quantity
              </th>
              <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[80px]">
                Form
              </th>
              <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[100px]">
                Expiry Date
              </th>
              <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[120px]">
                Pricing (KSH)
              </th>
              <th className="px-2 sm:px-3 py-2 sm:py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider min-w-[80px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventoryData.map((item) => {
              const totalPieces = getTotalPieces(item.total_units || 0, item.pieces_per_unit || 1);
              const isAlert =
                totalPieces === 0 ||
                isLowStockOrOutOfStock(item.total_units || 0, item.pieces_per_unit || 1, item.reorder_level) ||
                isExpiredOrNearExpiry(item.expiry_date);

              return (
                <tr
                  key={item.id}
                  className={`transition-colors duration-200 ${isAlert ? "bg-red-50" : "hover:bg-gray-50"}`}
                >
                  {/* Product */}
                  <td className="px-2 sm:px-3 py-2 sm:py-3 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 flex items-center space-x-2">
                          <span className="truncate">{item.product_name || "N/A"}</span>
                          {totalPieces === 0 && <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />}
                        </div>
                        {item.product_generic_name && (
                          <div className="text-xs text-gray-500 truncate">{item.product_generic_name}</div>
                        )}
                        {item.product_description && (
                          <div className="text-xs text-gray-400 truncate">{item.product_description}</div>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Shop */}
                  <td className="px-2 sm:px-3 py-2 sm:py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900 truncate">{item.shop_name || "N/A"}</div>
                  </td>

                  {/* Batch & Supplier */}
                  <td className="px-2 sm:px-3 py-2 sm:py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 truncate">{item.batch_number || "N/A"}</div>
                    {item.supplier && (
                      <div className="text-xs text-gray-600 mt-1 truncate">
                        <span className="font-medium">Supplier:</span> {item.supplier}
                      </div>
                    )}
                    {item.barcode && (
                      <div className="text-xs text-gray-400 mt-1 truncate">
                        <span className="font-medium">Barcode:</span> {item.barcode}
                      </div>
                    )}
                  </td>

                  {/* Purchase Order */}
                  <td className="px-2 sm:px-3 py-2 sm:py-3 whitespace-nowrap">
                    {item.purchase_order ? (
                      <div className="text-sm">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <Package className="w-3 h-3 mr-1 flex-shrink-0" />
                          PO-{item.purchase_order}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">No PO</span>
                    )}
                    {item.purchase_date && (
                      <div className="text-xs text-gray-500 mt-1 flex items-center">
                        <Calendar className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate">{new Date(item.purchase_date).toLocaleDateString()}</span>
                      </div>
                    )}
                  </td>

                  {/* Stock Status */}
                  <td className="px-2 sm:px-3 py-2 sm:py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStockStatusColor(
                        item.total_units || 0,
                        item.pieces_per_unit || 1,
                        item.reorder_level
                      )}`}
                    >
                      {getStockStatusText(item.total_units || 0, item.pieces_per_unit || 1, item.reorder_level)}
                    </span>
                    <div className="text-xs text-gray-500 mt-1">Reorder: {item.reorder_level ?? 0}</div>
                  </td>

                  {/* Expiry Status */}
                  <td className="px-2 sm:px-3 py-2 sm:py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getExpiryStatusColor(
                        item.expiry_date
                      )}`}
                    >
                      {getExpiryStatusText(item.expiry_date)}
                    </span>
                    {getDaysToExpiry(item.expiry_date) !== null && (
                      <div className="text-xs text-gray-500 mt-1">{getDaysToExpiry(item.expiry_date)} days</div>
                    )}
                  </td>

                  {/* Quantity */}
                  <td className="px-2 sm:px-3 py-2 sm:py-3 whitespace-nowrap">
                    <div className={`text-sm font-medium ${totalPieces === 0 ? "text-red-600" : "text-gray-900"}`}>
                      {totalPieces.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.total_units ?? 0} × {item.pieces_per_unit ?? 1}
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      {item.unit_of_measurement_display || item.unit_of_measurement || "pieces"}
                    </div>
                  </td>

                  {/* Form */}
                  <td className="px-2 sm:px-3 py-2 sm:py-3 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-700">
                      {item.form_display || item.form || "N/A"}
                    </span>
                  </td>

                  {/* Expiry Date */}
                  <td className="px-2 sm:px-3 py-2 sm:py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : "No expiry"}
                    </div>
                    {item.purchase_date && (
                      <div className="text-xs text-gray-500 mt-1">
                        Purchased: {new Date(item.purchase_date).toLocaleDateString()}
                      </div>
                    )}
                  </td>

                  {/* Pricing */}
                  <td className="px-2 sm:px-3 py-2 sm:py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      KSh {Number(item.selling_price_per_piece ?? 0).toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500">
                      Cost: KSh {Number(item.cost_price_per_piece ?? 0).toFixed(2)}
                    </div>
                    <div className="text-xs text-green-600">
                      Profit: KSh{" "}
                      {(Number(item.selling_price_per_piece ?? 0) - Number(item.cost_price_per_piece ?? 0)).toFixed(2)}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-2 sm:px-3 py-2 sm:py-3 whitespace-nowrap">
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(item)}
                        className="text-blue-600 hover:text-blue-800 hover:bg-blue-100 transition-colors duration-200 p-2"
                        title="Edit inventory item"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(item.id)}
                        className="text-red-600 hover:text-red-800 hover:bg-red-100 transition-colors duration-200 p-2"
                        title="Delete inventory item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* No data state */}
      {inventoryData.length === 0 && !loading && (
        <div className="text-center py-12">
          <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="text-gray-500 text-lg font-medium">No inventory items found</div>
          <div className="text-gray-400 text-sm mt-1">Try adjusting your search or filters</div>
        </div>
      )}

      {/* Pagination */}
      <div className="bg-white px-3 sm:px-4 py-3 sm:py-4 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 gap-4">
        <div className="flex justify-between sm:justify-start gap-2 w-full sm:w-auto">
          <Button
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1 || loading}
            variant="outline"
            size="sm"
            className="px-4 py-2 bg-gray-50 hover:bg-gray-100"
          >
            Previous
          </Button>
          <Button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={inventoryData.length < pageSize || loading}
            variant="outline"
            size="sm"
            className="px-4 py-2 bg-gray-50 hover:bg-gray-100"
          >
            Next
          </Button>
        </div>

        <div className="text-sm text-gray-600 text-center sm:text-right">
          Showing{" "}
          <span className="font-semibold">{Math.min((currentPage - 1) * pageSize + 1, totalCount)}</span> to{" "}
          <span className="font-semibold">{Math.min(currentPage * pageSize, totalCount)}</span> of{" "}
          <span className="font-semibold">{totalCount}</span> results
        </div>
      </div>
    </div>
  );
};

export default InventoryTable;