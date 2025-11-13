"use client";

import { useState, useEffect } from "react";
import { getActiveShops, Shop } from "@/app/api/shop";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  X,
  Briefcase,
  Phone,
  Mail,
  MapPin,
  FileText,
  DollarSign,
  Calendar,
  Package,
  Loader2,
  AlertCircle,
  CheckCircle,
  User,
} from "lucide-react";
import { Vendor } from "@/types/vendor";
import { PurchaseOrder } from "@/types/purchase-orders";

interface VendorViewProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: Vendor | null;
}

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string | number | null | undefined;
  fallback?: string;
}

const DetailRow: React.FC<DetailRowProps> = ({
  icon,
  label,
  value,
  fallback = "Not provided",
}) => (
  <div className="flex items-start space-x-3 py-2">
    <div className="flex-shrink-0 mt-0.5">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <p className="text-sm text-gray-900 break-words">
        {value != null ? (
          value
        ) : (
          <span className="text-gray-400 italic">{fallback}</span>
        )}
      </p>
    </div>
  </div>
);

export function VendorView({ isOpen, onClose, vendor }: VendorViewProps) {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && vendor) {
      loadData();
    }
  }, [isOpen, vendor]);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const shopsData = await getActiveShops();
      setShops(Array.isArray(shopsData) ? shopsData : []);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load additional information");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString?: string | null) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const formatVendorType = (vendorType?: string | null) => {
    switch (vendorType) {
      case "manufacturer":
        return "Manufacturer";
      case "wholesaler":
        return "Wholesaler";
      case "distributor":
        return "Distributor";
      case "local_supplier":
        return "Local Supplier";
      default:
        return null;
    }
  };

  const formatStatus = (status?: string | null) => {
    switch (status) {
      case "active":
        return "Active";
      case "inactive":
        return "Inactive";
      case "suspended":
        return "Suspended";
      default:
        return null;
    }
  };

  const formatCurrency = (amount?: number | null) => {
    if (amount == null) return null;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getPurchaseOrders = () => {
    if (!vendor?.purchase_orders || vendor.purchase_orders.length === 0) {
      return [];
    }

    return vendor.purchase_orders.map((order: PurchaseOrder) => ({
      id: order.id || 0,
      name: order.name,
      total_amount: order.total_amount,
      status: order.status,
    }));
  };

  if (!isOpen || !vendor) return null;

  const purchaseOrders = getPurchaseOrders();
  const shopName =
    vendor.shop_name ??
    (typeof vendor.shop === "number"
      ? shops.find((s) => s.id === vendor.shop)?.name
      : vendor.shop?.name) ??
    null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
      <div className="bg-white w-full max-w-4xl h-full overflow-y-auto shadow-2xl pointer-events-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Vendor Details
              </h2>
              <p className="text-gray-600 mt-1">{vendor.name}</p>
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
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Loading additional information...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-yellow-800 font-medium">Warning</p>
                <p className="text-yellow-700 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Status Badge */}
          <div className="flex items-center space-x-4">
            <Badge
              className={
                vendor.status === "active"
                  ? "bg-green-100 text-green-800"
                  : vendor.status === "inactive"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }
            >
              {vendor.status === "active" ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active Vendor
                </>
              ) : vendor.status === "inactive" ? (
                <>
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Inactive Vendor
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Suspended Vendor
                </>
              )}
            </Badge>
          </div>

          {/* Vendor Information */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50/50">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <Briefcase className="mr-2 h-5 w-5" />
                Vendor Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailRow
                  icon={<Briefcase className="h-4 w-4 text-gray-500" />}
                  label="Vendor Name"
                  value={vendor.name}
                />
                <DetailRow
                  icon={<User className="h-4 w-4 text-gray-500" />}
                  label="Contact Person"
                  value={vendor.contact_person}
                />
                <DetailRow
                  icon={<Briefcase className="h-4 w-4 text-gray-500" />}
                  label="Vendor Type"
                  value={formatVendorType(vendor.vendor_type)}
                />
                <DetailRow
                  icon={<FileText className="h-4 w-4 text-gray-500" />}
                  label="Status"
                  value={formatStatus(vendor.status)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50/50">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <Phone className="mr-2 h-5 w-5" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <DetailRow
                  icon={<Phone className="h-4 w-4 text-gray-500" />}
                  label="Phone Number"
                  value={vendor.phone}
                />
                <DetailRow
                  icon={<Mail className="h-4 w-4 text-gray-500" />}
                  label="Email Address"
                  value={vendor.email}
                />
                <DetailRow
                  icon={<MapPin className="h-4 w-4 text-gray-500" />}
                  label="Address"
                  value={vendor.address}
                />
              </div>
            </CardContent>
          </Card>

          {/* Business Details */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50/50">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Business Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailRow
                  icon={<FileText className="h-4 w-4 text-gray-500" />}
                  label="License Number"
                  value={vendor.license_number}
                />
                <DetailRow
                  icon={<FileText className="h-4 w-4 text-gray-500" />}
                  label="Tax ID"
                  value={vendor.tax_id}
                />
                <DetailRow
                  icon={<DollarSign className="h-4 w-4 text-gray-500" />}
                  label="Credit Limit"
                  value={formatCurrency(vendor.credit_limit)}
                />
                <DetailRow
                  icon={<FileText className="h-4 w-4 text-gray-500" />}
                  label="Payment Terms"
                  value={vendor.payment_terms}
                />
                <DetailRow
                  icon={<Briefcase className="h-4 w-4 text-gray-500" />}
                  label="Shop"
                  value={loading ? "Loading..." : shopName}
                />
              </div>
            </CardContent>
          </Card>

          {/* Purchase Orders */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50/50">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Purchase Orders ({vendor.total_orders || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Loading purchase orders...
                </div>
              ) : purchaseOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No purchase orders on file</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {purchaseOrders.map((order) => (
                    <div
                      key={order.id.toString()}
                      className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <div className="flex items-start space-x-2">
                        <Package className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {order.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Total: {formatCurrency(Number(order.total_amount))}
                          </p>
                          <p className="text-sm text-gray-600">
                            Status: {formatStatus(order.status)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Business Information */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50/50">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailRow
                  icon={<Calendar className="h-4 w-4 text-gray-500" />}
                  label="Created Date"
                  value={formatDateTime(vendor.created_date)}
                />
                <DetailRow
                  icon={<Calendar className="h-4 w-4 text-gray-500" />}
                  label="Last Updated"
                  value={formatDateTime(vendor.updated_at)}
                />
                <DetailRow
                  icon={<DollarSign className="h-4 w-4 text-gray-500" />}
                  label="Total Purchased"
                  value={formatCurrency(vendor.total_amount_purchased)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50/50">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <DetailRow
                  icon={<FileText className="h-4 w-4 text-gray-500" />}
                  label="Notes"
                  value={vendor.notes}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
