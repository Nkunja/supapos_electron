'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  Download, 
  Printer, 
  Copy,
  Check
} from 'lucide-react';
import { Invoice } from '../types';

interface ThermalInvoicePreviewProps {
  invoice: Invoice | null;
  onClose: () => void;
  onDownload: (invoice: Invoice) => void;
  onPrint: (invoice: Invoice) => void;
}

export function ThermalInvoicePreview({ 
  invoice, 
  onClose, 
  onDownload, 
  onPrint 
}: ThermalInvoicePreviewProps) {
  const [copied, setCopied] = useState(false);

  if (!invoice) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const copyToClipboard = async () => {
    try {
      const invoiceText = generateInvoiceText();
      await navigator.clipboard.writeText(invoiceText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const generateInvoiceText = () => {
    const lines = [
      '='.repeat(32),
      `    ${invoice.shop_name}`,
      '='.repeat(32),
      `Invoice: ${invoice.invoice_number}`,
      `Date: ${formatDate(invoice.created_at)}`,
      `Customer: ${invoice.customer_name}`,
      `Phone: ${invoice.customer_phone || 'N/A'}`,
      `Cashier: ${invoice.created_by_name}`,
      '-'.repeat(32),
      'ITEMS:',
      '-'.repeat(32),
    ];

    invoice.items.forEach((item) => {
      lines.push(
        `${item.product_name}`,
        `  ${item.quantity} × ${parseFloat(item.unit_price).toFixed(2)} = ${parseFloat(item.total_price).toFixed(2)}`
      );
    });

    lines.push(
      '-'.repeat(32),
      `Subtotal: ${parseFloat(invoice.subtotal).toFixed(2)}`,
      `Tax: ${parseFloat(invoice.tax_amount).toFixed(2)}`,
      `Discount: ${parseFloat(invoice.discount_amount).toFixed(2)}`,
      '='.repeat(32),
      `TOTAL: ${parseFloat(invoice.total_amount).toFixed(2)}`,
      `Paid: ${parseFloat(invoice.amount_paid).toFixed(2)}`,
      `Change: ${parseFloat(invoice.change_amount).toFixed(2)}`,
      '='.repeat(32),
      `Payment: ${invoice.payment_method_display}`,
      `Status: ${invoice.status_display}`,
      '',
      invoice.notes || '',
      '',
      'Thank you for your purchase!',
      '='.repeat(32)
    );

    return lines.join('\n');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">Thermal Invoice Preview</CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={copyToClipboard}
              className="flex items-center space-x-1"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDownload(invoice)}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onPrint(invoice)}
            >
              <Printer className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Thermal Invoice Display */}
          <div className="bg-white border-2 border-gray-300 rounded-lg p-4 font-mono text-sm">
            <div className="text-center mb-4">
              <div className="text-lg font-bold">{invoice.shop_name}</div>
              <div className="text-xs text-gray-600">Business Management</div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Invoice:</span>
                <span className="font-bold">{invoice.invoice_number}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{formatDate(invoice.created_at)}</span>
              </div>
              <div className="flex justify-between">
                <span>Customer:</span>
                <span>{invoice.customer_name}</span>
              </div>
              {invoice.customer_phone && (
                <div className="flex justify-between">
                  <span>Phone:</span>
                  <span>{invoice.customer_phone}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Cashier:</span>
                <span>{invoice.created_by_name}</span>
              </div>
            </div>
            
            <div className="border-t border-b border-gray-300 py-2 mb-4">
              <div className="text-center font-bold mb-2">ITEMS</div>
              {invoice.items.map((item, index) => (
                <div key={item.id} className="mb-2">
                  <div className="font-medium">{item.product_name}</div>
                  <div className="flex justify-between text-sm">
                    <span>{item.quantity} × {parseFloat(item.unit_price).toFixed(2)}</span>
                    <span className="font-bold">{parseFloat(item.total_price).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-1 mb-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>{parseFloat(invoice.subtotal).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>{parseFloat(invoice.tax_amount).toFixed(2)}</span>
              </div>
              {parseFloat(invoice.discount_amount) > 0 && (
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>-{parseFloat(invoice.discount_amount).toFixed(2)}</span>
                </div>
              )}
            </div>
            
            <div className="border-t-2 border-gray-300 pt-2 mb-4">
              <div className="flex justify-between text-lg font-bold">
                <span>TOTAL:</span>
                <span>KSh {parseFloat(invoice.total_amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Paid:</span>
                <span>KSh {parseFloat(invoice.amount_paid).toFixed(2)}</span>
              </div>
              {parseFloat(invoice.change_amount) > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Change:</span>
                  <span>KSh {parseFloat(invoice.change_amount).toFixed(2)}</span>
                </div>
              )}
            </div>
            
            <div className="space-y-1 mb-4 text-sm">
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span>{invoice.payment_method_display}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <Badge variant="outline" className="text-xs">
                  {invoice.status_display}
                </Badge>
              </div>
            </div>
            
            {invoice.notes && (
              <div className="border-t border-gray-300 pt-2 mb-4">
                <div className="text-sm">
                  <div className="font-medium mb-1">Notes:</div>
                  <div className="text-gray-600">{invoice.notes}</div>
                </div>
              </div>
            )}
            
            <div className="text-center text-sm">
              <div className="font-bold mb-1">Thank you for your purchase!</div>
              <div className="text-gray-600">Please keep this receipt for your records</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 