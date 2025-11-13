"use client";

import { useState, useEffect } from "react";
import {
  getVendors,
  deleteVendor,
  activateVendor,
  deactivateVendor,
} from "@/app/api/vendor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-toastify";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  MoreHorizontal,
  Briefcase,
  Loader2,
  CheckCircle,
  XCircle,
  Eye,
  Mail,
  Phone,
} from "lucide-react";
import { VendorForm } from "./form";
import { VendorView } from "./VendorView";
import { Vendor } from "@/types/vendor";

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isViewOpen, setIsViewOpen] = useState<boolean>(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [viewVendor, setViewVendor] = useState<Vendor | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [activeCount, setActiveCount] = useState<number>(0);

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getVendors();
      if (Array.isArray(data)) {
        setVendors(data);
        setActiveCount(data.filter((v) => v.status === "active").length);
      } else {
        console.error("API returned unexpected data format:", data);
        setVendors([]);
        setActiveCount(0);
        setError("Received unexpected data format from server");
        toast.error("Failed to load vendors: Invalid data format");
      }
    } catch (error: any) {
      console.error("Error loading vendors:", error);
      setVendors([]);
      setActiveCount(0);
      setError(error.message || "Failed to load vendors");
      toast.error(error.message || "Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedVendor(null);
    setIsFormOpen(true);
  };

  const handleEdit = (vendor: Vendor) => {
    setSelectedVendor(vendor);
    setIsFormOpen(true);
  };

  const handleView = (vendor: Vendor) => {
    setViewVendor(vendor);
    setIsViewOpen(true);
  };

  const handleActivate = async (vendor: Vendor) => {
    if (!vendor.id) {
      toast.error("Invalid vendor ID");
      return;
    }

    try {
      await activateVendor(vendor.id);
      toast.success(`Vendor ${vendor.name} activated successfully`);
      loadVendors();
    } catch (error: any) {
      toast.error(error.message || "Failed to activate vendor");
    }
  };

  const handleDeactivate = async (vendor: Vendor) => {
    if (!vendor.id) {
      toast.error("Invalid vendor ID");
      return;
    }

    try {
      await deactivateVendor(vendor.id);
      toast.success(`Vendor ${vendor.name} deactivated successfully`);
      loadVendors();
    } catch (error: any) {
      toast.error(error.message || "Failed to deactivate vendor");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this vendor?")) {
      return;
    }

    setDeleting(id);
    try {
      await deleteVendor(id);
      toast.success("Vendor deleted successfully");
      loadVendors();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete vendor");
    } finally {
      setDeleting(null);
    }
  };

  const handleFormSuccess = () => {
    loadVendors();
    setIsFormOpen(false);
    setSelectedVendor(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "suspended":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatVendorType = (vendorType?: string) => {
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
        return "-";
    }
  };

  // Filter vendors with proper null checks
  const filteredVendors = Array.isArray(vendors)
    ? vendors.filter((vendor) => {
        if (!vendor) return false;

        const matchesSearch =
          vendor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vendor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          vendor.phone?.includes(searchTerm) ||
          vendor.contact_person
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesFilter =
          filterStatus === "all" || filterStatus === vendor.status;

        return matchesSearch && matchesFilter;
      })
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading vendors...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Briefcase className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Vendors</h1>
              <p className="text-gray-600">Manage your vendors</p>
            </div>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6 text-center">
            <Briefcase className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error Loading Vendors
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={loadVendors} variant="outline">
              <Loader2 className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Briefcase className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Vendors</h1>
            <p className="text-gray-600">
              Manage your vendors and their details
            </p>
          </div>
        </div>
        <Button
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Vendor
        </Button>
      </div>

      {/* Vendor Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active Vendors
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {activeCount}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Total Vendors
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredVendors.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Vendors ({filteredVendors.length})</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <Button
                  variant={filterStatus === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("all")}
                >
                  All
                </Button>
                <Button
                  variant={filterStatus === "active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("active")}
                >
                  Active
                </Button>
                <Button
                  variant={filterStatus === "inactive" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("inactive")}
                >
                  Inactive
                </Button>
                <Button
                  variant={filterStatus === "suspended" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus("suspended")}
                >
                  Suspended
                </Button>
              </div>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredVendors.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No vendors found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? "Try adjusting your search criteria."
                  : "Get started by adding your first vendor."}
              </p>
              {!searchTerm && (
                <Button onClick={handleAddNew}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vendor
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id || `vendor-${Math.random()}`}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{vendor.name}</div>
                        {vendor.contact_person && (
                          <div className="text-sm text-gray-500">
                            {vendor.contact_person}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {vendor.phone || "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-gray-400" />
                        {vendor.email || "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatVendorType(vendor.vendor_type)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(vendor.status)}>
                        {formatVendorType(vendor.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div
                        className="max-w-[150px] truncate"
                        title={vendor.notes || ""}
                      >
                        {vendor.notes || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleView(vendor)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(vendor)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          {vendor.status !== "active" && (
                            <DropdownMenuItem
                              onClick={() => handleActivate(vendor)}
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Activate
                            </DropdownMenuItem>
                          )}
                          {vendor.status !== "inactive" && (
                            <DropdownMenuItem
                              onClick={() => handleDeactivate(vendor)}
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Deactivate
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => vendor.id && handleDelete(vendor.id)}
                            className="text-red-600"
                            disabled={deleting === vendor.id}
                          >
                            {deleting === vendor.id ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="mr-2 h-4 w-4" />
                            )}
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <VendorForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        vendor={selectedVendor}
        onSuccess={handleFormSuccess}
      />

      <VendorView
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        vendor={viewVendor}
      />
    </div>
  );
}
