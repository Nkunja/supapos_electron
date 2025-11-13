"use client";

import { useState, useEffect } from "react";
import {
  getPurchaseOrders,
  deletePurchaseOrder,
} from "@/app/api/purchase-orders";
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
  Package,
  Loader2,
} from "lucide-react";
import { PurchaseOrder } from "@/types/purchase-orders";
import { PurchaseOrderForm } from "./form";

export default function PurchaseOrdersPage() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [selectedPurchaseOrder, setSelectedPurchaseOrder] =
    useState<PurchaseOrder | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);

  useEffect(() => {
    loadPurchaseOrders();
  }, []);

  const loadPurchaseOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPurchaseOrders();

      // Ensure data is an array
      if (Array.isArray(data)) {
        setPurchaseOrders(data);
      } else if (data && typeof data === "object" && "results" in data) {
        // Handle paginated response
        setPurchaseOrders((data as any).results || []);
      } else {
        console.error("API returned unexpected data format:", data);
        setPurchaseOrders([]);
        setError("Received unexpected data format from server");
        toast.error("Failed to load purchase orders: Invalid data format");
      }
    } catch (error) {
      console.error("Error loading purchase orders:", error);
      setPurchaseOrders([]);
      setError("Failed to load purchase orders");
      toast.error("Failed to load purchase orders");
    } finally {
      setLoading(false);
    }
  };

  const handleAddNew = () => {
    setSelectedPurchaseOrder(null);
    setIsFormOpen(true);
  };

  const handleEdit = (purchaseOrder: PurchaseOrder) => {
    setSelectedPurchaseOrder(purchaseOrder);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this purchase order?")) {
      return;
    }

    setDeleting(id);
    try {
      await deletePurchaseOrder(id);
      toast.success("Purchase order deleted successfully");
      loadPurchaseOrders();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete purchase order");
    } finally {
      setDeleting(null);
    }
  };

  const handleFormSuccess = () => {
    loadPurchaseOrders();
    setIsFormOpen(false);
    setSelectedPurchaseOrder(null);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      draft: "bg-gray-100 text-gray-800",
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return "Invalid Date";
    }
  };

  const formatCurrency = (amount: string | number | undefined) => {
    if (!amount) return "-";
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return isNaN(numAmount) ? "-" : `Ksh ${numAmount.toFixed(2)}`;
  };

  const filteredPurchaseOrders = Array.isArray(purchaseOrders)
    ? purchaseOrders.filter(
        (po) =>
          po.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (po.supplier_name &&
            po.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading purchase orders...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Purchase Orders
              </h1>
              <p className="text-gray-600">Manage your purchase orders</p>
            </div>
          </div>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Error Loading Purchase Orders
              </h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={loadPurchaseOrders} variant="outline">
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
          <Package className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Purchase Orders
            </h1>
            <p className="text-gray-600">Manage your purchase orders</p>
          </div>
        </div>
        <Button
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Purchase Order
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Purchase Orders ({filteredPurchaseOrders.length})
            </CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search purchase orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredPurchaseOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No purchase orders found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? "Try adjusting your search criteria."
                  : "Get started by creating your first purchase order."}
              </p>
              {!searchTerm && (
                <Button onClick={handleAddNew}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Purchase Order
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Qty Received</TableHead>
                  <TableHead>Created Date</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPurchaseOrders.map((po) => (
                  <TableRow key={po.id}>
                    <TableCell className="font-medium">
                      {po.name || "-"}
                    </TableCell>
                    <TableCell>{po.supplier_name || "-"}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(po.status)}>
                        {po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(po.total_amount)}</TableCell>
                    <TableCell>{po.quantity_received || 0}</TableCell>
                    <TableCell>{formatDate(po.created_date)}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(po)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(po.id!)}
                            className="text-red-600"
                            disabled={deleting === po.id}
                          >
                            {deleting === po.id ? (
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

      <PurchaseOrderForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        purchaseOrder={selectedPurchaseOrder}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
