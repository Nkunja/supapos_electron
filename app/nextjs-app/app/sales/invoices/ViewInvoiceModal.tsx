import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Invoice } from "../types";
import {
  Receipt,
  Hash,
  Calendar,
  User,
  Phone,
  Store,
  MapPin,
  ShoppingCart,
  Package,
  DollarSign,
  CreditCard,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ViewInvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedInvoice: Invoice | null;
  formatCurrency: (amount: number | string) => string;
}

export default function ViewInvoiceModal({
  open,
  onOpenChange,
  selectedInvoice,
  formatCurrency,
}: ViewInvoiceModalProps) {
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Receipt className="h-5 w-5" />
            Invoice Details
          </DialogTitle>
        </DialogHeader>
        {selectedInvoice && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Invoice Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono font-bold">
                      {selectedInvoice.invoice_number}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {new Date(selectedInvoice.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={getStatusVariant(selectedInvoice.status_display)}
                    >
                      {selectedInvoice.status_display}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Customer & Shop
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {selectedInvoice.customer_name || "Walk-in Customer"}
                    </span>
                  </div>
                  {selectedInvoice.customer_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {selectedInvoice.customer_phone}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Store className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {selectedInvoice.shop_name}
                    </span>
                  </div>
                  {selectedInvoice.shop_address && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {selectedInvoice.shop_address}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Items ({selectedInvoice.items?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedInvoice.items?.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qty: {item.quantity} ×{" "}
                            {formatCurrency(item.unit_price)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">
                          {formatCurrency(item.total_price)}
                        </p>
                        {item.available_stock !== undefined && (
                          <p className="text-xs text-muted-foreground">
                            Stock: {item.available_stock}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Payment Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(selectedInvoice.subtotal)}</span>
                  </div>
                  {Number(selectedInvoice.tax_amount) > 0 && (
                    <div className="flex justify-between">
                      <span>Tax:</span>
                      <span>{formatCurrency(selectedInvoice.tax_amount)}</span>
                    </div>
                  )}
                  {Number(selectedInvoice.discount_amount) > 0 && (
                    <div className="flex justify-between">
                      <span>Discount:</span>
                      <span className="text-green-600">
                        -{formatCurrency(selectedInvoice.discount_amount)}
                      </span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>{formatCurrency(selectedInvoice.total_amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Amount Paid:</span>
                    <span className="text-green-600">
                      {formatCurrency(selectedInvoice.amount_paid)}
                    </span>
                  </div>
                  {Number(selectedInvoice.change_amount) > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Change:</span>
                      <span>
                        {formatCurrency(selectedInvoice.change_amount)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">
                      {selectedInvoice.payment_method_display}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {selectedInvoice.notes && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{selectedInvoice.notes}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
