"use client";

import { useState, useEffect } from "react";
import { getProducts, Product } from "@/app/api/products";
import { getActiveShops, Shop } from "@/app/api/shop";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Heart,
  Pill,
  Users,
  Clock,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { Customer } from "@/types/customer";

interface CustomerViewProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
}

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string | null | undefined;
  fallback?: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ icon, label, value, fallback = "Not provided" }) => (
  <div className="flex items-start space-x-3 py-2">
    <div className="flex-shrink-0 mt-0.5">{icon}</div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-gray-700">{label}</p>
      <p className="text-sm text-gray-900 break-words">
        {value || <span className="text-gray-400 italic">{fallback}</span>}
      </p>
    </div>
  </div>
);

export function CustomerView({ isOpen, onClose, customer }: CustomerViewProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && customer) {
      loadData();
    }
  }, [isOpen, customer]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [productsData, shopsData] = await Promise.all([
        getProducts(),
        getActiveShops()
      ]);

      // Handle products data structure
      const productsArray = Array.isArray(productsData) 
        ? productsData 
        : (productsData?.results || []);
      setProducts(productsArray);

      // Handle shops data
      setShops(Array.isArray(shopsData) ? shopsData : []);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load additional information");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const formatDateTime = (dateString?: string | null) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  const getGenderDisplay = (gender?: string | null) => {
    switch (gender) {
      case 'M': return 'Male';
      case 'F': return 'Female';
      case 'O': return 'Other';
      default: return null;
    }
  };

  const getPrescriptionNames = () => {
    if (!customer?.prescriptions || customer.prescriptions.length === 0) {
      return [];
    }

    return customer.prescriptions
      .map(prescriptionId => {
        const id = typeof prescriptionId === 'number' ? prescriptionId : parseInt(prescriptionId.toString());
        const product = products.find(p => p.id === id);
        return product ? {
          id: id,
          name: product.name,
          genericName: product.generic_name
        } : {
          id: id,
          name: `Product ID: ${id}`,
          genericName: null
        };
      })
      .filter(Boolean);
  };

  const calculateAge = (dateOfBirth?: string | null) => {
    if (!dateOfBirth) return null;
    try {
      const birth = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      
      return age;
    } catch {
      return null;
    }
  };

  const isVisitOverdue = (nextVisit?: string | null) => {
    if (!nextVisit) return false;
    try {
      return new Date(nextVisit) < new Date();
    } catch {
      return false;
    }
  };

  if (!isOpen || !customer) return null;

  const prescriptions = getPrescriptionNames();
  const age = calculateAge(customer.date_of_birth);
 const shopName = customer.shop_name ?? null;
  const visitOverdue = isVisitOverdue(customer.next_visit);

  return (
    <div className="fixed inset-0 z-50 flex justify-end pointer-events-none">
      <div className="bg-white w-full max-w-4xl h-full overflow-y-auto shadow-2xl pointer-events-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Customer Details
              </h2>
              <p className="text-gray-600 mt-1">
                {customer.full_name || `${customer.first_name} ${customer.last_name}`}
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
              className={customer.is_active 
                ? "bg-green-100 text-green-800" 
                : "bg-red-100 text-red-800"
              }
            >
              {customer.is_active ? (
                <>
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active Customer
                </>
              ) : (
                <>
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Inactive Customer
                </>
              )}
            </Badge>
            
            {visitOverdue && (
              <Badge className="bg-red-100 text-red-800">
                <Clock className="h-3 w-3 mr-1" />
                Visit Overdue
              </Badge>
            )}
          </div>

          {/* Personal Information */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50/50">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <User className="mr-2 h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailRow
                  icon={<User className="h-4 w-4 text-gray-500" />}
                  label="Full Name"
                  value={customer.full_name || `${customer.first_name} ${customer.last_name}`}
                />
                <DetailRow
                  icon={<Calendar className="h-4 w-4 text-gray-500" />}
                  label="Date of Birth"
                  value={formatDate(customer.date_of_birth)}
                />
                <DetailRow
                  icon={<User className="h-4 w-4 text-gray-500" />}
                  label="Gender"
                  value={getGenderDisplay(customer.gender)}
                />
                <DetailRow
                  icon={<Calendar className="h-4 w-4 text-gray-500" />}
                  label="Age"
                  value={age ? `${age} years old` : null}
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
                  value={customer.phone_number}
                />
                <DetailRow
                  icon={<Mail className="h-4 w-4 text-gray-500" />}
                  label="Email Address"
                  value={customer.email}
                />
                <DetailRow
                  icon={<MapPin className="h-4 w-4 text-gray-500" />}
                  label="Address"
                  value={customer.address}
                />
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
              <div className="space-y-4">
                <DetailRow
                  icon={<AlertCircle className="h-4 w-4 text-gray-500" />}
                  label="Allergies"
                  value={customer.allergies}
                />
                <DetailRow
                  icon={<Heart className="h-4 w-4 text-gray-500" />}
                  label="Medical Conditions"
                  value={customer.medical_conditions}
                />
                <DetailRow
                  icon={<FileText className="h-4 w-4 text-gray-500" />}
                  label="Medication Notes"
                  value={customer.medication_notes}
                />
              </div>
            </CardContent>
          </Card>

          {/* Current Prescriptions */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50/50">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <Pill className="mr-2 h-5 w-5" />
                Current Prescriptions ({prescriptions.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Loading prescriptions...
                </div>
              ) : prescriptions.length === 0 ? (
                <div className="text-center py-8">
                  <Pill className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">No prescriptions on file</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {prescriptions.map((prescription) => (
                    <div 
                      key={prescription.id.toString()}
                      className="p-4 border border-gray-200 rounded-lg bg-gray-50"
                    >
                      <div className="flex items-start space-x-2">
                        <Pill className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="font-medium text-gray-900">{prescription.name}</p>
                          {prescription.genericName && prescription.genericName !== prescription.name && (
                            <p className="text-sm text-gray-600">
                              Generic: {prescription.genericName}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Visit Information */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50/50">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Visit Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailRow
                  icon={<Calendar className="h-4 w-4 text-gray-500" />}
                  label="Last Visit"
                  value={formatDateTime(customer.last_visit)}
                />
                <DetailRow
                  icon={<Calendar className="h-4 w-4 text-gray-500" />}
                  label="Next Visit"
                  value={formatDateTime(customer.next_visit)}
                />
                <DetailRow
                  icon={<Clock className="h-4 w-4 text-gray-500" />}
                  label="Visit Frequency"
                  value={customer.visit_frequency_days ? `Every ${customer.visit_frequency_days} days` : null}
                />
              </div>
            </CardContent>
          </Card>

          {/* Business Information */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50/50">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Business Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <DetailRow
                  icon={<Users className="h-4 w-4 text-gray-500" />}
                  label="Shop"
                  value={loading ? "Loading..." : shopName}
                />
                <DetailRow
                  icon={<Calendar className="h-4 w-4 text-gray-500" />}
                  label="Customer Since"
                  value={formatDateTime(customer.created_at)}
                />
                <DetailRow
                  icon={<Calendar className="h-4 w-4 text-gray-500" />}
                  label="Last Updated"
                  value={formatDateTime(customer.updated_at)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card className="border-gray-200 shadow-sm">
            <CardHeader className="bg-gray-50/50">
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Notes & Additional Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <DetailRow
                  icon={<FileText className="h-4 w-4 text-gray-500" />}
                  label="Description"
                  value={customer.description}
                />
                <DetailRow
                  icon={<FileText className="h-4 w-4 text-gray-500" />}
                  label="Notes"
                  value={customer.notes}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}