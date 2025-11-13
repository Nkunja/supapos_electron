"use client";

import { useState, useEffect } from "react";
import { createProduct, updateProduct } from "@/app/api/products";
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
import { X, Save, AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import {
  Product,
  ProductFormData,
  CreateProductData,
  ApiError,
} from "@/types/product";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSuccess: () => void;
}

const initialFormData: ProductFormData = {
  name: "",
  generic_name: "",
  description: "",
};

export function AddProductForm({
  isOpen,
  onClose,
  product,
  onSuccess,
}: ProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>(initialFormData);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        generic_name: product.generic_name,
        description: product.description,
      });
    } else {
      setFormData(initialFormData);
    }
    setError("");
    setSuccess("");
  }, [product, isOpen]);

  const handleInputChange = (field: keyof ProductFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError("");
    if (success) setSuccess("");
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Product name is required");
      return false;
    }
    if (!formData.generic_name.trim()) {
      setError("Generic name is required");
      return false;
    }
    if (!formData.description.trim()) {
      setError("Description is required");
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
      const submissionData: CreateProductData = {
        name: formData.name,
        generic_name: formData.generic_name,
        description: formData.description,
      };

      if (product) {
        await updateProduct(product.id, submissionData);
        toast.success("Product updated successfully!");
        setSuccess("Product updated successfully!");
      } else {
        await createProduct(submissionData);
        toast.success("Product created successfully!");
        setSuccess("Product created successfully!");
      }

      onSuccess();
      setFormData(initialFormData);
      onClose();
    } catch (error) {
      const errorMessage =
        (error as ApiError).detail ||
        (error as Error).message ||
        "An error occurred";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
      <div className="bg-white w-full max-w-3xl h-full overflow-y-auto shadow-2xl pointer-events-auto">
        <div className="sticky top-0 bg-white border-b p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {product ? "Edit Product" : "Add New Product"}
              </h2>
              <p className="text-gray-600 mt-1">
                {product
                  ? "Update product information"
                  : "Create a new product"}
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
                  Product Information
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Enter the core details for the product
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-700"
                    >
                      Product Name *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      placeholder="Enter product name"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <p className="text-xs text-gray-500">
                      The commercial name of the product
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="generic_name"
                      className="text-sm font-medium text-gray-700"
                    >
                      Generic Name *
                    </Label>
                    <Input
                      id="generic_name"
                      value={formData.generic_name}
                      onChange={(e) =>
                        handleInputChange("generic_name", e.target.value)
                      }
                      placeholder="Enter generic name"
                      className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <p className="text-xs text-gray-500">
                      The scientific or common name of the active ingredient
                    </p>
                  </div>

                  <div className="space-y-2 col-span-2">
                    <Label
                      htmlFor="description"
                      className="text-sm font-medium text-gray-700"
                    >
                      Description *
                    </Label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Enter detailed product description"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Detailed description of the product
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
                    {product ? "Update Product" : "Create Product"}
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
