import React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Product, Shop } from "@/types/inventory/inventory";

interface InventoryFilters {
  search?: string;
  shop?: number;
  product?: number;
  page?: number;
  page_size?: number;
}

interface InventoryFilterProps {
  filters: InventoryFilters;
  onFilterChange: (key: keyof InventoryFilters, value: any) => void;
  onClearFilters: () => void;
  products: Product[] | null;
  shops: Shop[] | null;
  isOpen: boolean;
  productsLoading: boolean;
  shopsLoading: boolean;
}

const InventoryFilter: React.FC<InventoryFilterProps> = ({
  filters,
  onFilterChange,
  onClearFilters,
  products,
  shops,
  isOpen,
  productsLoading,
  shopsLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="bg-gray-50 p-3 sm:p-4 rounded-b-lg">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h3 className="text-sm font-medium text-gray-900">Filter Inventory</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onClearFilters}
          className="text-gray-700"
        >
          <X className="w-4 h-4 mr-2" />
          Clear Filters
        </Button>
      </div>

      <div className="overflow-x-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 min-w-max">
          {/* Shop Filter */}
          <div className="min-w-[150px]">
            <Label
              htmlFor="shop"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Shop
            </Label>
            <Select
              value={filters.shop?.toString() || "all"}
              onValueChange={(value) =>
                onFilterChange("shop", value === "all" ? undefined : Number(value))
              }
              disabled={shopsLoading}
            >
              <SelectTrigger id="shop" className="w-full text-sm">
                <SelectValue placeholder={shopsLoading ? "Loading..." : "All Shops"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Shops</SelectItem>
                {shops?.map((shop) => (
                  <SelectItem key={shop.id} value={shop.id.toString()}>
                    {shop.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product Filter */}
          <div className="min-w-[150px]">
            <Label
              htmlFor="product"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Product
            </Label>
            <Select
              value={filters.product?.toString() || "all"}
              onValueChange={(value) =>
                onFilterChange(
                  "product",
                  value === "all" ? undefined : Number(value)
                )
              }
              disabled={productsLoading}
            >
              <SelectTrigger id="product" className="w-full text-sm">
                <SelectValue placeholder={productsLoading ? "Loading..." : "All Products"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                {products?.map((product) => (
                  <SelectItem key={product.id} value={product.id.toString()}>
                    {product.name}
                    {product.generic_name && ` (${product.generic_name})`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Page Size Filter */}
          <div className="min-w-[150px]">
            <Label
              htmlFor="page_size"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Items per Page
            </Label>
            <Select
              value={filters.page_size?.toString() || "20"}
              onValueChange={(value) => onFilterChange("page_size", Number(value))}
            >
              <SelectTrigger id="page_size" className="w-full text-sm">
                <SelectValue placeholder="20" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10 items</SelectItem>
                <SelectItem value="20">20 items</SelectItem>
                <SelectItem value="50">50 items</SelectItem>
                <SelectItem value="100">100 items</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {(filters.shop || filters.product || filters.page_size !== 20) && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 overflow-x-auto">
          <div className="flex flex-wrap gap-2 min-w-max">
            <span className="text-sm text-gray-600">Active filters:</span>
            {filters.shop && shops && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                Shop: {shops.find((s) => s.id === filters.shop)?.name}
                <button
                  onClick={() => onFilterChange("shop", undefined)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.product && products && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                Product: {products.find((p) => p.id === filters.product)?.name}
                <button
                  onClick={() => onFilterChange("product", undefined)}
                  className="ml-1 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            )}
            {filters.page_size && filters.page_size !== 20 && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
                Page size: {filters.page_size}
                <button
                  onClick={() => onFilterChange("page_size", 20)}
                  className="ml-1 text-purple-600 hover:text-purple-800"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryFilter;