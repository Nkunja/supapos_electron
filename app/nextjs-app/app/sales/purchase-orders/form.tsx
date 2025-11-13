"use client";

import { useState, useEffect } from "react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { X, Save, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { CreatePurchaseOrderData, PurchaseOrder, PurchaseOrderFormData, Shop } from "@/types/purchase-orders";
import { Vendor } from "@/types/vendor";
import { getActiveShops } from "@/app/api/shop";
import { getVendors } from "@/app/api/vendor";
import { createPurchaseOrder, updatePurchaseOrder } from "@/app/api/purchase-orders";

interface PurchaseOrderFormProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseOrder?: PurchaseOrder | null;
  onSuccess: () => void;
}

const initialFormData: PurchaseOrderFormData = {
  name: "",
  supplier: null,
  quantity_received: 0,
  status: "draft",
  total_amount: "0.00",
  notes: "",
  shop: null,
};

export function PurchaseOrderForm({
  isOpen,
  onClose,
  purchaseOrder,
  onSuccess,
}: PurchaseOrderFormProps) {
  const [formData, setFormData] = useState<PurchaseOrderFormData>(initialFormData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [shops, setShops] = useState<Shop[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loadingShops, setLoadingShops] = useState<boolean>(false);
  const [loadingVendors, setLoadingVendors] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      loadShops();
      loadVendors();
    }
  }, [isOpen]);

  useEffect(() => {
    if (purchaseOrder) {
      setFormData({
        name: purchaseOrder.name || "",
        supplier: purchaseOrder.supplier || null,
        quantity_received: purchaseOrder.quantity_received || 0,
        status: purchaseOrder.status || "draft",
        total_amount: purchaseOrder.total_amount?.toString() || "0.00",
        notes: purchaseOrder.notes || "",
        shop: typeof purchaseOrder.shop === 'number' ? purchaseOrder.shop : purchaseOrder.shop?.id || null,
      });
    } else {
      setFormData(initialFormData);
    }
    setError("");
    setSuccess("");
  }, [purchaseOrder, isOpen]);

  const loadShops = async () => {
    setLoadingShops(true);
    try {
      const shopsData = await getActiveShops();
      setShops(shopsData);
    } catch (error) {
      console.error("Failed to load shops:", error);
      toast.error("Failed to load shops");
    } finally {
      setLoadingShops(false);
    }
  };

  const loadVendors = async () => {
    setLoadingVendors(true);
    try {
      const vendorsData = await getVendors();

      const activeVendors = vendorsData.filter(vendor => vendor.status === 'active');
      setVendors(activeVendors);
    } catch (error) {
      console.error("Failed to load vendors:", error);
      toast.error("Failed to load vendors");
    } finally {
      setLoadingVendors(false);
    }
  };

  const handleInputChange = (field: keyof PurchaseOrderFormData, value: string | number | null) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleShopChange = (value: string) => {
    if (value === "none") {
      handleInputChange("shop", null);
    } else {
      handleInputChange("shop", parseInt(value));
    }
  };

  const handleVendorChange = (value: string) => {
    if (value === "none") {
      handleInputChange("supplier", null);
    } else {
      handleInputChange("supplier", parseInt(value));
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Purchase order name is required");
      return false;
    }
    if (!formData.status) {
      setError("Status is required");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const submissionData: CreatePurchaseOrderData = {
        name: formData.name,
        supplier: formData.supplier || undefined,
        quantity_received: formData.quantity_received,
        status: formData.status,
        total_amount: parseFloat(formData.total_amount),
        notes: formData.notes,
        shop: formData.shop || undefined,
      };

      if (purchaseOrder) {
        await updatePurchaseOrder(purchaseOrder.id!, submissionData);
        toast.success("Purchase order updated successfully!");
        setSuccess("Purchase order updated successfully!");
      } else {
        await createPurchaseOrder(submissionData);
        toast.success("Purchase order created successfully!");
        setSuccess("Purchase order created successfully!");
      }

      onSuccess();
      setFormData(initialFormData);
      onClose();
    } catch (error) {
      const errorMessage =
        (error as Error).message ||
        "An error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getVendorDisplayName = (vendor: Vendor) => {
    const typeDisplay = vendor.vendor_type.charAt(0).toUpperCase() + vendor.vendor_type.slice(1);
    return `${vendor.name} (${typeDisplay})`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
      <div className="bg-white w-full max-w-4xl h-full overflow-y-auto shadow-2xl pointer-events-auto">
        <div className="sticky top-0 bg-white border-b p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {purchaseOrder ? "Edit Purchase Order" : "Add New Purchase Order"}
              </h2>
              <p className="text-gray-600 mt-1">
                {purchaseOrder
                  ? "Update purchase order information"
                  : "Create a new purchase order"}
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
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50/50">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Purchase Order Information
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Enter the details for the purchase order
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                      Purchase Order Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter purchase order name"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <p className="text-xs text-gray-500">Required - Enter a descriptive name for this purchase order</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="supplier" className="text-sm font-medium text-gray-700">
                      Supplier/Vendor
                    </Label>
                    <Select
                      value={formData.supplier?.toString() || "none"}
                      onValueChange={handleVendorChange}
                      disabled={loadingVendors}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder={loadingVendors ? "Loading vendors..." : "Select a vendor"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No vendor selected</SelectItem>
                        {vendors.map((vendor) => (
                          <SelectItem key={vendor.id} value={vendor.id!.toString()}>
                            {getVendorDisplayName(vendor)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">
                      Optional - Select the vendor/supplier for this purchase order
                      {vendors.length === 0 && !loadingVendors && (
                        <span className="text-amber-600"> - No active vendors found</span>
                      )}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shop" className="text-sm font-medium text-gray-700">
                      Shop
                    </Label>
                    <Select
                      value={formData.shop?.toString() || "none"}
                      onValueChange={handleShopChange}
                      disabled={loadingShops}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder={loadingShops ? "Loading shops..." : "Select a shop"} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No shop selected</SelectItem>
                        {shops.map((shop) => (
                          <SelectItem key={shop.id} value={shop.id.toString()}>
                            {shop.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">Optional - Associate this purchase order with a specific shop</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                      Status <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: 'draft' | 'pending' | 'approved' | 'completed' | 'cancelled') => 
                        handleInputChange("status", value)
                      }
                    >
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500">Required - Current status of the purchase order</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quantity_received" className="text-sm font-medium text-gray-700">
                      Quantity Received
                    </Label>
                    <Input
                      id="quantity_received"
                      type="number"
                      min="0"
                      value={formData.quantity_received}
                      onChange={(e) => handleInputChange("quantity_received", parseInt(e.target.value) || 0)}
                      placeholder="0"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500">Optional - Number of items received so far</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="total_amount" className="text-sm font-medium text-gray-700">
                      Total Amount
                    </Label>
                    <Input
                      id="total_amount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.total_amount}
                      onChange={(e) => handleInputChange("total_amount", e.target.value)}
                      placeholder="0.00"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500">Optional - Total monetary amount for this purchase order</p>
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                      Notes
                    </Label>
                    <textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Enter additional notes"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                    <p className="text-xs text-gray-500">Optional - Any additional notes or comments about this purchase order</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="min-w-[100px]"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="min-w-[120px] bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {purchaseOrder ? "Update Purchase Order" : "Create Purchase Order"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}