'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CreditNote } from '../types';
import { getCreditNotes } from '@/app/api/credit-notes';
import { 
  FileText, 
  Receipt, 
  User, 
  Store, 
  DollarSign, 
  Calendar,
  MessageSquare,
  Loader2,
  MoreHorizontal,
  Eye,
  Hash,
  Phone,
  MapPin,
  Package,
  ShoppingCart,
  Minus
} from 'lucide-react';

export default function CreditNotesPage() {
  const [creditNotes, setCreditNotes] = useState<CreditNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedCreditNote, setSelectedCreditNote] = useState<CreditNote | null>(null);

  useEffect(() => {
    const fetchCreditNotes = async () => {
      try {
        const response = await getCreditNotes();
        setCreditNotes(response.results);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching credit notes:', error);
        toast.error('Failed to load credit notes');
        setLoading(false);
      }
    };
    fetchCreditNotes();
  }, []);

  const handleViewCreditNote = (creditNote: CreditNote) => {
    setSelectedCreditNote(creditNote);
    setViewModalOpen(true);
  };

  const formatCurrency = (amount: number | string) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(Number(amount));
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading credit notes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Credit Notes</h1>
          <p className="text-muted-foreground">
            View and manage all issued credit notes
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <FileText className="h-4 w-4" />
          <span>{creditNotes.length} credit notes</span>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block lg:hidden space-y-4">
        {creditNotes.map((creditNote) => (
          <Card key={creditNote.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {creditNote.credit_note_number}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-red-50 text-red-700 border-red-200">
                    Credit Note
                  </Badge>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewCreditNote(creditNote)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Credit Note
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Original Invoice:</span>
                  <span className="font-mono font-medium">{creditNote.original_invoice_number}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Customer:</span>
                  <span className="font-medium">{creditNote.customer_name || 'Walk-in Customer'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Shop:</span>
                  <span className="font-medium">{creditNote.shop_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Minus className="h-4 w-4 text-red-600" />
                  <span className="text-muted-foreground">Credit Amount:</span>
                  <span className="font-bold text-lg text-red-600">{formatCurrency(creditNote.total_amount)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Created:</span>
                  <span className="font-medium">{new Date(creditNote.created_at).toLocaleString()}</span>
                </div>
                {creditNote.notes && (
                  <div className="flex items-start gap-2 pt-2 border-t">
                    <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <span className="text-muted-foreground text-sm">Notes:</span>
                      <p className="text-sm mt-1 p-2 bg-muted rounded text-muted-foreground">
                        {creditNote.notes}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-semibold">Credit Note Number</TableHead>
                  <TableHead className="font-semibold">Original Invoice</TableHead>
                  <TableHead className="font-semibold">Customer</TableHead>
                  <TableHead className="font-semibold">Shop</TableHead>
                  <TableHead className="font-semibold text-right">Credit Amount</TableHead>
                  <TableHead className="font-semibold">Created At</TableHead>
                  <TableHead className="font-semibold">Notes</TableHead>
                  <TableHead className="font-semibold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {creditNotes.map((creditNote) => (
                  <TableRow key={creditNote.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-primary" />
                        <span className="font-mono font-medium">{creditNote.credit_note_number}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono">{creditNote.original_invoice_number}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {creditNote.customer_name || 'Walk-in Customer'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4 text-muted-foreground" />
                        {creditNote.shop_name}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-red-600">
                      <div className="flex items-center justify-end gap-1">
                        <Minus className="h-4 w-4" />
                        {formatCurrency(creditNote.total_amount)}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(creditNote.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      {creditNote.notes ? (
                        <div className="flex items-start gap-2">
                          <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground line-clamp-2">
                            {creditNote.notes}
                          </span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
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
                            <DropdownMenuItem onClick={() => handleViewCreditNote(creditNote)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Credit Note
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Empty State */}
      {creditNotes.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No credit notes found
              </h3>
              <p className="text-sm text-muted-foreground">
                Credit notes will appear here when they are created from invoices.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* View Credit Note Modal */}
      <Dialog open={viewModalOpen} onOpenChange={setViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <FileText className="h-5 w-5 text-red-600" />
              Credit Note Details
            </DialogTitle>
          </DialogHeader>
          {selectedCreditNote && (
            <div className="space-y-6">
              {/* Header Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-red-200 bg-red-50/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-red-800">Credit Note Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-red-600" />
                      <span className="font-mono font-bold text-red-800">{selectedCreditNote.credit_note_number}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Receipt className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-700">Original: {selectedCreditNote.original_invoice_number}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-red-600" />
                      <span className="text-sm text-red-700">{new Date(selectedCreditNote.created_at).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-300">
                        Credit Note
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Customer & Shop Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{selectedCreditNote.customer_name || 'Walk-in Customer'}</span>
                    </div>
                    {selectedCreditNote.customer_phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{selectedCreditNote.customer_phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Store className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{selectedCreditNote.shop_name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Created by: {selectedCreditNote.created_by_name}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Credited Items */}
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-800">
                    <ShoppingCart className="h-5 w-5" />
                    Credited Items ({selectedCreditNote.items?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedCreditNote.items?.map((item, index) => (
                      <div key={item.id || index} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Package className="h-4 w-4 text-red-600" />
                          <div>
                            <p className="font-medium text-red-900">{item.product_name}</p>
                            <p className="text-sm text-red-700">
                              Qty: {item.quantity} × {formatCurrency(item.unit_price)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-800">{formatCurrency(item.total_price)}</p>
                          {item.available_stock !== undefined && (
                            <p className="text-xs text-red-600">Stock: {item.available_stock}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Credit Summary */}
              <Card className="border-red-200 bg-red-50/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-800">
                    <Minus className="h-5 w-5" />
                    Credit Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-red-700">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(selectedCreditNote.subtotal)}</span>
                    </div>
                    {Number(selectedCreditNote.tax_amount) > 0 && (
                      <div className="flex justify-between text-red-700">
                        <span>Tax:</span>
                        <span>{formatCurrency(selectedCreditNote.tax_amount)}</span>
                      </div>
                    )}
                    {Number(selectedCreditNote.discount_amount) > 0 && (
                      <div className="flex justify-between text-red-700">
                        <span>Discount:</span>
                        <span>{formatCurrency(selectedCreditNote.discount_amount)}</span>
                      </div>
                    )}
                    <Separator className="bg-red-300" />
                    <div className="flex justify-between font-bold text-lg text-red-800">
                      <span>Total Credit Amount:</span>
                      <span className="flex items-center gap-1">
                        <Minus className="h-4 w-4" />
                        {formatCurrency(selectedCreditNote.total_amount)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes Section */}
              {selectedCreditNote.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">{selectedCreditNote.notes}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Credit Note Impact Notice */}
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-amber-200 p-1">
                      <MessageSquare className="h-4 w-4 text-amber-800" />
                    </div>
                    <div>
                      <h4 className="font-medium text-amber-900 mb-1">Credit Note Information</h4>
                      <p className="text-sm text-amber-800">
                        This credit note represents a refund or credit for the customer. The credited amount of{' '}
                        <span className="font-bold">{formatCurrency(selectedCreditNote.total_amount)}</span> has been 
                        applied against the original invoice {selectedCreditNote.original_invoice_number}.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}