"use client";
import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Loader2,
  X,
  Save,
  Search,
} from "lucide-react";
import { createUtility, getAvailableInventory } from "@/app/api/utilities";
import {
  UtilityCreateRequest,
  AvailableInventoryItem,
  Utility,
  UTILITY_TYPE_CHOICES,
  SOURCE_TYPE_CHOICES,
} from "@/types/utility/utilities";
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

interface AddUtilityFormProps {
  initialData?: Utility;
  onSuccess: (data: UtilityCreateRequest) => void;
  onClose: () => void;
  isEmbedded: boolean;
  shops: Shop[];
}

export const AddUtilityForm: React.FC<AddUtilityFormProps> = ({
  initialData,
  onSuccess,
  onClose,
  isEmbedded,
  shops,
}) => {
  const [formData, setFormData] = useState<UtilityCreateRequest>({
    title: initialData?.title || "",
    utility_type: initialData?.utility_type || "other",
    source_type: initialData?.source_type || "cash",
    description: initialData?.description || "",
    amount: initialData?.amount || 0,
    inventory_item: initialData?.inventory_item || undefined,
    quantity_used: initialData?.quantity_used || 1,
    shop: initialData?.shop || undefined,
    Extra_Confirmation: initialData?.Extra_Confirmation || "",
    purpose: initialData?.purpose || "",
    notes: initialData?.notes || "",
    expense_date: initialData?.expense_date
      ? new Date(initialData.expense_date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof UtilityCreateRequest, string>>
  >({});
  const [inventoryItems, setInventoryItems] = useState<
    AvailableInventoryItem[]
  >([]);
  const [filteredInventoryItems, setFilteredInventoryItems] = useState<
    AvailableInventoryItem[]
  >([]);
  const [inventorySearch, setInventorySearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isInventoryLoading, setIsInventoryLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    const fetchInventory = async () => {
      setIsInventoryLoading(true);
      try {
        const response = await getAvailableInventory();
        console.log("Full inventory response:", response);
        const items = Array.isArray(response)
          ? response
          : response.results || response.data || response.items || [];
        console.log("Parsed inventory items:", items);
        setInventoryItems(items);
        setFilteredInventoryItems(items);
      } catch (error: any) {
        const errorMessage = error.message || "Failed to load inventory items";
        console.error("Inventory fetch error:", error);
        setErrors((prev) => ({ ...prev, inventory_item: errorMessage }));
        setInventoryItems([]);
        setFilteredInventoryItems([]);
      } finally {
        setIsInventoryLoading(false);
      }
    };
    fetchInventory();

    if (initialData) {
      setFormData({
        title: initialData.title,
        utility_type: initialData.utility_type,
        source_type: initialData.source_type,
        description: initialData.description || "",
        amount: initialData.amount,
        inventory_item: initialData.inventory_item,
        quantity_used: initialData.quantity_used,
        shop: initialData.shop,
        Extra_Confirmation: initialData.Extra_Confirmation || "",
        purpose: initialData.purpose || "",
        notes: initialData.notes || "",
        expense_date: initialData.expense_date
          ? new Date(initialData.expense_date).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
      });
    } else {
      setFormData({
        title: "",
        utility_type: "other",
        source_type: "cash",
        description: "",
        amount: 0,
        inventory_item: undefined,
        quantity_used: 1,
        shop: undefined,
        Extra_Confirmation: "",
        purpose: "",
        notes: "",
        expense_date: new Date().toISOString().split("T")[0],
      });
    }
    setErrors({});
    setSubmitError(null);
    setSuccess("");
    setInventorySearch("");
    setFilteredInventoryItems(inventoryItems);
  }, [initialData, isEmbedded]);

  // Handle inventory search
  useEffect(() => {
    const filtered = inventoryItems.filter(
      (item) =>
        item.product_name
          .toLowerCase()
          .includes(inventorySearch.toLowerCase()) ||
        (item.batch_number &&
          item.batch_number
            .toLowerCase()
            .includes(inventorySearch.toLowerCase()))
    );
    setFilteredInventoryItems(filtered);
  }, [inventorySearch, inventoryItems]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    let updatedFormData = {
      ...formData,
      [name]:
        value === ""
          ? undefined
          : name === "amount" || name === "quantity_used"
          ? Number(value)
          : value,
    };

    // Automatically set source_type to 'inventory' when utility_type is 'inventory_usage'
    if (name === "utility_type" && value === "inventory_usage") {
      updatedFormData = { ...updatedFormData, source_type: "inventory" };
    }

    setFormData(updatedFormData);
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    if (submitError) setSubmitError(null);
    if (success) setSuccess("");
  };

  const handleInventorySearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInventorySearch(e.target.value);
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UtilityCreateRequest, string>> = {};

    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.utility_type)
      newErrors.utility_type = "Utility type is required";
    if (!formData.source_type)
      newErrors.source_type = "Source type is required";
    if (formData.source_type === "inventory" && !formData.inventory_item) {
      newErrors.inventory_item =
        "Inventory item is required for inventory-based utilities";
    }
    if (
      formData.source_type === "inventory" &&
      (!formData.quantity_used || formData.quantity_used < 1)
    ) {
      newErrors.quantity_used = "Quantity used must be at least 1";
    }
    if (
      formData.source_type !== "inventory" &&
      (!formData.amount || formData.amount <= 0)
    ) {
      newErrors.amount =
        "Amount must be greater than 0 for non-inventory utilities";
    }
    if (!formData.expense_date)
      newErrors.expense_date = "Expense date is required";
    if (!formData.description)
      newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setSubmitError(null);
    setSuccess("");

    try {
      await onSuccess(formData);
      toast.success(
        initialData
          ? "Utility updated successfully!"
          : "Utility created successfully!"
      );
      setSuccess(
        initialData
          ? "Utility updated successfully!"
          : "Utility created successfully!"
      );
      setFormData({
        title: "",
        utility_type: "other",
        source_type: "cash",
        description: "",
        amount: 0,
        inventory_item: undefined,
        quantity_used: 1,
        shop: undefined,
        Extra_Confirmation: "",
        purpose: "",
        notes: "",
        expense_date: new Date().toISOString().split("T")[0],
      });
      setInventorySearch("");
      onClose();
    } catch (error: any) {
      const errorMessage = error.message || "Failed to save utility";
      setSubmitError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isEmbedded) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
      <div className="bg-white w-full max-w-3xl h-full overflow-y-auto shadow-2xl pointer-events-auto">
        <div className="sticky top-0 bg-white border-b p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {initialData ? "Edit Utility" : "Add New Utility"}
              </h2>
              <p className="text-gray-600 mt-1">
                {initialData
                  ? "Update utility information"
                  : "Create a new utility"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {submitError && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {submitError}
              </AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {success}
              </AlertDescription>
            </Alert>
          )}

          {errors.inventory_item && formData.source_type === "inventory" && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {errors.inventory_item}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50/50">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Utility Information
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Enter the core details for the utility
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="title"
                      className="text-sm font-medium text-gray-700"
                    >
                      Title *
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter utility title"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    {errors.title && (
                      <p className="text-xs text-red-600 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />{" "}
                        {errors.title}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      The name or title of the utility
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="utility_type"
                      className="text-sm font-medium text-gray-700"
                    >
                      Utility Type *
                    </Label>
                    <select
                      id="utility_type"
                      name="utility_type"
                      value={formData.utility_type}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.utility_type
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      disabled={initialData?.is_inventory_based}
                      required
                    >
                      {UTILITY_TYPE_CHOICES.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.utility_type && (
                      <p className="text-xs text-red-600 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />{" "}
                        {errors.utility_type}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">The type of utility</p>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="source_type"
                      className="text-sm font-medium text-gray-700"
                    >
                      Source Type *
                    </Label>
                    <select
                      id="source_type"
                      name="source_type"
                      value={formData.source_type}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.source_type
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      disabled={
                        initialData?.is_inventory_based ||
                        formData.utility_type === "inventory_usage"
                      }
                      required
                    >
                      {SOURCE_TYPE_CHOICES.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.source_type && (
                      <p className="text-xs text-red-600 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />{" "}
                        {errors.source_type}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      The source of the utility (e.g., cash or inventory)
                    </p>
                  </div>

                  {formData.source_type === "inventory" && (
                    <div className="space-y-2">
                      <Label
                        htmlFor="inventory_search"
                        className="text-sm font-medium text-gray-700"
                      >
                        Search Inventory Items
                      </Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="inventory_search"
                          value={inventorySearch}
                          onChange={handleInventorySearchChange}
                          placeholder="Search by product name or batch number"
                          className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <Label
                        htmlFor="inventory_item"
                        className="text-sm font-medium text-gray-700"
                      >
                        Inventory Item *
                      </Label>
                      <select
                        id="inventory_item"
                        name="inventory_item"
                        value={formData.inventory_item || ""}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.inventory_item
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        disabled={
                          isInventoryLoading || initialData?.is_inventory_based
                        }
                        required
                      >
                        <option value="">Select an inventory item</option>
                        {filteredInventoryItems.length > 0 ? (
                          filteredInventoryItems.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.product_name} (Stock: {item.available_stock}
                              , Batch: {item.batch_number || "N/A"})
                            </option>
                          ))
                        ) : (
                          <option value="" disabled>
                            No inventory items available
                          </option>
                        )}
                      </select>
                      {isInventoryLoading && (
                        <p className="text-xs text-gray-500 flex items-center">
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />{" "}
                          Loading inventory...
                        </p>
                      )}
                      {errors.inventory_item && (
                        <p className="text-xs text-red-600 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-1" />{" "}
                          {errors.inventory_item}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        Select the inventory item used
                      </p>
                    </div>
                  )}

                  {formData.source_type === "inventory" && (
                    <div className="space-y-2">
                      <Label
                        htmlFor="quantity_used"
                        className="text-sm font-medium text-gray-700"
                      >
                        Quantity Used *
                      </Label>
                      <Input
                        id="quantity_used"
                        name="quantity_used"
                        type="number"
                        value={formData.quantity_used}
                        onChange={handleChange}
                        min="1"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter quantity used"
                        disabled={initialData?.is_inventory_based}
                        required
                      />
                      {errors.quantity_used && (
                        <p className="text-xs text-red-600 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-1" />{" "}
                          {errors.quantity_used}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        Number of units used from inventory
                      </p>
                    </div>
                  )}

                  {formData.source_type !== "inventory" && (
                    <div className="space-y-2">
                      <Label
                        htmlFor="amount"
                        className="text-sm font-medium text-gray-700"
                      >
                        Amount (KSH) *
                      </Label>
                      <Input
                        id="amount"
                        name="amount"
                        type="number"
                        value={formData.amount}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter amount in KSH"
                        required
                      />
                      {errors.amount && (
                        <p className="text-xs text-red-600 flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-1" />{" "}
                          {errors.amount}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        The cost amount in Kenyan Shillings for non-inventory
                        utilities
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label
                      htmlFor="shop"
                      className="text-sm font-medium text-gray-700"
                    >
                      Shop
                    </Label>
                    <select
                      id="shop"
                      name="shop"
                      value={formData.shop || ""}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.shop ? "border-red-500" : "border-gray-300"
                      }`}
                    >
                      <option value="">Select a shop</option>
                      {shops.map((shop) => (
                        <option key={shop.id} value={shop.id}>
                          {shop.name} ({shop.address})
                        </option>
                      ))}
                    </select>
                    {errors.shop && (
                      <p className="text-xs text-red-600 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" /> {errors.shop}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      The shop associated with this utility
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="expense_date"
                      className="text-sm font-medium text-gray-700"
                    >
                      Expense Date *
                    </Label>
                    <Input
                      id="expense_date"
                      name="expense_date"
                      type="date"
                      value={formData.expense_date}
                      onChange={handleChange}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    {errors.expense_date && (
                      <p className="text-xs text-red-600 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />{" "}
                        {errors.expense_date}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Date when the expense was incurred
                    </p>
                  </div>

                  {!formData.shop && (
                    <div className="space-y-2 col-span-2">
                      <Label
                        htmlFor="Extra_Confirmation"
                        className="text-sm font-medium text-gray-700"
                      >
                        Receipt/Reference Number
                      </Label>
                      <Input
                        id="Extra_Confirmation"
                        name="Extra_Confirmation"
                        value={formData.Extra_Confirmation || ""}
                        onChange={handleChange}
                        placeholder="Enter receipt or reference number"
                        className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <p className="text-xs text-gray-500">
                        Optional receipt or reference number for the utility
                      </p>
                    </div>
                  )}

                  <div className="space-y-2 col-span-2">
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium text-gray-700"
                    >
                      Description *
                    </Label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description || ""}
                      onChange={handleChange}
                      placeholder="Enter utility description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      required
                    />
                    {errors.description && (
                      <p className="text-xs text-red-600 flex items-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />{" "}
                        {errors.description}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Detailed description of the utility
                    </p>
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label
                      htmlFor="purpose"
                      className="text-sm font-medium text-gray-700"
                    >
                      Purpose
                    </Label>
                    <textarea
                      id="purpose"
                      name="purpose"
                      value={formData.purpose || ""}
                      onChange={handleChange}
                      placeholder="Enter business purpose"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                    <p className="text-xs text-gray-500">
                      The business purpose of this utility
                    </p>
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label
                      htmlFor="notes"
                      className="text-sm font-medium text-gray-700"
                    >
                      Notes
                    </Label>
                    <textarea
                      id="notes"
                      name="notes"
                      value={formData.notes || ""}
                      onChange={handleChange}
                      placeholder="Enter additional notes"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                    <p className="text-xs text-gray-500">
                      Additional notes about the utility
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="min-w-[100px]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="min-w-[120px] bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {initialData ? "Update Utility" : "Create Utility"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
