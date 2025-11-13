'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  Download, 
  Printer, 
  Calendar, 
  User, 
  CreditCard,
  Package,
  Clock
} from 'lucide-react';
import { Invoice } from '../types';
import { ThermalInvoicePreview } from './ThermalInvoicePreview';

interface InvoicesListProps {
  invoices: Invoice[];
  loading?: boolean;
}

export function InvoicesList({ invoices, loading = false }: InvoicesListProps) {
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'mpesa':
        return <CreditCard className="h-4 w-4" />;
      case 'cash':
        return <CreditCard className="h-4 w-4" />;
      case 'bank':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handlePreviewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    // TODO: Implement download functionality
    console.log('Download invoice:', invoice);
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    // TODO: Implement print functionality
    console.log('Print invoice:', invoice);
  };

  const handleClosePreview = () => {
    setSelectedInvoice(null);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sales Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (invoices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sales Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices found</h3>
            <p className="text-gray-500">No sales invoices match your current filters.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Sales Invoices</span>
            <Badge variant="secondary">
              {invoices.length} invoices
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {invoice.invoice_number}
                      </h3>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status_display}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{invoice.customer_name}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(invoice.created_at)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4" />
                        <span>{invoice.payment_method_display}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Package className="h-4 w-4" />
                        <span>{invoice.items.length} items</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        <span>Created by: {invoice.created_by_name}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">
                          KSh {parseFloat(invoice.total_amount).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {invoice.items.length} items
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4 flex flex-col space-y-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePreviewInvoice(invoice)}
                      className="w-full"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownloadInvoice(invoice)}
                      className="w-full"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePrintInvoice(invoice)}
                      className="w-full"
                    >
                      <Printer className="h-4 w-4 mr-1" />
                      Print
                    </Button>
                  </div>
                </div>
                
                {/* Invoice Items Preview */}
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm font-medium text-gray-700 mb-2">Items:</div>
                  <div className="space-y-1">
                    {invoice.items.slice(0, 3).map((item, index) => (
                      <div key={item.id} className="flex justify-between text-sm text-gray-600">
                        <span>{item.product_name}</span>
                        <span>{item.quantity} × KSh {parseFloat(item.unit_price).toLocaleString()}</span>
                      </div>
                    ))}
                    {invoice.items.length > 3 && (
                      <div className="text-sm text-gray-500 italic">
                        +{invoice.items.length - 3} more items
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Thermal Invoice Preview Modal */}
      <ThermalInvoicePreview
        invoice={selectedInvoice}
        onClose={handleClosePreview}
        onDownload={handleDownloadInvoice}
        onPrint={handlePrintInvoice}
      />
    </>
  );
} 