"use client";

import { useState, useEffect } from "react";
import { createVendor, updateVendor } from "@/app/api/vendor";
import { getActiveShops } from "@/app/api/shop";
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify";
import {
  X,
  Save,
  AlertTriangle,
  CheckCircle,
  Loader2,
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  FileText,
  DollarSign,
} from "lucide-react";
import { useAuthContext } from "@/lib/context/auth";
import {
  CreateVendorData,
  VendorFormData,
  VendorFormProps,
} from "@/types/vendor";
import { Shop } from "@/types/shop";

const initialFormData: VendorFormData = {
  name: "",
  contact_person: "",
  email: "",
  phone: "",
  address: "",
  vendor_type: "",
  license_number: "",
  tax_id: "",
  credit_limit: null,
  payment_terms: "",
  status: "",
  notes: "",
  shop: null,
};

export function VendorForm({
  isOpen,
  onClose,
  vendor,
  onSuccess,
}: VendorFormProps) {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState<VendorFormData>(initialFormData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [shops, setShops] = useState<Shop[]>([]);
  const [loadingShops, setLoadingShops] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      loadShops();
    }
  }, [isOpen]);

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name || "",
        contact_person: vendor.contact_person || "",
        email: vendor.email || "",
        phone: vendor.phone || "",
        address: vendor.address || "",
        vendor_type: vendor.vendor_type || "",
        license_number: vendor.license_number || "",
        tax_id: vendor.tax_id || "",
        credit_limit: vendor.credit_limit || null,
        payment_terms: vendor.payment_terms || "",
        status: vendor.status || "",
        notes: vendor.notes || "",
        shop:
          typeof vendor.shop === "number"
            ? vendor.shop
            : vendor.shop?.id || null,
      });
    } else {
      setFormData(initialFormData);
    }
    setError("");
    setSuccess("");
  }, [vendor, isOpen]);

  const loadShops = async () => {
    setLoadingShops(true);
    try {
      const shopsData = await getActiveShops();
      setShops(Array.isArray(shopsData) ? shopsData : []);
    } catch (error) {
      toast.error("Failed to load shops");
      setShops([]);
    } finally {
      setLoadingShops(false);
    }
  };

  const handleInputChange = (
    field: keyof VendorFormData,
    value: string | number | boolean | null
  ) => {
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

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Vendor name is required");
      return false;
    }
    if (formData.credit_limit !== null && formData.credit_limit < 0) {
      setError("Credit limit cannot be negative");
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
      const submissionData: CreateVendorData = {
        name: formData.name,
        contact_person: formData.contact_person || undefined,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        vendor_type: formData.vendor_type || undefined,
        license_number: formData.license_number || undefined,
        tax_id: formData.tax_id || undefined,
        credit_limit: formData.credit_limit ?? undefined,
        payment_terms: formData.payment_terms || undefined,
        status: formData.status || undefined,
        notes: formData.notes || undefined,
        shop: formData.shop || undefined,
      };

      if (vendor) {
        await updateVendor(vendor.id!, submissionData);
        toast.success("Vendor updated successfully!");
        setSuccess("Vendor updated successfully!");
      } else {
        await createVendor(submissionData);
        toast.success("Vendor created successfully!");
        setSuccess("Vendor created successfully!");
      }

      onSuccess();
      setFormData(initialFormData);
      onClose();
    } catch (error) {
      const errorMessage = (error as Error).message || "An error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const canEditShop = user?.role === "admin";
  const isShopEditDisabled = !canEditShop && !!vendor;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
      <div className="bg-white w-full max-w-4xl h-full overflow-y-auto shadow-2xl pointer-events-auto">
        <div className="sticky top-0 bg-white border-b p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {vendor ? "Edit Vendor" : "Add New Vendor"}
              </h2>
              <p className="text-gray-600 mt-1">
                {vendor
                  ? "Update vendor information"
                  : "Create a new vendor profile"}
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
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Vendor Information
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Basic vendor details
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-700"
                    >
                      Vendor Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter vendor name"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="contact_person"
                      className="text-sm font-medium text-gray-700"
                    >
                      Contact Person
                    </Label>
                    <Input
                      id="contact_person"
                      value={formData.contact_person}
                      onChange={(e) =>
                        handleInputChange("contact_person", e.target.value)
                      }
                      placeholder="Enter contact person name"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="vendor_type"
                      className="text-sm font-medium text-gray-700"
                    >
                      Vendor Type
                    </Label>
                    <Select
                      value={formData.vendor_type}
                      onValueChange={(value) =>
                        handleInputChange("vendor_type", value)
                      }
                    >
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select vendor type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manufacturer">
                          Manufacturer
                        </SelectItem>
                        <SelectItem value="wholesaler">Wholesaler</SelectItem>
                        <SelectItem value="distributor">Distributor</SelectItem>
                        <SelectItem value="local_supplier">
                          Local Supplier
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="status"
                      className="text-sm font-medium text-gray-700"
                    >
                      Status
                    </Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        handleInputChange("status", value)
                      }
                    >
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50/50">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                  <Phone className="mr-2 h-5 w-5" />
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="phone"
                      className="text-sm font-medium text-gray-700"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="Enter phone number"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700"
                    >
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        placeholder="Enter email address"
                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label
                      htmlFor="address"
                      className="text-sm font-medium text-gray-700"
                    >
                      Address
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                      <textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        placeholder="Enter address"
                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50/50">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Business Details
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="license_number"
                      className="text-sm font-medium text-gray-700"
                    >
                      License Number
                    </Label>
                    <Input
                      id="license_number"
                      value={formData.license_number}
                      onChange={(e) =>
                        handleInputChange("license_number", e.target.value)
                      }
                      placeholder="Enter license number"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="tax_id"
                      className="text-sm font-medium text-gray-700"
                    >
                      Tax ID
                    </Label>
                    <Input
                      id="tax_id"
                      value={formData.tax_id}
                      onChange={(e) =>
                        handleInputChange("tax_id", e.target.value)
                      }
                      placeholder="Enter tax ID"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="credit_limit"
                      className="text-sm font-medium text-gray-700"
                    >
                      Credit Limit
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="credit_limit"
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.credit_limit ?? ""}
                        onChange={(e) =>
                          handleInputChange(
                            "credit_limit",
                            e.target.value ? parseFloat(e.target.value) : null
                          )
                        }
                        placeholder="Enter credit limit"
                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="payment_terms"
                      className="text-sm font-medium text-gray-700"
                    >
                      Payment Terms
                    </Label>
                    <Input
                      id="payment_terms"
                      value={formData.payment_terms}
                      onChange={(e) =>
                        handleInputChange("payment_terms", e.target.value)
                      }
                      placeholder="e.g., Net 30, COD"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="shop"
                      className="text-sm font-medium text-gray-700"
                    >
                      Shop
                    </Label>
                    <Select
                      value={formData.shop?.toString() || "none"}
                      onValueChange={handleShopChange}
                      disabled={isShopEditDisabled}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select a shop" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No shop selected</SelectItem>
                        {loadingShops ? (
                          <SelectItem value="loading" disabled>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Loading shops...
                          </SelectItem>
                        ) : (
                          shops.map((shop) => (
                            <SelectItem
                              key={shop.id}
                              value={shop.id.toString()}
                            >
                              {shop.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {isShopEditDisabled && (
                      <p className="text-xs text-gray-500">
                        Shop can only be changed by administrators
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="status"
                      checked={formData.status === "active"}
                      onCheckedChange={(checked) =>
                        handleInputChange(
                          "status",
                          checked ? "active" : "inactive"
                        )
                      }
                    />
                    <Label
                      htmlFor="status"
                      className="text-sm font-medium text-gray-700"
                    >
                      Active Vendor
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50/50">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="notes"
                    className="text-sm font-medium text-gray-700"
                  >
                    Notes
                  </Label>
                  <textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    placeholder="Additional notes about the vendor"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={4}
                  />
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
                    {vendor ? "Update Vendor" : "Create Vendor"}
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
