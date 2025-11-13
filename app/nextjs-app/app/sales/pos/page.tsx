// 'use client';

// import { useState, useEffect } from 'react';
// import { Alert, AlertDescription } from '@/components/ui/alert';
// import { AlertTriangle, ShoppingCart } from 'lucide-react';
// import { toast } from 'react-toastify';

// // Import components
// import { InvoiceForm } from '../components/InvoiceForm';
// import { ThermalInvoicePreview } from '../components/ThermalInvoicePreview';
// import { SalesTab } from '../components/SalesTab';

// // Import types
// import { 
//   Product, 
//   CartItem, 
//   SalesStats, 
//   CustomerDetails, 
//   InvoiceData, 
//   Invoice
// } from '../types';

// // Import centralized API functions
// import { 
//   getSalesStats, 
//   getRecentInvoices, 
//   createSalesInvoice 
// } from '@/app/api/sales';

// export default function SalesPage() {
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [salesStats, setSalesStats] = useState<SalesStats | null>(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [stockError, setStockError] = useState('');
//   const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
//     customer_name: '',
//     customer_phone: ''
//   });
//   const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mpesa' | 'bank'>('cash');
//   const [amountPaid, setAmountPaid] = useState('');
//   const [notes, setNotes] = useState('Your Wellness is Our Mission');
//   const [showInvoiceForm, setShowInvoiceForm] = useState(false);
//   const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

//   useEffect(() => {
//     const loadSalesStats = async () => {
//       try {
//         const data = await getSalesStats('30');
//         setSalesStats(data);
//       } catch (error) {
//         console.error('Error loading sales stats:', error);
//         toast.error('Failed to load sales statistics');
//         setSalesStats({
//           shop: { id: 1, name: "Business" },
//           period_days: 30,
//           summary: {
//             total_sales: 0,
//             total_invoices: 0,
//             total_items_sold: 0,
//             average_invoice_value: 0
//           },
//           top_products: []
//         });
//       }
//     };

//     loadSalesStats();
//   }, []);

//   const getAvailableStock = (productId: number, product: Product) => {
//     const cartItem = cart.find(item => item.id === productId);
//     const total_pieces = (product.total_units * product.pieces_per_unit) + (product.partial_pieces || 0);
//     return total_pieces - (cartItem ? cartItem.quantity : 0);
//   };

//   // NEW: Function to handle dynamic pricing
//   const updateItemPrice = (id: number, newPrice: number) => {
//     setCart(prevCart => {
//       return prevCart.map(item => {
//         if (item.id === id) {
//           const originalPrice = parseFloat(item.selling_price_per_piece);
//           const isCustomPrice = newPrice !== originalPrice;
          
//           return {
//             ...item,
//             custom_price: isCustomPrice ? newPrice : undefined,
//             is_price_edited: isCustomPrice,
//             total: newPrice * item.quantity
//           };
//         }
//         return item;
//       });
//     });
//   };

//   // UPDATED: addToCart function to handle custom pricing and partial_pieces
//   const addToCart = (product: Product) => {
//     const total_pieces = (product.total_units * product.pieces_per_unit) + (product.partial_pieces || 0);
//     const availableStock = getAvailableStock(product.id, product);
    
//     if (availableStock <= 0) {
//       setStockError(`${product.product_name} is out of stock`);
//       toast.error(`${product.product_name} is out of stock`);
//       setTimeout(() => setStockError(''), 3000);
//       return;
//     }

//     const existingItem = cart.find(item => item.id === product.id);
    
//     if (existingItem) {
//       if (existingItem.quantity < total_pieces) {
//         setCart(cart.map(item =>
//           item.id === product.id
//             ? { 
//                 ...item, 
//                 quantity: item.quantity + 1, 
//                 total: (item.quantity + 1) * (item.custom_price || parseFloat(item.selling_price_per_piece))
//               }
//             : item
//         ));
//         toast.success(`Added ${product.product_name} to cart`);
//       } else {
//         setStockError(`Only ${total_pieces} pieces available for ${product.product_name}`);
//         toast.warning(`Only ${total_pieces} pieces available for ${product.product_name}`);
//         setTimeout(() => setStockError(''), 3000);
//       }
//     } else {
//       const newItem: CartItem = {
//         ...product,
//         quantity: 1,
//         total: parseFloat(product.selling_price_per_piece),
//         custom_price: undefined,
//         is_price_edited: false
//       };
//       setCart([...cart, newItem]);
//       toast.success(`Added ${product.product_name} to cart`);
//     }
//   };

//   // UPDATED: updateQuantity function to work with custom pricing and partial_pieces
//   const updateQuantity = (id: number, change: number) => {
//     const product = cart.find(p => p.id === id);
//     if (!product) return;

//     setCart(prevCart => {
//       return prevCart.map(item => {
//         if (item.id === id) {
//           const newQuantity = Math.max(0, item.quantity + change);
//           const total_pieces = (item.total_units * item.pieces_per_unit) + (item.partial_pieces || 0);
          
//           if (newQuantity > total_pieces) {
//             setStockError(`Only ${total_pieces} pieces available for ${item.product_name}`);
//             toast.warning(`Only ${total_pieces} pieces available for ${item.product_name}`);
//             setTimeout(() => setStockError(''), 3000);
//             return item;
//           }
          
//           if (newQuantity === 0) return null;
          
//           // Use custom price if set, otherwise use original selling price
//           const pricePerPiece = item.custom_price || parseFloat(item.selling_price_per_piece);
//           return { 
//             ...item, 
//             quantity: newQuantity, 
//             total: newQuantity * pricePerPiece 
//           };
//         }
//         return item;
//       }).filter(Boolean) as CartItem[];
//     });
//   };

//   const removeFromCart = (id: number) => {
//     const item = cart.find(item => item.id === id);
//     setCart(cart.filter(item => item.id !== id));
//     if (item) {
//       toast.info(`Removed ${item.product_name} from cart`);
//     }
//   };

//   const calculateTotal = () => {
//     return cart.reduce((total, item) => total + item.total, 0);
//   };

//   // UPDATED: processTransaction function to use custom prices in invoice (no changes needed for partial_pieces here)
//   const processTransaction = async () => {
//     if (cart.length === 0) {
//       toast.error('Cart is empty');
//       return;
//     }
    
//     setIsProcessing(true);
    
//     try {
//       const subtotal = calculateTotal();
//       const taxAmount = 0.00;
//       const discountAmount = 0;
//       const totalAmount = subtotal + taxAmount - discountAmount;
//       const amountPaidValue = parseFloat(amountPaid) || totalAmount;
//       const changeAmount = amountPaidValue - totalAmount;

//       const invoiceData: InvoiceData = {
//         shop: cart.length > 0 ? cart[0].shop : 1,
//         customer_name: customerDetails.customer_name || 'Walk-in Customer',
//         customer_phone: customerDetails.customer_phone || '',
//         payment_method: paymentMethod,
//         status: 'completed',
//         subtotal: subtotal.toFixed(2),
//         tax_amount: taxAmount.toFixed(2),
//         discount_amount: discountAmount.toFixed(2),
//         total_amount: totalAmount.toFixed(2),
//         amount_paid: amountPaidValue.toFixed(2),
//         change_amount: changeAmount.toFixed(2),
//         notes: notes,
//         items: cart.map(item => ({
//           inventory: item.id,
//           quantity: item.quantity,
//           // Use custom price if set, otherwise use original selling price
//           unit_price: (item.custom_price || parseFloat(item.selling_price_per_piece)).toString()
//         }))
//       };

//       const data = await createSalesInvoice(invoiceData);

//       try {
//         setSelectedInvoice(data.invoice);
//         toast.success('Invoice created successfully! Invoice preview is now open for printing.');
//       } catch (error) {
//         console.error('Error setting invoice preview:', error);
//         toast.error('Invoice created but preview failed to load');
//       }
      
//       // Reset form
//       setCart([]);
//       setCustomerDetails({ customer_name: '', customer_phone: '' });
//       setAmountPaid('');
//       setPaymentMethod('cash');
//       setNotes('Your Wellness is Our Mission');
//       setShowInvoiceForm(false);
      
//       // Refresh sales stats
//       try {
//         const statsData = await getSalesStats('30');
//         setSalesStats(statsData);
//       } catch (error) {
//         console.error('Error refreshing sales stats:', error);
//       }
//     } catch (error) {
//       console.error('Error creating invoice:', error);
//       toast.error('Failed to create invoice. Please try again.');
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleCloseInvoicePreview = () => {
//     setSelectedInvoice(null);
//   };

//   const handlePrintInvoice = (invoice: Invoice) => {
//     console.log('Print invoice:', invoice);
//   };

//   const handleDownloadInvoice = (invoice: Invoice) => {
//     console.log('Download invoice:', invoice);
//     toast.info('Download functionality coming soon');
//   };

//   return (
//     <div className="space-y-6">

//       {stockError && (
//         <Alert variant="destructive">
//           <AlertTriangle className="h-4 w-4" />
//           <AlertDescription>{stockError}</AlertDescription>
//         </Alert>
//       )}

//       {/* Sales Interface - Full Page */}
//       <SalesTab
//         cart={cart}
//         onAddToCart={addToCart}
//         onUpdateQuantity={updateQuantity}
//         onUpdatePrice={updateItemPrice} // NEW: Pass the price update function
//         onRemoveFromCart={removeFromCart}
//         onProceedToCheckout={() => setShowInvoiceForm(true)}
//         isProcessing={isProcessing}
//         getAvailableStock={getAvailableStock}
//       />

//       {/* Invoice Form Modal */}
//       <InvoiceForm
//         show={showInvoiceForm}
//         onClose={() => setShowInvoiceForm(false)}
//         cart={cart}
//         customerDetails={customerDetails}
//         onCustomerDetailsChange={setCustomerDetails}
//         paymentMethod={paymentMethod}
//         onPaymentMethodChange={setPaymentMethod}
//         amountPaid={amountPaid}
//         onAmountPaidChange={setAmountPaid}
//         notes={notes}
//         onNotesChange={setNotes}
//         onProcessTransaction={processTransaction}
//         isProcessing={isProcessing}
//       />

//       <ThermalInvoicePreview
//         invoice={selectedInvoice}
//         onClose={handleCloseInvoicePreview}
//         onDownload={handleDownloadInvoice}
//         onPrint={handlePrintInvoice}
//       />
//     </div>
//   );
// }


'use client';

import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle, ShoppingCart } from 'lucide-react';
import { toast } from 'react-toastify';

import { InvoiceForm } from '../components/InvoiceForm';
import { ThermalInvoicePreview } from '../components/ThermalInvoicePreview';
import { SalesTab } from '../components/SalesTab';

import { 
  CartItem, 
  SalesStats, 
  CustomerDetails, 
  InvoiceData, 
  Invoice
} from '../types';
import { Inventory } from '@/types/inventory/inventory';

import { 
  getSalesStats, 
  getRecentInvoices, 
  createSalesInvoice 
} from '@/app/api/sales';

export default function SalesPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [salesStats, setSalesStats] = useState<SalesStats | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stockError, setStockError] = useState('');
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    customer_name: '',
    customer_phone: '',
    customer_email: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'mpesa' | 'bank' | 'card' | 'mobile'>('cash');
  const [amountPaid, setAmountPaid] = useState('');
  const [notes, setNotes] = useState('Thank You For Shopping with us!');
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const loadSalesStats = async () => {
      try {
        const data = await getSalesStats('30');
        setSalesStats(data);
      } catch (error) {
        console.error('Error loading sales stats:', error);
        toast.error('Failed to load sales statistics');
        setSalesStats({
          shop: { id: 1, name: "Business" },
          period_days: 30,
          summary: {
            total_sales: 0,
            total_invoices: 0,
            total_items_sold: 0,
            average_invoice_value: 0
          },
          top_products: []
        });
      }
    };

    loadSalesStats();
  }, []);

  const getAvailableStock = (productId: number, product: Inventory): number => {
    const cartItem = cart.find(item => item.id === productId);
    const total_pieces = product.total_pieces || (product.total_units * product.pieces_per_unit);
    return total_pieces - (cartItem ? cartItem.quantity : 0);
  };

  // Function to handle dynamic pricing
  const updateItemPrice = (id: number, newPrice: number) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === id) {
          const originalPrice = item.selling_price_per_piece;
          const isCustomPrice = newPrice !== originalPrice;
          
          return {
            ...item,
            custom_price: isCustomPrice ? newPrice : undefined,
            is_price_edited: isCustomPrice,
            line_total: newPrice * item.quantity
          };
        }
        return item;
      });
    });
  };

  // addToCart function to handle custom pricing and inventory
  const addToCart = (product: Inventory) => {
    const total_pieces = product.total_pieces || (product.total_units * product.pieces_per_unit);
    const availableStock = getAvailableStock(product.id, product);
    
    if (availableStock <= 0) {
      setStockError(`${product.product_name} is out of stock`);
      toast.error(`${product.product_name} is out of stock`);
      setTimeout(() => setStockError(''), 3000);
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      if (existingItem.quantity < total_pieces) {
        setCart(cart.map(item =>
          item.id === product.id
            ? { 
                ...item, 
                quantity: item.quantity + 1, 
                line_total: (item.quantity + 1) * (item.custom_price || item.selling_price_per_piece)
              }
            : item
        ));
      } else {
        setStockError(`Only ${total_pieces} pieces available for ${product.product_name}`);
        toast.warning(`Only ${total_pieces} pieces available for ${product.product_name}`);
        setTimeout(() => setStockError(''), 3000);
      }
    } else {
      const newItem: CartItem = {
        ...product,
        quantity: 1,
        line_total: product.selling_price_per_piece,
        custom_price: undefined,
        is_price_edited: false
      };
      setCart([...cart, newItem]);
      toast.success(`Added ${product.product_name} to cart`);
    }
  };

  // updateQuantity function to work with custom pricing and inventory
  const updateQuantity = (id: number, change: number) => {
    const product = cart.find(p => p.id === id);
    if (!product) return;

    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(0, item.quantity + change);
          const total_pieces = item.total_pieces || (item.total_units * item.pieces_per_unit);
          
          if (newQuantity > total_pieces) {
            setStockError(`Only ${total_pieces} pieces available for ${item.product_name}`);
            toast.warning(`Only ${total_pieces} pieces available for ${item.product_name}`);
            setTimeout(() => setStockError(''), 3000);
            return item;
          }
          
          if (newQuantity === 0) return null;
          
          // Use custom price if set, otherwise use original selling price
          const pricePerPiece = item.custom_price || item.selling_price_per_piece;
          return { 
            ...item, 
            quantity: newQuantity, 
            line_total: newQuantity * pricePerPiece 
          };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (id: number) => {
    const item = cart.find(item => item.id === id);
    setCart(cart.filter(item => item.id !== id));
    if (item) {
      toast.info(`Removed ${item.product_name} from cart`);
    }
  };

  const calculateTotal = (): number => {
    return cart.reduce((total, item) => {
      const price = item.custom_price || item.selling_price_per_piece;
      return total + (item.quantity * price);
    }, 0);
  };

  // processTransaction function to use custom prices in invoice
  const processTransaction = async () => {
    if (cart.length === 0) {
      toast.error('Cart is empty');
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const subtotal = calculateTotal();
      const taxAmount = 0.00;
      const discountAmount = 0;
      const totalAmount = subtotal + taxAmount - discountAmount;
      const amountPaidValue = parseFloat(amountPaid) || totalAmount;
      const changeAmount = amountPaidValue - totalAmount;

      const invoiceData: InvoiceData = {
        shop: cart.length > 0 ? cart[0].shop : 1,
        customer_name: customerDetails.customer_name || 'Walk-in Customer',
        customer_phone: customerDetails.customer_phone || '',
        customer_email: customerDetails.customer_email || '',
        payment_method: paymentMethod,
        status: 'completed',
        subtotal: subtotal.toFixed(2),
        tax_amount: taxAmount.toFixed(2),
        discount_amount: discountAmount.toFixed(2),
        discount_type: 'fixed',
        total_amount: totalAmount.toFixed(2),
        amount_paid: amountPaidValue.toFixed(2),
        change_amount: changeAmount.toFixed(2),
        notes: notes,
        items: cart.map(item => ({
          inventory: item.id,
          quantity: item.quantity,
          unit_price: (item.custom_price || item.selling_price_per_piece).toString(),
          line_total: (item.quantity * (item.custom_price || item.selling_price_per_piece)).toFixed(2),
          custom_price: item.custom_price
        }))
      };

      const data = await createSalesInvoice(invoiceData);

      try {
        setSelectedInvoice(data.invoice);
        toast.success('Invoice created successfully! Invoice preview is now open for printing.');
      } catch (error) {
        console.error('Error setting invoice preview:', error);
        toast.error('Invoice created but preview failed to load');
      }
      
      // Reset form
      setCart([]);
      setCustomerDetails({ 
        customer_name: '', 
        customer_phone: '',
        customer_email: ''
      });
      setAmountPaid('');
      setPaymentMethod('cash');
      setNotes('Thank you for shopping with us');
      setShowInvoiceForm(false);
      
      // Refresh sales stats
      try {
        const statsData = await getSalesStats('30');
        setSalesStats(statsData);
      } catch (error) {
        console.error('Error refreshing sales stats:', error);
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast.error('Failed to create invoice. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseInvoicePreview = () => {
    setSelectedInvoice(null);
  };

  const handlePrintInvoice = (invoice: Invoice) => {
    console.log('Print invoice:', invoice);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    console.log('Download invoice:', invoice);
    toast.info('Download functionality coming soon');
  };

  return (
    <div className="space-y-6">

      {stockError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{stockError}</AlertDescription>
        </Alert>
      )}

      {/* Sales Interface - Full Page */}
      <SalesTab
        cart={cart}
        onAddToCart={addToCart}
        onUpdateQuantity={updateQuantity}
        onUpdatePrice={updateItemPrice}
        onRemoveFromCart={removeFromCart}
        onProceedToCheckout={() => setShowInvoiceForm(true)}
        isProcessing={isProcessing}
        getAvailableStock={getAvailableStock}
      />

      
      <InvoiceForm
        show={showInvoiceForm}
        onClose={() => setShowInvoiceForm(false)}
        cart={cart}
        customerDetails={customerDetails}
        onCustomerDetailsChange={setCustomerDetails}
        paymentMethod={paymentMethod}
        onPaymentMethodChange={setPaymentMethod}
        amountPaid={amountPaid}
        onAmountPaidChange={setAmountPaid}
        notes={notes}
        onNotesChange={setNotes}
        onProcessTransaction={processTransaction}
        isProcessing={isProcessing}
      />

      <ThermalInvoicePreview
        invoice={selectedInvoice}
        onClose={handleCloseInvoicePreview}
        onDownload={handleDownloadInvoice}
        onPrint={handlePrintInvoice}
      />
    </div>
  );
}