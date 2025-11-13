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
  RefreshCw
} from 'lucide-react';
import { Invoice } from '../types';
import { ThermalInvoicePreview } from './ThermalInvoicePreview';

interface RecentInvoicesProps {
  invoices: Invoice[];
  loading?: boolean;
  onRefresh?: () => void;
}

export function RecentInvoices({ invoices, loading = false, onRefresh }: RecentInvoicesProps) {
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
          <CardTitle className="flex items-center justify-between">
            <span>Recent Sales</span>
            <Button size="sm" variant="outline" disabled>
              <RefreshCw className="h-4 w-4 animate-spin" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-gray-200 rounded-lg"></div>
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
          <CardTitle className="flex items-center justify-between">
            <span>Recent Sales</span>
            <Button size="sm" variant="outline" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recent sales</h3>
            <p className="text-gray-500">Start making sales to see them here.</p>
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
            <span>Recent Sales</span>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                {invoices.length} invoices
              </Badge>
              <Button size="sm" variant="outline" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {invoices.slice(0, 5).map((invoice) => (
              <div
                key={invoice.id}
                className="border rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handlePreviewInvoice(invoice)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {invoice.invoice_number}
                      </h3>
                      <Badge className={`${getStatusColor(invoice.status)} text-xs`}>
                        {invoice.status_display}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span className="truncate">{invoice.customer_name}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(invoice.created_at)}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <CreditCard className="h-3 w-3" />
                        <span>{invoice.payment_method_display}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <Package className="h-3 w-3" />
                        <span>{invoice.items.length} items</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        {invoice.created_by_name}
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-gray-900">
                          KSh {parseFloat(invoice.total_amount).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-3 flex flex-col space-y-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviewInvoice(invoice);
                      }}
                      className="h-7 px-2"
                    >
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrintInvoice(invoice);
                      }}
                      className="h-7 px-2"
                    >
                      <Printer className="h-3 w-3" />
                    </Button>
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