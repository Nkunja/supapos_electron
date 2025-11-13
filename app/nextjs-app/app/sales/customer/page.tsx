"use client";

import { useState, useEffect } from "react";
import { getCustomers, deleteCustomer, getDueVisits, getUpcomingVisits, updateCustomerVisit, Customer } from "@/app/api/customer";

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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Users,
  Loader2,
  UserCheck,
  Clock,
  Calendar,
  Phone,
  Eye,
} from "lucide-react";
import { CustomerForm } from "./form";
import { CustomerView } from "./view";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isViewOpen, setIsViewOpen] = useState<boolean>(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [filterActive, setFilterActive] = useState<string>("all");
  const [dueCount, setDueCount] = useState<number>(0);
  const [upcomingCount, setUpcomingCount] = useState<number>(0);

  useEffect(() => {
    loadCustomers();
    loadVisitCounts();
  }, []);

  const loadCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCustomers();
      
      // The API function now handles array normalization
      if (Array.isArray(data)) {
        setCustomers(data);
      } else {
        console.error("API returned unexpected data format:", data);
        setCustomers([]);
        setError("Received unexpected data format from server");
        toast.error("Failed to load customers: Invalid data format");
      }
    } catch (error: any) {
      console.error("Error loading customers:", error);
      setCustomers([]);
      setError(error.message || "Failed to load customers");
      toast.error(error.message || "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  const loadVisitCounts = async () => {
    try {
      const [dueData, upcomingData] = await Promise.all([
        getDueVisits(),
        getUpcomingVisits()
      ]);
      setDueCount(dueData?.count || 0);
      setUpcomingCount(upcomingData?.count || 0);
    } catch (error) {
      console.error("Error loading visit counts:", error);
      // Don't show error toast for visit counts as they're not critical
      setDueCount(0);
      setUpcomingCount(0);
    }
  };

  const handleAddNew = () => {
    setSelectedCustomer(null);
    setIsFormOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsFormOpen(true);
  };

  const handleView = (customer: Customer) => {
    setViewCustomer(customer);
    setIsViewOpen(true);
  };

  const handleUpdateVisit = async (customer: Customer) => {
    if (!customer.id) {
      toast.error("Invalid customer ID");
      return;
    }

    try {
      await updateCustomerVisit(customer.id);
      toast.success(`Visit updated for ${customer.full_name || `${customer.first_name} ${customer.last_name}`}`);
      loadCustomers();
      loadVisitCounts();
    } catch (error: any) {
      toast.error(error.message || "Failed to update visit");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this customer?")) {
      return;
    }

    setDeleting(id);
    try {
      await deleteCustomer(id);
      toast.success("Customer deleted successfully");
      loadCustomers();
      loadVisitCounts();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete customer");
    } finally {
      setDeleting(null);
    }
  };

  const handleFormSuccess = () => {
    loadCustomers();
    loadVisitCounts();
    setIsFormOpen(false);
    setSelectedCustomer(null);
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? "bg-green-100 text-green-800" 
      : "bg-red-100 text-red-800";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString; // Return original if parsing fails
    }
  };

  const isVisitDue = (nextVisit?: string) => {
    if (!nextVisit) return false;
    try {
      return new Date(nextVisit) <= new Date();
    } catch {
      return false;
    }
  };

  // Filter customers with proper null checks
  const filteredCustomers = Array.isArray(customers) 
    ? customers.filter((customer) => {
        if (!customer) return false;
        
        const matchesSearch = 
          customer.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.phone_number?.includes(searchTerm) ||
          customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesFilter = 
          filterActive === "all" ||
          (filterActive === "active" && customer.is_active) ||
          (filterActive === "inactive" && !customer.is_active);
        
        return matchesSearch && matchesFilter;
      })
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading customers...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
              <p className="text-gray-600">Manage your customers</p>
            </div>
          </div>
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Error Loading Customers
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={loadCustomers} variant="outline">
                <Loader2 className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
            <p className="text-gray-600">Manage your customers and track visits</p>
          </div>
        </div>
        <Button
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      {/* Visit Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Due for Visit</p>
                <p className="text-2xl font-bold text-gray-900">{dueCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming Visits</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{filteredCustomers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <Button
                  variant={filterActive === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterActive("all")}
                >
                  All
                </Button>
                <Button
                  variant={filterActive === "active" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterActive("active")}
                >
                  Active
                </Button>
                <Button
                  variant={filterActive === "inactive" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterActive("inactive")}
                >
                  Inactive
                </Button>
              </div>
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No customers found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? "Try adjusting your search criteria." : "Get started by adding your first customer."}
              </p>
              {!searchTerm && (
                <Button onClick={handleAddNew}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Customer
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Next Visit</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id || `customer-${Math.random()}`}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">
                          {customer.full_name || `${customer.first_name} ${customer.last_name}`}
                        </div>
                        {customer.email && (
                          <div className="text-sm text-gray-500">{customer.email}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-gray-400" />
                        {customer.phone_number || "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(customer.is_active)}>
                        {customer.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(customer.last_visit)}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {customer.next_visit ? (
                          <>
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            <span className={isVisitDue(customer.next_visit) ? "text-red-600 font-medium" : ""}>
                              {formatDate(customer.next_visit)}
                            </span>
                            {isVisitDue(customer.next_visit) && (
                              <Badge className="ml-2 bg-red-100 text-red-800 text-xs">Due</Badge>
                            )}
                          </>
                        ) : (
                          "-"
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[150px] truncate" title={customer.notes || ""}>
                        {customer.notes || "N/A"}
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
                          <DropdownMenuItem onClick={() => handleView(customer)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(customer)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateVisit(customer)}>
                            <Calendar className="mr-2 h-4 w-4" />
                            Update Visit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => customer.id && handleDelete(customer.id)}
                            className="text-red-600"
                            disabled={deleting === customer.id}
                          >
                            {deleting === customer.id ? (
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

      <CustomerForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        customer={selectedCustomer}
        onSuccess={handleFormSuccess}
      />


      <CustomerView
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        customer={viewCustomer}
      />
    </div>
  );
}