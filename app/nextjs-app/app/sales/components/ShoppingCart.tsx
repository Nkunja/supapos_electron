// 'use client';

// import { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Separator } from '@/components/ui/separator';
// import { ShoppingCart, Plus, Minus, Trash2, Receipt, Edit3, Check, X } from 'lucide-react';
// import { CartItem } from '../types';
// import { toast } from 'react-toastify';

// interface CartComponentProps {
//   cart: CartItem[];
//   onUpdateQuantity: (id: number, change: number) => void;
//   onRemoveFromCart: (id: number) => void;
//   onUpdatePrice: (id: number, newPrice: number) => void; 
//   onProceedToCheckout: () => void;
//   isProcessing: boolean;
// }

// export function CartComponent({ 
//   cart, 
//   onUpdateQuantity, 
//   onRemoveFromCart, 
//   onUpdatePrice, // Add this prop
//   onProceedToCheckout,
//   isProcessing 
// }: CartComponentProps) {
//   const [editingPriceId, setEditingPriceId] = useState<number | null>(null);
//   const [tempPrice, setTempPrice] = useState<string>('');

//   const calculateTotal = () => {
//     return cart.reduce((total, item) => total + item.total, 0);
//   };

//   const handleStartPriceEdit = (item: CartItem) => {
//     setEditingPriceId(item.id);
//     const currentPrice = item.custom_price || parseFloat(item.selling_price_per_piece);
//     setTempPrice(currentPrice.toString());
//   };

//   const handleSavePriceEdit = (item: CartItem) => {
//     const newPrice = parseFloat(tempPrice);
//     const originalPrice = parseFloat(item.selling_price_per_piece);
    
//     // Validate: new price must be >= original price
//     if (newPrice >= originalPrice && newPrice > 0) {
//       onUpdatePrice(item.id, newPrice);
//       setEditingPriceId(null);
//       setTempPrice('');
//     } else {
//       // Show error or reset to original price
//       toast(`Price cannot be below the original price of KSh ${originalPrice.toFixed(2)}`);
//       setTempPrice(originalPrice.toString());
//     }
//   };

//   const handleCancelPriceEdit = () => {
//     setEditingPriceId(null);
//     setTempPrice('');
//   };

//   const getDisplayPrice = (item: CartItem) => {
//     return item.custom_price || parseFloat(item.selling_price_per_piece);
//   };

//   return (
//     <Card className="sticky top-24 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
//       <CardHeader className="pb-4">
//         <CardTitle className="flex items-center space-x-2 text-slate-900">
//           <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg">
//             <ShoppingCart className="h-5 w-5 text-white" />
//           </div>
//           <span>Cart ({cart.length})</span>
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         {cart.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="p-4 bg-slate-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
//               <ShoppingCart className="h-8 w-8 text-slate-400" />
//             </div>
//             <p className="text-slate-500 font-medium">Your cart is empty</p>
//             <p className="text-xs text-slate-400 mt-1">Add products to start selling</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <div className="max-h-60 overflow-y-auto space-y-3">
//               {cart.map((item) => (
//                 <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
//                   <div className="flex items-start justify-between mb-2">
//                     <div className="flex-1">
//                       <h4 className="font-semibold text-sm text-slate-900">{item.product_name}</h4>
                      
//                       {/* Price display and editing */}
//                       <div className="flex items-center space-x-2 mt-1">
//                         {editingPriceId === item.id ? (
//                           <div className="flex items-center space-x-1">
//                             <span className="text-xs text-slate-600">KSh</span>
//                             <Input
//                               type="number"
//                               value={tempPrice}
//                               onChange={(e) => setTempPrice(e.target.value)}
//                               className="h-6 w-20 text-xs p-1"
//                               min={parseFloat(item.selling_price_per_piece)}
//                               step="0.01"
//                             />
//                             <Button
//                               size="sm"
//                               variant="ghost"
//                               onClick={() => handleSavePriceEdit(item)}
//                               className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
//                             >
//                               <Check className="h-3 w-3" />
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant="ghost"
//                               onClick={handleCancelPriceEdit}
//                               className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
//                             >
//                               <X className="h-3 w-3" />
//                             </Button>
//                           </div>
//                         ) : (
//                           <div className="flex items-center space-x-1">
//                             <span className="text-xs text-slate-600">
//                               KSh {getDisplayPrice(item).toFixed(2)} each
//                             </span>
//                             {item.is_price_edited && (
//                               <span className="text-xs text-orange-600 font-medium">(Custom)</span>
//                             )}
//                             <Button
//                               size="sm"
//                               variant="ghost"
//                               onClick={() => handleStartPriceEdit(item)}
//                               className="h-5 w-5 p-0 text-slate-400 hover:text-slate-600"
//                             >
//                               <Edit3 className="h-3 w-3" />
//                             </Button>
//                           </div>
//                         )}
//                       </div>
                      
//                       {/* Show original price if custom price is set */}
//                       {item.is_price_edited && (
//                         <p className="text-xs text-slate-400 line-through">
//                           Original: KSh {parseFloat(item.selling_price_per_piece).toFixed(2)}
//                         </p>
//                       )}
//                     </div>
//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       onClick={() => onRemoveFromCart(item.id)}
//                       className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
//                     >
//                       <Trash2 className="h-3 w-3" />
//                     </Button>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-2">
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => onUpdateQuantity(item.id, -1)}
//                         disabled={item.quantity <= 1}
//                         className="h-7 w-7 p-0"
//                       >
//                         <Minus className="h-3 w-3" />
//                       </Button>
//                       <span className="w-8 text-center text-sm font-medium">
//                         {item.quantity}
//                       </span>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => onUpdateQuantity(item.id, 1)}
//                         disabled={item.quantity >= (item.total_units * item.pieces_per_unit)}
//                         className="h-7 w-7 p-0"
//                       >
//                         <Plus className="h-3 w-3" />
//                       </Button>
//                     </div>
//                     <span className="font-bold text-slate-900">
//                       KSh {item.total.toFixed(2)}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
            
