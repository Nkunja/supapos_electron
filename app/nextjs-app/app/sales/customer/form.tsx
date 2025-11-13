"use client";

import { useState, useEffect } from "react";
import { createCustomer, updateCustomer, managePrescriptions, Product } from "@/app/api/customer";
import { getProducts } from "@/app/api/products";
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
import { X, Save, AlertTriangle, CheckCircle, Loader2, User, Phone, Mail, MapPin, Heart,Pill,Users} from "lucide-react";
import { useAuthContext } from "@/lib/context/auth";
import { CreateCustomerData, CustomerFormData, CustomerFormProps, Shop } from "@/types/customer";

const initialFormData: CustomerFormData = {
  first_name: "",
  last_name: "",
  phone_number: "",
  email: "",
  date_of_birth: "",
  gender: "",
  address: "",
  allergies: "",
  medical_conditions: "",
  description: "",
  medication_notes: "",
  is_active: true,
  shop: null,

  visit_frequency_days: null,
  notes: "",
  selectedPrescriptions: [],
};

export function CustomerForm({
  isOpen,
  onClose,
  customer,
  onSuccess,
}: CustomerFormProps) {
  const { user } = useAuthContext();
  const [formData, setFormData] = useState<CustomerFormData>(initialFormData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [shops, setShops] = useState<Shop[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingShops, setLoadingShops] = useState<boolean>(false);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(false);
  const [currentPrescriptions, setCurrentPrescriptions] = useState<number[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadShops();
      loadProducts();
    }
  }, [isOpen]);

  useEffect(() => {
    if (customer) {
      setFormData({
        first_name: customer.first_name || "",
        last_name: customer.last_name || "",
        phone_number: customer.phone_number || "",
        email: customer.email || "",
        date_of_birth: customer.date_of_birth || "",
        gender: customer.gender || "",
        address: customer.address || "",
        allergies: customer.allergies || "",
        medical_conditions: customer.medical_conditions || "",
        description: customer.description || "",
        medication_notes: customer.medication_notes || "",
        is_active: customer.is_active ?? true,
        shop: typeof customer.shop === 'number' ? customer.shop : customer.shop?.id || null,

        visit_frequency_days: customer.visit_frequency_days || null,
        notes: customer.notes || "",
        selectedPrescriptions: customer.prescriptions?.map(p => p.id) || [],
      });
      setCurrentPrescriptions(customer.prescriptions?.map(p => p.id) || []);
    } else {
      setFormData(initialFormData);
      setCurrentPrescriptions([]);
    }
    setError("");
    setSuccess("");
  }, [customer, isOpen]);

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

  const loadProducts = async () => {
    setLoadingProducts(true);
    try {
      const productsData = await getProducts();
      const productsArray = Array.isArray(productsData) 
        ? productsData 
        : (productsData?.results || []);
      setProducts(productsArray);
    } catch (error) {
      toast.error("Failed to load products");
      setProducts([]); 
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleInputChange = (field: keyof CustomerFormData, value: string | number | boolean | null) => {
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

  const handlePrescriptionChange = (productId: number, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      selectedPrescriptions: checked
        ? [...prev.selectedPrescriptions, productId]
        : prev.selectedPrescriptions.filter(id => id !== productId)
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.first_name.trim()) {
      setError("First name is required");
      return false;
    }
    if (!formData.last_name.trim()) {
      setError("Last name is required");
      return false;
    }
    if (!formData.phone_number.trim()) {
      setError("Phone number is required");
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
      const submissionData: CreateCustomerData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone_number: formData.phone_number,
        email: formData.email || undefined,
        date_of_birth: formData.date_of_birth || undefined,
        gender: formData.gender || undefined,
        address: formData.address || undefined,
        allergies: formData.allergies || undefined,
        medical_conditions: formData.medical_conditions || undefined,
        description: formData.description || undefined,
        medication_notes: formData.medication_notes || undefined,
        is_active: formData.is_active,
        shop: formData.shop || undefined,
        visit_frequency_days: formData.visit_frequency_days || undefined,
        notes: formData.notes || undefined,
      };

      let customerId: number;

      if (customer) {
        const updatedCustomer = await updateCustomer(customer.id!, submissionData);
        customerId = updatedCustomer.id!;
        toast.success("Customer updated successfully!");
        setSuccess("Customer updated successfully!");
      } else {
        const newCustomer = await createCustomer(submissionData);
        customerId = newCustomer.id!;
        toast.success("Customer created successfully!");
        setSuccess("Customer created successfully!");
      }

      const prescriptionsToAdd = formData.selectedPrescriptions.filter(
        id => !currentPrescriptions.includes(id)
      );
      const prescriptionsToRemove = currentPrescriptions.filter(
        id => !formData.selectedPrescriptions.includes(id)
      );

      if (prescriptionsToAdd.length > 0) {
        await managePrescriptions(customerId, {
          action: 'add',
          product_ids: prescriptionsToAdd
        });
      }

      if (prescriptionsToRemove.length > 0) {
        await managePrescriptions(customerId, {
          action: 'remove',
          product_ids: prescriptionsToRemove
        });
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

  const canEditShop = user?.role === 'admin';
  const isShopEditDisabled = !canEditShop && !!customer;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
      <div className="bg-white w-full max-w-4xl h-full overflow-y-auto shadow-2xl pointer-events-auto">
        <div className="sticky top-0 bg-white border-b p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {customer ? "Edit Customer" : "Add New Customer"}
              </h2>
              <p className="text-gray-600 mt-1">
                {customer
                  ? "Update customer information and prescriptions"
                  : "Create a new customer profile"}
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
                  <User className="mr-2 h-5 w-5" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Basic customer details
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="first_name" className="text-sm font-medium text-gray-700">
                      First Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => handleInputChange("first_name", e.target.value)}
                      placeholder="Enter first name"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last_name" className="text-sm font-medium text-gray-700">
                      Last Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => handleInputChange("last_name", e.target.value)}
                      placeholder="Enter last name"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth" className="text-sm font-medium text-gray-700">
                      Date of Birth
                    </Label>
                    <Input
                      id="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => handleInputChange("date_of_birth", e.target.value)}
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
                      Gender
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value: 'M' | 'F' | 'O') => handleInputChange("gender", value)}
                    >
                      <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="M">Male</SelectItem>
                        <SelectItem value="F">Female</SelectItem>
                        <SelectItem value="O">Other</SelectItem>
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
                    <Label htmlFor="phone_number" className="text-sm font-medium text-gray-700">
                      Phone Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="phone_number"
                      value={formData.phone_number}
                      onChange={(e) => handleInputChange("phone_number", e.target.value)}
                      placeholder="Enter phone number"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Enter email address"
                        className="pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                      Address
                    </Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                      <textarea
                        id="address"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        placeholder="Enter address"
                        className="w-full pl-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medical Information */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50/50">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                  <Heart className="mr-2 h-5 w-5" />
                  Medical Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="allergies" className="text-sm font-medium text-gray-700">
                      Allergies
                    </Label>
                    <textarea
                      id="allergies"
                      value={formData.allergies}
                      onChange={(e) => handleInputChange("allergies", e.target.value)}
                      placeholder="List any known allergies"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medical_conditions" className="text-sm font-medium text-gray-700">
                      Medical Conditions
                    </Label>
                    <textarea
                      id="medical_conditions"
                      value={formData.medical_conditions}
                      onChange={(e) => handleInputChange("medical_conditions", e.target.value)}
                      placeholder="List any medical conditions"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="medication_notes" className="text-sm font-medium text-gray-700">
                      Medication Notes
                    </Label>
                    <textarea
                      id="medication_notes"
                      value={formData.medication_notes}
                      onChange={(e) => handleInputChange("medication_notes", e.target.value)}
                      placeholder="Notes about medications, dosages, instructions"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prescriptions */}
            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50/50">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                  <Pill className="mr-2 h-5 w-5" />
                  Prescriptions
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Select current medications
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {loadingProducts ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Loading products...
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-4">
                    <Pill className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">No products available</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
                    {products.map((product) => (
                      <div key={product.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`product-${product.id}`}
                          checked={formData.selectedPrescriptions.includes(product.id)}
                          onCheckedChange={(checked) => 
                            handlePrescriptionChange(product.id, checked as boolean)
                          }
                        />
                        <Label 
                          htmlFor={`product-${product.id}`} 
                          className="text-sm text-gray-700 cursor-pointer"
                        >
                          {product.name}
                          {product.generic_name && (
                            <span className="text-gray-500"> ({product.generic_name})</span>
                          )}
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50/50">
                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Business Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                    <Label htmlFor="shop" className="text-sm font-medium text-gray-700">
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
                            <SelectItem key={shop.id} value={shop.id.toString()}>
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

                  <div className="space-y-2">
                    <Label htmlFor="visit_frequency_days" className="text-sm font-medium text-gray-700">
                      Visit Frequency (Days)
                    </Label>
                    <Input
                      id="visit_frequency_days"
                      type="number"
                      min="1"
                      value={formData.visit_frequency_days || ""}
                      onChange={(e) => handleInputChange("visit_frequency_days", e.target.value ? parseInt(e.target.value) : null)}
                      placeholder="e.g., 30 for monthly visits"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="is_active"
                      checked={formData.is_active}
                      onCheckedChange={(checked) => handleInputChange("is_active", checked as boolean)}
                    />
                    <Label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                      Active Customer
                    </Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-200 shadow-sm">
              <CardHeader className="bg-gray-50/50">
                <CardTitle className="text-lg font-semibold text-gray-800">
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                      Description
                    </Label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="General description or notes about the customer"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                      Notes
                    </Label>
                    <textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Additional notes"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                    />
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
                    {customer ? "Update Customer" : "Create Customer"}
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