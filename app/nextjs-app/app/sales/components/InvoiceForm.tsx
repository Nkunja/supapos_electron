// 'use client';

// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Receipt } from 'lucide-react';
// import { CartItem, CustomerDetails } from '../types';

// interface InvoiceFormProps {
//   show: boolean;
//   onClose: () => void;
//   cart: CartItem[];
//   customerDetails: CustomerDetails;
//   onCustomerDetailsChange: (details: CustomerDetails) => void;
//   paymentMethod: 'cash' | 'mpesa' | 'bank';
//   onPaymentMethodChange: (method: 'cash' | 'mpesa' | 'bank') => void;
//   amountPaid: string;
//   onAmountPaidChange: (amount: string) => void;
//   notes: string;
//   onNotesChange: (notes: string) => void;
//   onProcessTransaction: () => void;
//   isProcessing: boolean;
// }

// export function InvoiceForm({
//   show,
//   onClose,
//   cart,
//   customerDetails,
//   onCustomerDetailsChange,
//   paymentMethod,
//   onPaymentMethodChange,
//   amountPaid,
//   onAmountPaidChange,
//   notes,
//   onNotesChange,
//   onProcessTransaction,
//   isProcessing
// }: InvoiceFormProps) {
//   const calculateTotal = () => {
//     return cart.reduce((total, item) => total + item.total, 0);
//   };

//   // const subtotal = calculateTotal();
//   // const taxAmount = subtotal * 0.16;
//   // const totalAmount = subtotal + taxAmount;


//   const subtotal = calculateTotal();
//   const taxAmount = subtotal;
//   const totalAmount = subtotal;

//   if (!show) return null;

//   return (
//     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//         <div className="p-6">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-xl font-bold text-slate-900">Complete Sale</h2>
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={onClose}
//               className="text-slate-500 hover:text-slate-700"
//             >
//               ✕
//             </Button>
//           </div>

//           <div className="space-y-6">
//             {/* Customer Details */}
//             <div className="space-y-4">
//               <h3 className="font-semibold text-slate-900">Customer Details</h3>
//               <div className="space-y-3">
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-1">
//                     Customer Name
//                   </label>
//                   <Input
//                     placeholder="Enter customer name (optional)"
//                     value={customerDetails.customer_name}
//                     onChange={(e) => onCustomerDetailsChange({ 
//                       ...customerDetails, 
//                       customer_name: e.target.value 
//                     })}
//                     className="w-full"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-1">
//                     Phone Number
//                   </label>
//                   <Input
//                     placeholder="Enter phone number (optional)"
//                     value={customerDetails.customer_phone}
//                     onChange={(e) => onCustomerDetailsChange({ 
//                       ...customerDetails, 
//                       customer_phone: e.target.value 
//                     })}
//                     className="w-full"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Payment Method */}
//             <div className="space-y-4">
//               <h3 className="font-semibold text-slate-900">Payment Method</h3>
//               <div className="grid grid-cols-3 gap-3">
//                 {[
//                   { value: 'cash', label: 'Cash', icon: '💵' },
//                   { value: 'mpesa', label: 'M-Pesa', icon: '📱' },
//                   { value: 'bank', label: 'Bank', icon: '🏦' }
//                 ].map((method) => (
//                   <button
//                     key={method.value}
//                     onClick={() => onPaymentMethodChange(method.value as 'cash' | 'mpesa' | 'bank')}
//                     className={`p-3 rounded-lg border-2 transition-all ${
//                       paymentMethod === method.value
//                         ? 'border-blue-500 bg-blue-50 text-blue-700'
//                         : 'border-slate-200 hover:border-slate-300'
//                     }`}
//                   >
//                     <div className="text-2xl mb-1">{method.icon}</div>
//                     <div className="text-sm font-medium">{method.label}</div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Amount Paid */}
//             <div className="space-y-4">
//               <h3 className="font-semibold text-slate-900">Payment Details</h3>
//               <div className="space-y-3">
//                 <div>
//                   <label className="block text-sm font-medium text-slate-700 mb-1">
//                     Amount Paid
//                   </label>
//                   <Input
//                     type="number"
//                     placeholder={`${totalAmount.toFixed(2)}`}
//                     value={amountPaid}
//                     onChange={(e) => onAmountPaidChange(e.target.value)}
//                     className="w-full"
//                   />
//                 </div>
//                 {parseFloat(amountPaid) > totalAmount && (
//                   <div className="text-sm text-green-600">
//                     Change: KSh {(parseFloat(amountPaid) - totalAmount).toFixed(2)}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Notes */}
//             <div className="space-y-4">
//               <h3 className="font-semibold text-slate-900">Notes</h3>
//               <textarea
//                 value={notes}
//                 onChange={(e) => onNotesChange(e.target.value)}
//                 className="w-full p-3 border border-slate-200 rounded-lg resize-none"
//                 rows={3}
//                 placeholder="Enter any additional notes..."
//               />
//             </div>