//             <Separator />
            
//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <span className="font-semibold text-slate-700">Subtotal:</span>
//                 <span className="font-bold text-lg text-slate-900">
//                   KSh {calculateTotal().toFixed(2)}
//                 </span>
//               </div>
              
//               <div className="flex justify-between items-center">
//                 <span className="text-sm text-slate-600">Tax (NON-VAT):</span>
//                 <span className="text-sm font-medium text-slate-700">
//                   KSh 0.00
//                 </span>
//               </div>
              
//               <div className="flex justify-between items-center">
//                 <span className="font-semibold text-slate-700">Total:</span>
//                 <span className="font-bold text-xl text-slate-900">
//                   KSh {calculateTotal().toFixed(2)}
//                 </span>
//               </div>
              
//               <Button
//                 onClick={onProceedToCheckout}
//                 disabled={isProcessing}
//                 className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 font-semibold"
//               >
//                 <Receipt className="h-4 w-4 mr-2" />
//                 Proceed to Checkout
//               </Button>
//             </div>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }



// 'use client';

// import { useState } from 'react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Separator } from '@/components/ui/separator';
// import { ShoppingCart, Plus, Minus, Trash2, Receipt, Edit3, Check, X } from 'lucide-react';
// import { toast } from 'react-toastify';

// interface CartItem {
//   id: number;
//   quantity: number;
//   product_name: string;
//   selling_price_per_piece: string;
//   custom_price?: number;
//   is_price_edited: boolean;
//   total: number;
//   total_units: number;
//   pieces_per_unit: number;
// }

// interface CartComponentProps {
//   cart: CartItem[];
//   onUpdateQuantity: (id: number, change: number) => void;
//   onUpdatePrice: (id: number, newPrice: number) => void;
//   onRemoveFromCart: (id: number) => void;
//   onProceedToCheckout: () => void;
//   isProcessing: boolean;
// }

// export function CartComponent({ 
//   cart, 
//   onUpdateQuantity, 
//   onUpdatePrice, 
//   onRemoveFromCart, 
//   onProceedToCheckout, 
//   isProcessing 
// }: CartComponentProps) {
//   const [editingPriceId, setEditingPriceId] = useState<number | null>(null);
//   const [tempPrice, setTempPrice] = useState<string>('');

//   const calculateTotal = () => {
//     return cart.reduce((total, item) => total + item.total, 0);
//   };

//   const handleStartPriceEdit = (item: CartItem) => {
//     setEditingPriceId(item.id);
//     const currentPrice = item.custom_price || parseFloat(item.selling_price_per_piece);
//     setTempPrice(currentPrice.toString());
//   };

//   const handleSavePriceEdit = (item: CartItem) => {
//     const newPrice = parseFloat(tempPrice);
//     const originalPrice = parseFloat(item.selling_price_per_piece);
    
