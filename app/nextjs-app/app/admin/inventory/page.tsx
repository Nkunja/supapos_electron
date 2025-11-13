"use client";

import React, { useState, useEffect } from "react";
import {
  Package,
  Plus,
  TrendingDown,
  BarChart3,
  AlertTriangle,
  Search,
  Filter,
} from "lucide-react";
import { useInventory } from "@/lib/hooks/useInventory";

import InventoryHeader from "./InventoryHeader";
import InventoryActions from "./InventoryActions";
import InventoryFilter from "./InventoryFilter";
import InventoryTable from "./InventoryTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AddInventoryForm } from "./form";
import { getProducts } from "@/app/api/products";
import { getShops } from "@/app/api/shop";
import { toast } from "react-toastify";
import { Shop } from "@/types/shop";
import { Inventory, Product } from "@/types/inventory/inventory";

interface InventoryFilters {
  search?: string;
  shop?: number;
  product?: number;
  page?: number;
  page_size?: number;
}

const InventoryPage = () => {
  const { fetchInventory, deleteInventory, loading, error, clearError } =
    useInventory();

  const [products, setProducts] = useState<Product[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [shopsLoading, setShopsLoading] = useState(false);

  const [allInventoryData, setAllInventoryData] = useState<Inventory[]>([]);
  const [filteredInventoryData, setFilteredInventoryData] = useState<
    Inventory[]
  >([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<
    "list" | "purchase-order" | "stock-out" | "summary"
  >("list");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedInventory, setSelectedInventory] = useState<Inventory | null>(
    null
  );
  const [showFilters, setShowFilters] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [filters, setFilters] = useState<InventoryFilters>({
    search: "",
    shop: undefined,
    product: undefined,
    page: 1,
    page_size: 20,
  });

  useEffect(() => {
    loadInventory();
    loadProducts();
    loadShops();
  }, []);

  useEffect(() => {
    applyClientSideFilters();
  }, [filters, allInventoryData]);

  const loadProducts = async () => {
    setProductsLoading(true);
    try {
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load products";
      toast.error(errorMessage);
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  };

  const loadShops = async () => {
    setShopsLoading(true);
    try {
      const data = await getShops();
      setShops(Array.isArray(data) ? data : data.results || []);
    } catch (error) {
      toast.error("Failed to load shops");
      setShops([]);
    } finally {
      setShopsLoading(false);
    }
  };

  const loadInventory = async () => {
    try {
      const response = await fetchInventory({ page: 1, page_size: 1000 });
      if (response) {
        setAllInventoryData(response.results);
        setTotalCount(response.count);
        setFilteredInventoryData(response.results);
        setCurrentPage(1);
      } else {
        setErrorMessage("Failed to load inventory data.");
      }
    } catch (err) {
      setErrorMessage("An error occurred while fetching inventory.");
      console.error(err);
    }
  };

  const applyClientSideFilters = () => {
    let filtered = [...allInventoryData];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.product_name?.toLowerCase().includes(searchLower) ||
          item.batch_number?.toLowerCase().includes(searchLower) ||
          item.barcode?.toLowerCase().includes(searchLower) ||
          item.supplier?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.shop) {
      filtered = filtered.filter((item) => item.shop === filters.shop);
    }

    if (filters.product) {
      filtered = filtered.filter((item) => item.product === filters.product);
    }

    const startIndex = ((filters.page || 1) - 1) * (filters.page_size || 20);
    const paginated = filtered.slice(
      startIndex,
      startIndex + (filters.page_size || 20)
    );

    setFilteredInventoryData(paginated);
    setTotalCount(filtered.length);
    setCurrentPage(filters.page || 1);
  };

  const handleFilterChange = (key: keyof InventoryFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      shop: undefined,
      product: undefined,
      page: 1,
      page_size: 20,
    });
    setShowFilters(false);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this inventory item?")) {
      try {
        const success = await deleteInventory(id);
        if (success) {
          setAllInventoryData((prev) => prev.filter((item) => item.id !== id));
          toast.success("Inventory item deleted successfully");
        } else {
          setErrorMessage("Failed to delete inventory item.");
        }
      } catch (err) {
        setErrorMessage("An error occurred while deleting the inventory item.");
        console.error(err);
      }
    }
  };

  const handleDownload = (type: "all" | "low_stock" | "out_of_stock") => {
    let data = [...allInventoryData];
    if (type === "low_stock") {
      data = data.filter((item) => (item.total_pieces || 0) <= item.reorder_level);
    } else if (type === "out_of_stock") {
      data = data.filter((item) => (item.total_pieces || 0) === 0);
    }

    if (data.length === 0) {
      setErrorMessage(`No ${type} data available for download.`);
      return;
    }

    const headers = [
      "Product Name",
      "Generic Name",
      "Shop Name",
      "Batch Number",
      "Supplier",
      "Drug Type",
      "Form",
      "Total Pieces",
      "Total Units",
      "Pieces per Unit",
      "Reorder Level",
      "Cost Price per Piece",
      "Selling Price per Piece",
      "Expiry Date",
      "Purchase Date",
      "Purchase Order",
      "Purchase Order Name",
      "User Type",
      "Unit of Measurement",
    ];

    const csvRows = [
      headers.join(","),
      ...data.map((item) =>
        [
          `"${item.product_name || ""}"`,
          `"${item.product_generic_name || ""}"`,
          `"${item.shop_name || ""}"`,
          `"${item.batch_number || ""}"`,
          `"${item.supplier || ""}"`,
          `"${item.drug_type_display || item.drug_type || ""}"`,
          `"${item.form_display || item.form || ""}"`,
          item.total_pieces || 0,
          item.total_units || 0,
          item.pieces_per_unit || 0,
          item.reorder_level || 0,
          item.cost_price_per_piece || 0,
          item.selling_price_per_piece || 0,
          item.expiry_date || "N/A",
          item.purchase_date || "N/A",
          item.purchase_order || "",
          `"${(item as any).purchase_order_name || ""}"`,
          `"${item.user_type_display || item.user_type || ""}"`,
          `"${item.unit_of_measurement_display || item.unit_of_measurement || ""}"`,
        ].join(",")
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const timestamp = new Date().toISOString().split("T")[0];
    a.download = `inventory_${type}_${timestamp}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleSuccess = () => {
    setActiveTab("list");
    setIsAddModalOpen(false);
    setIsUpdateModalOpen(false);
    setSelectedInventory(null);
    loadInventory();
  };

  const handleEdit = (inventory: Inventory) => {
    setSelectedInventory(inventory);
    setIsUpdateModalOpen(true);
  };

  const NavigationTabs = () => (
    <div className="border-b border-gray-200 mb-3 sm:mb-6">
      <div className="overflow-x-auto">
        <nav className="flex space-x-2 sm:space-x-4 lg:space-x-8 px-3 sm:px-4 min-w-max">
          {[
            { id: "list", label: "Inventory List", icon: Package, shortLabel: "List" },
            { id: "purchase-order", label: "Add from Purchase Order", icon: Plus, shortLabel: "Add PO" },
            { id: "stock-out", label: "Sales", icon: TrendingDown, shortLabel: "Sales" },
            { id: "summary", label: "Summary", icon: BarChart3, shortLabel: "Summary" },
          ].map(({ id, label, icon: Icon, shortLabel }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center px-2 sm:px-3 py-3 sm:py-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap transition-colors ${
                activeTab === id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 flex-shrink-0" />
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{shortLabel}</span>
            </button>
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6">
        <NavigationTabs />

        {/* Error Message */}
        {(errorMessage || error) && (
          <div className="bg-red-50 border border-red-200 rounded-md p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex items-start">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-xs sm:text-sm text-red-800 flex-1">{errorMessage || error}</span>
              <button
                onClick={() => {
                  setErrorMessage(null);
                  clearError();
                }}
                className="ml-2 text-red-400 hover:text-red-600 flex-shrink-0"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {activeTab === "list" && (
          <div className="space-y-4 sm:space-y-6">
            {/* Header Section */}
            <div className="space-y-4">
              <div className="px-2 sm:px-0">
                <InventoryHeader />
              </div>

              {/* Search and Actions Row */}
              <div className="flex flex-col lg:flex-row gap-4 px-2 sm:px-0">
                {/* Search Section */}
                <div className="flex-1 max-w-md">
                  <Label
                    htmlFor="search"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Search
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                    <Input
                      id="search"
                      type="text"
                      value={filters.search || ""}
                      onChange={(e) => handleFilterChange("search", e.target.value)}
                      placeholder="Search by product, batch, barcode..."
                      className="w-full pl-9 sm:pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>

                {/* Actions Section */}
                <div className="flex justify-end">
                  <InventoryActions
                    onDownload={handleDownload}
                    loading={loading}
                    onAddOpen={() => setIsAddModalOpen(true)}
                  />
                </div>
              </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white shadow rounded-lg p-4 mb-6 mx-2 sm:mx-0">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant={showFilters ? "default" : "outline"}
                size="sm"
                className="w-full sm:w-auto"
              >
                <Filter className="w-4 h-4 mr-2" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>

            <InventoryFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              products={products}
              shops={shops}
              isOpen={showFilters}
              productsLoading={productsLoading}
              shopsLoading={shopsLoading}
            />

            {/* Content Section */}
            <div className="mx-2 sm:mx-0">
              {loading && filteredInventoryData.length === 0 ? (
                <div className="bg-white shadow rounded-lg p-6">
                  <div className="animate-pulse space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex flex-col space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : filteredInventoryData.length === 0 ? (
                <div className="bg-white shadow rounded-lg p-6 text-center">
                  <Package className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No inventory found
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-gray-500">
                    No inventory items match your current filters.
                  </p>
                  <Button onClick={handleClearFilters} className="mt-4 sm:mt-6" size="sm">
                    Clear filters
                  </Button>
                </div>
              ) : (
                <InventoryTable
                  inventoryData={filteredInventoryData}
                  currentPage={currentPage}
                  pageSize={filters.page_size || 20}
                  totalCount={totalCount}
                  loading={loading}
                  onPageChange={(page) => handleFilterChange("page", page)}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            </div>

            {/* Modals */}
            {isAddModalOpen && (
              <AddInventoryForm
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={handleSuccess}
              />
            )}

            {selectedInventory && (
              <AddInventoryForm
                isOpen={isUpdateModalOpen}
                inventory={selectedInventory}
                onClose={() => {
                  setIsUpdateModalOpen(false);
                  setSelectedInventory(null);
                }}
                onSuccess={handleSuccess}
              />
            )}
          </div>
        )}

        {activeTab === "purchase-order" && (
          <div className="bg-white shadow rounded-lg overflow-hidden p-3 sm:p-6">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Add Product from Purchase Order
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Add new inventory items by selecting from existing purchase orders. Link products to their purchase orders for better tracking.
              </p>
            </div>
            <AddInventoryForm
              onClose={() => setActiveTab("list")}
              onSuccess={handleSuccess}
              isEmbedded={true}
            />
          </div>
        )}

        {activeTab === "stock-out" && (
          <div className="bg-white shadow rounded-lg overflow-hidden p-3 sm:p-6">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Sales Management
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Process sales and manage stock outflows
              </p>
            </div>
            <div className="text-center py-8 sm:py-12">
              <TrendingDown className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mb-4" />
              <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-2">
                Sales Management
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                Sales functionality coming soon
              </p>
            </div>
          </div>
        )}

        {activeTab === "summary" && (
          <div className="bg-white shadow rounded-lg overflow-hidden p-3 sm:p-6">
            <div className="mb-4 sm:mb-6">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Inventory Summary
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Overview of inventory statistics and analytics
              </p>
            </div>
            <div className="text-center py-8 sm:py-12">
              <BarChart3 className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mb-4" />
              <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-2">
                Summary Analytics
              </h3>
              <p className="text-xs sm:text-sm text-gray-500">
                Summary functionality coming soon
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;