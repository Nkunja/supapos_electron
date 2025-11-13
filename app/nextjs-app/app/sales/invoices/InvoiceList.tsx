import { Invoice } from "../types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Receipt,
  User,
  Store,
  CreditCard,
  Calendar,
  MoreHorizontal,
  Eye,
  Minus,
  Loader2,
  DollarSign,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface InvoiceListProps {
  filteredInvoices: Invoice[];
  loading: boolean;
  formatCurrency: (amount: number | string) => string;
  setSelectedInvoice: (invoice: Invoice | null) => void;
  setViewModalOpen: (open: boolean) => void;
  setCreditNoteModalOpen: (open: boolean) => void;
}

export default function InvoiceList({
  filteredInvoices,
  loading,
  formatCurrency,
  setSelectedInvoice,
  setViewModalOpen,
  setCreditNoteModalOpen,
}: InvoiceListProps) {
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading all invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="block lg:hidden space-y-4">
        {filteredInvoices.map((invoice) => (
          <Card key={invoice.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Receipt className="h-5 w-5 text-primary" />
                  {invoice.invoice_number}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant={getStatusVariant(invoice.status_display)}>
                    {invoice.status_display}
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setViewModalOpen(true);
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        View Invoice
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedInvoice(invoice);
                          setCreditNoteModalOpen(true);
                        }}
                        disabled={!!invoice.credit_note}
                      >
                        <Minus className="mr-2 h-4 w-4" />
                        {invoice.credit_note
                          ? "Credit Note Issued"
                          : "Make Credit Note"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Customer:</span>
                  <span className="font-medium">
                    {invoice.customer_name || "Walk-in Customer"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Shop:</span>
                  <span className="font-medium">{invoice.shop_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-bold text-lg">
                    {formatCurrency(invoice.total_amount)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Payment:</span>
                  <span className="font-medium">
                    {invoice.payment_method_display}
                  </span>
                </div>
                <div className="flex items-center gap-2 sm:col-span-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium">
                    {new Date(invoice.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredInvoices.length === 0 && !loading && (
          <Card>
            <CardContent className="text-center py-8">
              <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No invoices found for the selected period
              </p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your date range
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="hidden lg:block">
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold">
                    Invoice Number
                  </TableHead>
                  <TableHead className="font-semibold">Customer</TableHead>
                  <TableHead className="font-semibold">Shop</TableHead>
                  <TableHead className="font-semibold text-right">
                    Total Amount
                  </TableHead>
                  <TableHead className="font-semibold">
                    Payment Method
                  </TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="font-semibold">Created At</TableHead>
                  <TableHead className="font-semibold text-center">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id} className="hover:bg-muted/50">
                    <TableCell className="font-mono font-medium">
                      {invoice.invoice_number}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {invoice.customer_name || "Walk-in Customer"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4 text-muted-foreground" />
                        {invoice.shop_name}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold">
                      {formatCurrency(invoice.total_amount)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        {invoice.payment_method_display}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(invoice.status_display)}>
                        {invoice.status_display}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(invoice.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedInvoice(invoice);
                                setViewModalOpen(true);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Invoice
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedInvoice(invoice);
                                setCreditNoteModalOpen(true);
                              }}
                              disabled={!!invoice.credit_note}
                            >
                              <Minus className="mr-2 h-4 w-4" />
                              {invoice.credit_note
                                ? "Credit Note Issued"
                                : "Make Credit Note"}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredInvoices.length === 0 && !loading && (
              <div className="text-center py-12">
                <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  No invoices found for the selected period
                </p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your date range
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