//             {/* Order Summary */}
//             <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
//               <h3 className="font-semibold text-slate-900">Order Summary</h3>
//               <div className="space-y-2 text-sm">
//                 <div className="flex justify-between">
//                   <span>Subtotal:</span>
//                   <span>KSh {subtotal.toFixed(2)}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Tax (NON-VAT):</span>
//                   {/* <span>KSh {taxAmount.toFixed(2)}</span> */}
//                   <span>KSh 0.00</span>
//                 </div>
//                 <div className="flex justify-between font-semibold text-lg">
//                   <span>Total:</span>
//                   <span>KSh {totalAmount.toFixed(2)}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex space-x-3">
//               <Button
//                 variant="outline"
//                 onClick={onClose}
//                 className="flex-1"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 onClick={onProcessTransaction}
//                 disabled={isProcessing}
//                 className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
//               >
//                 {isProcessing ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
//                     Creating Invoice...
//                   </>
//                 ) : (
//                   <>
//                     <Receipt className="h-4 w-4 mr-2" />
//                     Create Invoice
//                   </>
//                 )}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// } 



'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Receipt } from 'lucide-react';
import { CartItem, CustomerDetails } from '../types';

interface InvoiceFormProps {
  show: boolean;
  onClose: () => void;
  cart: CartItem[];
  customerDetails: CustomerDetails;
  onCustomerDetailsChange: (details: CustomerDetails) => void;
  paymentMethod: 'cash' | 'mpesa' | 'bank' | 'card' | 'mobile';
  onPaymentMethodChange: (method: 'cash' | 'mpesa' | 'bank' | 'card' | 'mobile') => void;
  amountPaid: string;
  onAmountPaidChange: (amount: string) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  onProcessTransaction: () => void;
  isProcessing: boolean;
}

export function InvoiceForm({
  show,
  onClose,
  cart,
  customerDetails,
  onCustomerDetailsChange,
  paymentMethod,
  onPaymentMethodChange,
  amountPaid,
  onAmountPaidChange,
  notes,
  onNotesChange,
  onProcessTransaction,
  isProcessing
}: InvoiceFormProps) {
  // Helper function to get numeric price
  const getItemPrice = (item: CartItem): number => {
    const price = item.custom_price || item.selling_price_per_piece;
    if (typeof price === 'string') {
      const parsed = parseFloat(price);
      return isNaN(parsed) ? 0 : parsed;
    }
    return typeof price === 'number' && !isNaN(price) ? price : 0;
  };

  const calculateTotal = (): number => {
    return cart.reduce((total, item) => {
      const price = getItemPrice(item);
      return total + (item.quantity * price);
    }, 0);
  };

  const subtotal = calculateTotal();
  const taxAmount = 0; // NON-VAT
  const totalAmount = subtotal + taxAmount;

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Complete Sale</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-500 hover:text-slate-700"
            >
              ✕
            </Button>
          </div>

          <div className="space-y-6">
            {/* Customer Details */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Customer Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Customer Name
                  </label>
                  <Input
                    placeholder="Enter customer name (optional)"
                    value={customerDetails.customer_name}
                    onChange={(e) => onCustomerDetailsChange({ 
                      ...customerDetails, 
                      customer_name: e.target.value 
                    })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <Input
                    placeholder="Enter phone number (optional)"
                    value={customerDetails.customer_phone}
                    onChange={(e) => onCustomerDetailsChange({ 
                      ...customerDetails, 
                      customer_phone: e.target.value 
                    })}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="Enter email (optional)"
                    value={customerDetails.customer_email || ''}
                    onChange={(e) => onCustomerDetailsChange({ 
                      ...customerDetails, 
                      customer_email: e.target.value 
                    })}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Payment Method</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'cash', label: 'Cash', icon: '💵' },
                  { value: 'card', label: 'Card', icon: '💳' },
                  { value: 'mobile', label: 'M-Pesa', icon: '📱' },
                  { value: 'bank', label: 'Bank', icon: '🏦' }
                ].map((method) => (
                  <button
                    key={method.value}
                    onClick={() => onPaymentMethodChange(method.value as 'cash' | 'mpesa' | 'bank' | 'card' | 'mobile')}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      paymentMethod === method.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-2xl mb-1">{method.icon}</div>
                    <div className="text-sm font-medium">{method.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Amount Paid */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Payment Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Amount Paid
                  </label>
                  <Input
                    type="number"
                    placeholder={`${totalAmount.toFixed(2)}`}
                    value={amountPaid}
                    onChange={(e) => onAmountPaidChange(e.target.value)}
                    className="w-full"
                    step="0.01"
                    min="0"
                  />
                </div>
                {parseFloat(amountPaid || '0') > totalAmount && (
                  <div className="text-sm text-green-600 font-medium">
                    Change: KSh {(parseFloat(amountPaid || '0') - totalAmount).toFixed(2)}
                  </div>
                )}
                {parseFloat(amountPaid || '0') < totalAmount && amountPaid && (
                  <div className="text-sm text-red-600 font-medium">
                    Remaining: KSh {(totalAmount - parseFloat(amountPaid || '0')).toFixed(2)}
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900">Notes</h3>
              <textarea
                value={notes}
                onChange={(e) => onNotesChange(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Enter any additional notes..."
              />
            </div>

            <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
              <h3 className="font-semibold text-slate-900">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Items ({cart.length}):</span>
                  <span>{cart.reduce((sum, item) => sum + item.quantity, 0)} pieces</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>KSh {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (VAT Exempt):</span>
                  <span>KSh {taxAmount.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-200 pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span className="text-blue-600">KSh {totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button
                onClick={onProcessTransaction}
                disabled={isProcessing || !amountPaid || parseFloat(amountPaid) < totalAmount}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    Creating Invoice...
                  </>
                ) : (
                  <>
                    <Receipt className="h-4 w-4 mr-2" />
                    Create Invoice
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}