//     // Validate: new price must be >= original price
//     if (newPrice >= originalPrice && newPrice > 0) {
//       onUpdatePrice(item.id, newPrice);
//       setEditingPriceId(null);
//       setTempPrice('');
//     } else {
//       toast(`Price cannot be below the original price of KSh ${originalPrice.toFixed(2)}`);
//       setTempPrice(originalPrice.toString());
//     }
//   };

//   const handleCancelPriceEdit = () => {
//     setEditingPriceId(null);
//     setTempPrice('');
//   };

//   const getDisplayPrice = (item: CartItem) => {
//     return item.custom_price || parseFloat(item.selling_price_per_piece);
//   };

//   return (
//     <Card className="sticky top-24 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
//       <CardHeader className="pb-4">
//         <CardTitle className="flex items-center space-x-2 text-slate-900">
//           <div className="p-2 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg">
//             <ShoppingCart className="h-5 w-5 text-white" />
//           </div>
//           <span>Cart ({cart.length})</span>
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         {cart.length === 0 ? (
//           <div className="text-center py-12">
//             <div className="p-4 bg-slate-100 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
//               <ShoppingCart className="h-8 w-8 text-slate-400" />
//             </div>
//             <p className="text-slate-500 font-medium">Your cart is empty</p>
//             <p className="text-xs text-slate-400 mt-1">Add items to start selling</p>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             <div className="max-h-60 overflow-y-auto space-y-3">
//               {cart.map((item) => (
//                 <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200">
//                   <div className="flex items-start justify-between mb-2">
//                     <div className="flex-1">
//                       <h4 className="font-semibold text-sm text-slate-900">{item.product_name}</h4>
                      
//                       {/* Price display and editing */}
//                       <div className="flex items-center space-x-2 mt-1">
//                         {editingPriceId === item.id ? (
//                           <div className="flex items-center space-x-1">
//                             <span className="text-xs text-slate-600">KSh</span>
//                             <Input
//                               type="number"
//                               value={tempPrice}
//                               onChange={(e) => setTempPrice(e.target.value)}
//                               className="h-6 w-20 text-xs p-1"
//                               min={parseFloat(item.selling_price_per_piece)}
//                               step="0.01"
//                             />
//                             <Button
//                               size="sm"
//                               variant="ghost"
//                               onClick={() => handleSavePriceEdit(item)}
//                               className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
//                             >
//                               <Check className="h-3 w-3" />
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant="ghost"
//                               onClick={handleCancelPriceEdit}
//                               className="h-6 w-6 p-0 text-red-500 hover:text-red-600"
//                             >
//                               <X className="h-3 w-3" />
//                             </Button>
//                           </div>
//                         ) : (
//                           <div className="flex items-center space-x-1">
//                             <span className="text-xs text-slate-600">
//                               KSh {getDisplayPrice(item).toFixed(2)} each
//                             </span>
//                             {item.is_price_edited && (
//                               <span className="text-xs text-orange-600 font-medium">(Custom)</span>
//                             )}
//                             <Button
//                               size="sm"
//                               variant="ghost"
//                               onClick={() => handleStartPriceEdit(item)}
//                               className="h-5 w-5 p-0 text-slate-400 hover:text-slate-600"
//                             >
//                               <Edit3 className="h-3 w-3" />
//                             </Button>
//                           </div>
//                         )}
//                       </div>
                      
//                       {/* Show original price if custom price is set */}
//                       {item.is_price_edited && (
//                         <p className="text-xs text-slate-400 line-through">
//                           Original: KSh {parseFloat(item.selling_price_per_piece).toFixed(2)}
//                         </p>
//                       )}
//                     </div>
//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       onClick={() => onRemoveFromCart(item.id)}
//                       className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0"
//                     >
//                       <Trash2 className="h-3 w-3" />
//                     </Button>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center space-x-2">
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => onUpdateQuantity(item.id, -1)}
//                         disabled={item.quantity <= 1}
//                         className="h-7 w-7 p-0"
//                       >
//                         <Minus className="h-3 w-3" />
//                       </Button>
//                       <span className="w-8 text-center text-sm font-medium">
//                         {item.quantity}
//                       </span>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() => onUpdateQuantity(item.id, 1)}
//                         disabled={item.quantity >= (item.total_units * item.pieces_per_unit)}
//                         className="h-7 w-7 p-0"
//                       >
//                         <Plus className="h-3 w-3" />
//                       </Button>
//                     </div>
//                     <span className="font-bold text-slate-900">
//                       KSh {item.total.toFixed(2)}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
            
//             <Separator />
            
//             <div className="space-y-4">
//               <div className="flex justify-between items-center">
//                 <span className="font-semibold text-slate-700">Subtotal:</span>
//                 <span className="font-bold text-lg text-slate-900">
//                   KSh {calculateTotal().toFixed(2)}
//                 </span>
//               </div>
              
//               <div className="flex justify-between items-center">
//                 <span className="text-sm text-slate-600">Tax (NON-VAT):</span>
//                 <span className="text-sm font-medium text-slate-700">
//                   KSh 0.00
//                 </span>
//               </div>
              
//               <div className="flex justify-between items-center">
//                 <span className="font-semibold text-slate-700">Total:</span>
//                 <span className="font-bold text-xl text-slate-900">
//                   KSh {calculateTotal().toFixed(2)}
//                 </span>
//               </div>
              
//               <Button
//                 onClick={onProceedToCheckout}
//                 disabled={isProcessing}
//                 className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 font-semibold"
//               >
//                 <Receipt className="h-4 w-4 mr-2" />
//                 Proceed to Checkout
//               </Button>
//             </div>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }


'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Plus, Minus, Trash2, Receipt, Edit3, Check, X, CreditCard, Banknote, DollarSign } from 'lucide-react';
import { toast } from 'react-toastify';
import { CartItem } from '../types';

interface CartComponentProps {
  cart: CartItem[];
  onUpdateQuantity: (id: number, change: number) => void;
  onUpdatePrice: (id: number, newPrice: number) => void;
  onRemoveFromCart: (id: number) => void;
  onProceedToCheckout: () => void;
  isProcessing: boolean;
}

export function CartComponent({ 
  cart, 
  onUpdateQuantity, 
  onUpdatePrice, 
  onRemoveFromCart, 
  onProceedToCheckout, 
  isProcessing 
}: CartComponentProps) {
  const [editingPriceId, setEditingPriceId] = useState<number | null>(null);
  const [tempPrice, setTempPrice] = useState<string>('');

  const getDisplayPrice = (item: CartItem): number => {
    if (item.custom_price !== undefined && item.custom_price !== null) {
      const customPrice = item.custom_price;
      if (typeof customPrice === 'number') {
        return customPrice;
      }
      const parsed = parseFloat(String(customPrice));
      return isNaN(parsed) ? 0 : parsed;
    }
    
    const originalPrice = item.selling_price_per_piece;
    if (typeof originalPrice === 'string') {
      const parsed = parseFloat(originalPrice);
      return isNaN(parsed) ? 0 : parsed;
    }
    
    return typeof originalPrice === 'number' && !isNaN(originalPrice) ? originalPrice : 0;
  };

  const getOriginalPrice = (item: CartItem): number => {
    const originalPrice = item.selling_price_per_piece;
    if (typeof originalPrice === 'string') {
      const parsed = parseFloat(originalPrice);
      return isNaN(parsed) ? 0 : parsed;
    }
    return typeof originalPrice === 'number' && !isNaN(originalPrice) ? originalPrice : 0;
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => {
      return total + item.quantity * getDisplayPrice(item);
    }, 0);
  };

  const handleStartPriceEdit = (item: CartItem) => {
    setEditingPriceId(item.id);
    const currentPrice = getDisplayPrice(item);
    setTempPrice(currentPrice.toString());
  };

  const handleSavePriceEdit = (item: CartItem) => {
    const newPrice = parseFloat(tempPrice);
    const originalPrice = getOriginalPrice(item);
    
    if (isNaN(newPrice) || newPrice <= 0) {
      toast.error('Price must be a valid positive number');
      setTempPrice(getDisplayPrice(item).toString());
      return;
    }
    
    if (newPrice < originalPrice) {
      toast.error(`Price cannot be less than original price of KSh ${originalPrice.toFixed(2)}`);
      setTempPrice(getDisplayPrice(item).toString());
      return;
    }
    
    onUpdatePrice(item.id, newPrice);
    setEditingPriceId(null);
    setTempPrice('');
  };

  const handleCancelPriceEdit = () => {
    setEditingPriceId(null);
    setTempPrice('');
  };

  const getMaxQuantity = (item: CartItem): number => {
    return item.total_pieces || (item.total_units * item.pieces_per_unit);
  };

  if (cart.length === 0) {
    return (
      <div className="h-[550px] flex flex-col items-center justify-center bg-white rounded-xl p-8">
        <div className="p-6 bg-slate-100 rounded-full w-20 h-20 flex items-center justify-center mb-4">
          <ShoppingCart className="h-10 w-10 text-slate-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">Cart Empty</h3>
        <p className="text-slate-500 text-center mb-4">Scan or select items to start a new sale</p>
        <div className="w-full bg-slate-100 rounded-lg p-4 font-mono text-center">
          <div className="text-slate-400 text-sm">Ready to scan...</div>
          <div className="text-2xl font-bold text-slate-600 mt-2">KSh 0.00</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[600px] flex flex-col bg-white rounded-xl overflow-hidden">
      <div className="bg-slate-50 p-2 border-b border-slate-300 flex-shrink-0">
        <div className="text-center font-mono">
          <div className="text-xs text-slate-600">TRANSACTION RECEIPT</div>
          <div className="text-xs text-slate-400">
            {new Date().toLocaleString()}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
        {cart.map((item) => {
          const displayPrice = getDisplayPrice(item);
          const originalPrice = getOriginalPrice(item);
          const maxQuantity = getMaxQuantity(item);
          const lineTotal = item.quantity * displayPrice;
          
          return (
            <div key={item.id} className="bg-slate-50 rounded-md p-2 border border-slate-200">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-slate-900 text-xs leading-tight flex-1 pr-2">
                  {item.product_name}
                </h4>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemoveFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-5 w-5 p-0"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>

              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-1">
                  {editingPriceId === item.id ? (
                    <div className="flex items-center space-x-1">
                      <span className="text-xs font-mono">KSh</span>
                      <Input
                        type="number"
                        value={tempPrice}
                        onChange={(e) => setTempPrice(e.target.value)}
                        className="h-5 w-16 text-xs p-1 font-mono"
                        min={originalPrice}
                        step="0.01"
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSavePriceEdit(item)}
                        className="h-4 w-4 p-0 text-green-600"
                      >
                        <Check className="h-2 w-2" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleCancelPriceEdit}
                        className="h-4 w-4 p-0 text-red-500"
                      >
                        <X className="h-2 w-2" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-1">
                      <span className="text-xs font-mono text-slate-600">
                        KSh {displayPrice.toFixed(2)}
                      </span>
                      {item.is_price_edited && (
                        <span className="text-xs text-orange-600 font-bold">(CUSTOM)</span>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleStartPriceEdit(item)}
                        className="h-3 w-3 p-0 text-slate-400 hover:text-slate-600"
                      >
                        <Edit3 className="h-2 w-2" />
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Line Total */}
                <div className="text-xs font-bold text-slate-900 font-mono">
                  KSh {lineTotal.toFixed(2)}
                </div>
              </div>

              {/* Quantity Controls Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    disabled={item.quantity <= 1}
                    className="h-5 w-5 p-0 bg-red-50 border-red-200 hover:bg-red-100"
                  >
                    <Minus className="h-2 w-2 text-red-600" />
                  </Button>
                  <div className="w-6 text-center">
                    <span className="text-xs font-bold">{item.quantity}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    disabled={item.quantity >= maxQuantity}
                    className="h-5 w-5 p-0 bg-green-50 border-green-200 hover:bg-green-100"
                  >
                    <Plus className="h-2 w-2 text-green-600" />
                  </Button>
                </div>
 
                <div className="text-xs text-slate-500">
                  Stock: {maxQuantity}
                </div>
              </div>

              {item.is_price_edited && displayPrice !== originalPrice && (
                <div className="text-xs text-slate-400 line-through font-mono mt-1">
                  Was: KSh {originalPrice.toFixed(2)}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="bg-slate-50 p-3 border-t border-slate-300 flex-shrink-0">
        <div className="space-y-1 font-mono">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-600">SUBTOTAL:</span>
            <span className="font-semibold">KSh {calculateTotal().toFixed(2)}</span>
          </div>
   
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-600">TAX (NON-VAT):</span>
            <span>KSh 0.00</span>
          </div>
          
          <Separator className="border-dashed my-1" />

          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-slate-900">TOTAL:</span>
            <span className="text-lg font-bold text-slate-900">
              KSh {calculateTotal().toFixed(2)}
            </span>
          </div>
        </div>

        <Button
          onClick={onProceedToCheckout}
          disabled={isProcessing}
          className="w-full h-10 mt-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 font-bold text-sm shadow-lg"
        >
          {isProcessing ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></div>
              <span>Processing...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Receipt className="h-4 w-4" />
              <span>CHECKOUT - KSh {calculateTotal().toFixed(2)}</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  );
}