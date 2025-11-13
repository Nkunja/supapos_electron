"use client";
import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Filter,
  Plus,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import {
  getUtilities,
  createUtility,
  updateUtility,
  deleteUtility,
  restoreInventory,
} from "@/app/api/utilities";
import { AddUtilityForm } from "./AddUtilityForm";
import { UtilityStatsCards } from "./UtilityStatsCards";
import { UtilityList } from "./UtilityList";
import {
  Utility,
  UtilityFilters,
  UtilityResponse,
  RestoreInventoryResponse,
  UtilityCreateRequest,
  UtilityUpdateRequest,
  UTILITY_TYPE_CHOICES,
  SOURCE_TYPE_CHOICES,
} from "@/types/utility/utilities";
import { getShops, getShopById } from "@/app/api/shop";
import { Shop } from "@/types/shop";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "react-toastify";

export default function UtilitiesPage() {
  const [utilities, setUtilities] = useState<Utility[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [filters, setFilters] = useState<UtilityFilters>({});
  const [shops, setShops] = useState<Shop[]>([]);
  const [selectedShopId, setSelectedShopId] = useState<number | null>(null);
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [editingUtility, setEditingUtility] = useState<Utility | null>(null);
  //   const [showFilters, setShowFilters] = useState(false);
  const [tempFilters, setTempFilters] = useState<UtilityFilters>({});
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Fetch shops
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await getShops();
        setShops(response.results || []);
      } catch (err) {
        setError("Failed to load shops");
      }
    };
    fetchShops();
  }, []);

  // Fetch shop details when selectedShopId changes
  useEffect(() => {
    const fetchShopDetails = async () => {
      if (selectedShopId) {
        try {
          const shop = await getShopById(selectedShopId);
          setSelectedShop(shop);
        } catch (err) {
          setError("Failed to load shop details");
          setSelectedShop(null);
        }
      } else {
        setSelectedShop(null);
      }
    };
    fetchShopDetails();
  }, [selectedShopId]);

  // Fetch paginated utilities (sorted by newest first)
  useEffect(() => {
    const fetchUtilities = async () => {
      setIsLoading(true);
      setError(null);
      setSuccess("");
      try {
        const response: UtilityResponse = await getUtilities({
          ...filters,
          shop: selectedShopId || undefined,
          page,
          page_size: pageSize,
          ordering: "-created_at,-expense_date", // Sort by newest first
        });
        setUtilities(response.results);
        setTotalCount(response.count);
      } catch (err) {
        setError("Failed to load utilities");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUtilities();
  }, [filters, page, pageSize, selectedShopId]);

  const handleTempFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTempFilters((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : value,
    }));
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setPage(1);
    setIsFilterPanelOpen(false);
  };

  const cancelFilters = () => {
    setTempFilters(filters); // Reset temporary values
    setIsFilterPanelOpen(false);
  };
  //   const handleFilterChange = (
  //     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  //   ) => {
  //     const { name, value } = e.target;
  //     setFilters((prev) => ({
  //       ...prev,
  //       [name]: value === "" ? undefined : value,
  //     }));
  //     setPage(1); // Reset to first page on filter change
  //   };

  const refreshUtilities = async () => {
    const response = await getUtilities({
      ...filters,
      shop: selectedShopId || undefined,
      page,
      page_size: pageSize,
      ordering: "-created_at,-expense_date",
    });
    setUtilities(response.results);
    setTotalCount(response.count);
  };

  const handleAddUtility = async (data: UtilityCreateRequest) => {
    try {
      await createUtility(data);
      setSuccess("Utility created successfully!");
      toast.success("Utility created successfully!");
      setShowForm(false);
      await refreshUtilities();
    } catch (err) {
      setError("Failed to create utility");
      toast.error("Failed to create utility");
    }
  };

  const handleUpdateUtility = async (
    id: number,
    data: UtilityCreateRequest
  ) => {
    try {
      const updateData: UtilityUpdateRequest = {
        id,
        ...data,
      };
      await updateUtility(id, updateData);
      setSuccess("Utility updated successfully!");
      toast.success("Utility updated successfully!");
      setEditingUtility(null);
      setShowForm(false);
      await refreshUtilities();
    } catch (err) {
      setError("Failed to update utility");
      toast.error("Failed to update utility");
    }
  };

  const handleDeleteUtility = async (id: number) => {
    if (confirm("Are you sure you want to delete this utility?")) {
      try {
        await deleteUtility(id);
        setSuccess("Utility deleted successfully!");
        toast.success("Utility deleted successfully!");
        await refreshUtilities();
      } catch (err) {
        setError("Failed to delete utility");
        toast.error("Failed to delete utility");
      }
    }
  };

  const handleRestoreInventory = async (id: number) => {
    if (
      confirm("Are you sure you want to restore inventory for this utility?")
    ) {
      try {
        const response: RestoreInventoryResponse = await restoreInventory(id);
        setSuccess(response.success || "Inventory restored successfully!");
        toast.success(response.success || "Inventory restored successfully!");
        await refreshUtilities();
      } catch (err) {
        setError("Failed to restore inventory");
        toast.error("Failed to restore inventory");
      }
    }
  };

  const clearFilters = () => {
    setFilters({});
    setSelectedShopId(null);
    setPage(1);
  };

  const hasActiveFilters =
    Object.keys(filters).some((key) => filters[key as keyof UtilityFilters]) ||
    selectedShopId;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="mx-auto px-3 sm:px-6 lg:px-8">
          <div className="py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-600 p-2 sm:p-3 rounded-lg shadow-sm">
                  <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                    Utility Management
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                    Manage utility expenses and inventory
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 max-w-max sm:w-auto">
                {/* Add Utility Button */}
                <Button
                  onClick={() => {
                    setEditingUtility(null);
                    setShowForm(true);
                  }}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 text-xs px-2 py-1 h-7"
                >
                  <Plus className="h-3 w-3" />
                  <span className="hidden sm:inline">Add Utility</span>
                  <span className="sm:hidden">Add</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* Alerts */}
        {error && (
          <Alert className="border-red-200 bg-red-50 mb-4">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 text-sm">
              {error}
            </AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert className="border-green-200 bg-green-50 mb-4">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800 text-sm">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <UtilityStatsCards shopId={selectedShopId} filters={filters} />
        {/* Filters Button */}
        <div className=" flex justify-start items-center w-full py-3 mb-3 border-t border-b border-gray-200 bg-gray-50 rounded-md shadow-sm">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterPanelOpen(true)}
            className=" mx-4 flex items-start gap-1 text-xs px-3 py-1.5 h-8 border border-gray-300 shadow-sm hover:bg-gray-100 transition"
          >
            <Filter className="h-3 w-3" />
            Apply Filters
            {hasActiveFilters && (
              <span className="bg-blue-100 text-blue-600 text-[10px] px-1 py-0.5 rounded-full">
                •
              </span>
            )}
          </Button>
        </div>
        {/* Filters */}
        <Card
          className={`border-gray-200 shadow-sm mb-3 ${isFilterPanelOpen ? "block" : "hidden"}`}
        >
          <CardHeader className="bg-gray-50/50 p-2 sm:p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Filter className="h-3 w-3 text-blue-600" />
                <CardTitle className="text-xs font-medium text-gray-800">
                  Filters
                </CardTitle>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-2 sm:p-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="space-y-1">
                <Label
                  htmlFor="search"
                  className="text-xs font-medium text-gray-700"
                >
                  Search
                </Label>
                <Input
                  id="search"
                  name="search"
                  value={tempFilters.search || ""}
                  onChange={handleTempFilterChange}
                  placeholder="Search..."
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-xs h-7"
                />
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="shop"
                  className="text-xs font-medium text-gray-700"
                >
                  Shop
                </Label>
                <select
                  id="shop"
                  name="shop"
                  value={tempFilters.shop || ""}
                  onChange={(e) =>
                    setTempFilters((prev) => ({
                      ...prev,
                      shop: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-7"
                >
                  <option value="">All</option>
                  {shops.map((shop) => (
                    <option key={shop.id} value={shop.id}>
                      {shop.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="utility_type"
                  className="text-xs font-medium text-gray-700"
                >
                  Type
                </Label>
                <select
                  id="utility_type"
                  name="utility_type"
                  value={tempFilters.utility_type || ""}
                  onChange={handleTempFilterChange}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-7"
                >
                  <option value="">All</option>
                  {UTILITY_TYPE_CHOICES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor="source_type"
                  className="text-xs font-medium text-gray-700"
                >
                  Source
                </Label>
                <select
                  id="source_type"
                  name="source_type"
                  value={tempFilters.source_type || ""}
                  onChange={handleTempFilterChange}
                  className="w-full px-2 py-1 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-7"
                >
                  <option value="">All</option>
                  {SOURCE_TYPE_CHOICES.map((source) => (
                    <option key={source.value} value={source.value}>
                      {source.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-2 mt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={cancelFilters}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={applyFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
              >
                Apply
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Summary for Mobile */}
        {selectedShop && (
          <Card className="border-blue-200 bg-blue-50/30 mb-4 sm:hidden">
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-blue-800">
                    Viewing: {selectedShop.name}
                  </p>
                  <p className="text-xs text-blue-600 mt-0.5">
                    {totalCount} utilities found
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedShopId(null)}
                  className="text-xs text-blue-600"
                >
                  View All
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Utility List */}
        <UtilityList
          utilities={utilities}
          isLoading={isLoading}
          totalCount={totalCount}
          page={page}
          pageSize={pageSize}
          onEdit={(utility) => {
            setEditingUtility(utility);
            setShowForm(true);
          }}
          onDelete={handleDeleteUtility}
          onRestoreInventory={handleRestoreInventory}
          onPageChange={setPage}
        />
      </div>

      {/* Add/Edit Utility Form (Sidebar) */}
      <AddUtilityForm
        initialData={editingUtility || undefined}
        onSuccess={
          editingUtility
            ? (data) => handleUpdateUtility(editingUtility.id, data)
            : handleAddUtility
        }
        onClose={() => {
          setShowForm(false);
          setEditingUtility(null);
        }}
        isEmbedded={showForm}
        shops={shops}
      />
    </div>
  );
}
