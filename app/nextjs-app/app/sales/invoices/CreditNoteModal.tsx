import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Package, Loader2 } from "lucide-react";
import { Invoice } from "../types";

interface CreditNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedInvoice: Invoice | null;
  creditNoteNotes: string;
  setCreditNoteNotes: (notes: string) => void;
  creatingCreditNote: boolean;
  handleCreateCreditNote: () => void;
  formatCurrency: (amount: number | string) => string;
}

export default function CreditNoteModal({
  open,
  onOpenChange,
  selectedInvoice,
  creditNoteNotes,
  setCreditNoteNotes,
  creatingCreditNote,
  handleCreateCreditNote,
  formatCurrency,
}: CreditNoteModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Create Credit Note
          </DialogTitle>
        </DialogHeader>
        {selectedInvoice && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Invoice Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Invoice Number:</p>
                    <p className="font-mono font-bold">
                      {selectedInvoice.invoice_number}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Customer:</p>
                    <p className="font-medium">
                      {selectedInvoice.customer_name || "Walk-in Customer"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Amount:</p>
                    <p className="font-bold text-lg">
                      {formatCurrency(selectedInvoice.total_amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payment Method:</p>
                    <p className="font-medium">
                      {selectedInvoice.payment_method_display}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Items to Credit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {selectedInvoice.items?.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="flex justify-between items-center p-2 bg-muted/30 rounded"
                    >
                      <div>
                        <p className="font-medium">{item.product_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.quantity} ×{" "}
                          {formatCurrency(item.unit_price)}
                        </p>
                      </div>
                      <p className="font-bold">
                        {formatCurrency(item.total_price)}
                      </p>
                    </div>
                  ))}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold">
                    <span>Credit Total:</span>
                    <span className="text-red-600">
                      {formatCurrency(selectedInvoice.total_amount)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div>
              <Label htmlFor="credit-notes" className="text-sm font-medium">
                Notes (Optional)
              </Label>
              <Input
                id="credit-notes"
                value={creditNoteNotes}
                onChange={(e) => setCreditNoteNotes(e.target.value)}
                placeholder="Enter reason for credit note or additional notes"
                className="mt-1"
              />
            </div>
          </div>
        )}
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={creatingCreditNote}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateCreditNote}
            disabled={creatingCreditNote}
            className="bg-red-600 hover:bg-red-700"
          >
            {creatingCreditNote && (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            )}
            Create Credit Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
