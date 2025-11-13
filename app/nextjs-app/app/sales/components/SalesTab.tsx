// 'use client';

// import { ProductCatalog } from './ProductCatalog';
// import { CartComponent } from './ShoppingCart';
// import { Product, CartItem } from '../types';

// interface SalesTabProps {
//   cart: CartItem[];
//   onAddToCart: (product: Product) => void;
//   onUpdateQuantity: (id: number, change: number) => void;
//   onUpdatePrice: (id: number, newPrice: number) => void;
//   onRemoveFromCart: (id: number) => void;
//   onProceedToCheckout: () => void;
//   isProcessing: boolean;
//   getAvailableStock: (productId: number, product: Product) => number;
// }

// export function SalesTab({
//   cart,
//   onAddToCart,
//   onUpdateQuantity,
//   onUpdatePrice,
//   onRemoveFromCart,
//   onProceedToCheckout,
//   isProcessing,
//   getAvailableStock
// }: SalesTabProps) {
//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//       {/* Product Search & List */}
//       <div className="lg:col-span-2">
//         <ProductCatalog
//           cart={cart}
//           onAddToCart={onAddToCart}
//           onUpdateQuantity={onUpdateQuantity}
//           onRemoveFromCart={onRemoveFromCart}
//           getAvailableStock={getAvailableStock}
//         />
//       </div>

//       {/* Shopping Cart */}
//       <div className="lg:col-span-1">
//         <CartComponent
//           cart={cart}
//           onUpdateQuantity={onUpdateQuantity}
//           onUpdatePrice={onUpdatePrice}
//           onRemoveFromCart={onRemoveFromCart}
//           onProceedToCheckout={onProceedToCheckout}
//           isProcessing={isProcessing}
//         />
//       </div>
//     </div>
//   );
// } 

// 'use client';

// import { ProductCatalog } from './ProductCatalog';
// import { CartComponent } from './ShoppingCart';
// import { CartItem } from '../types';
// import { Inventory } from '@/types/inventory/inventory';

// interface SalesTabProps {
//   cart: CartItem[];
//   onAddToCart: (product: Inventory) => void;
//   onUpdateQuantity: (id: number, change: number) => void;
//   onUpdatePrice: (id: number, newPrice: number) => void;
//   onRemoveFromCart: (id: number) => void;
//   onProceedToCheckout: () => void;
//   isProcessing: boolean;
//   getAvailableStock: (productId: number, product: Inventory) => number;
// }

// export function SalesTab({
//   cart,
//   onAddToCart,
//   onUpdateQuantity,
//   onUpdatePrice,
//   onRemoveFromCart,
//   onProceedToCheckout,
//   isProcessing,
//   getAvailableStock
// }: SalesTabProps) {
//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//       <div className="lg:col-span-2">
//         <ProductCatalog
//           cart={cart}
//           onAddToCart={onAddToCart}
//           onUpdateQuantity={onUpdateQuantity}
//           onRemoveFromCart={onRemoveFromCart}
//           getAvailableStock={getAvailableStock}
//         />
//       </div>


//       <div className="lg:col-span-1">
//         <CartComponent
//           cart={cart}
//           onUpdateQuantity={onUpdateQuantity}
//           onUpdatePrice={onUpdatePrice}
//           onRemoveFromCart={onRemoveFromCart}
//           onProceedToCheckout={onProceedToCheckout}
//           isProcessing={isProcessing}
//         />
//       </div>
//     </div>
//   );
// }



'use client';

import { useState } from 'react';
import { ProductCatalog } from './ProductCatalog';
import { CartComponent } from './ShoppingCart';
import { CartItem } from '../types';
import { Inventory } from '@/types/inventory/inventory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 

  Clock, 
  User, 
  ShoppingCart, 
  Package, 
  DollarSign,
  Zap,
  Grid3X3,
  List,
  Search,
  Calendar,
  Store,
  ScanBarcode
} from 'lucide-react';

interface SalesTabProps {
  cart: CartItem[];
  onAddToCart: (product: Inventory) => void;
  onUpdateQuantity: (id: number, change: number) => void;
  onUpdatePrice: (id: number, newPrice: number) => void;
  onRemoveFromCart: (id: number) => void;
  onProceedToCheckout: () => void;
  isProcessing: boolean;
  getAvailableStock: (productId: number, product: Inventory) => number;
}

export function SalesTab({
  cart,
  onAddToCart,
  onUpdateQuantity,
  onUpdatePrice,
  onRemoveFromCart,
  onProceedToCheckout,
  isProcessing,
  getAvailableStock
}: SalesTabProps) {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentTime, setCurrentTime] = useState(new Date());


  useState(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  });


  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = cart.reduce((total, item) => {
    const price = item.custom_price || (typeof item.selling_price_per_piece === 'string' 
      ? parseFloat(item.selling_price_per_piece) 
      : item.selling_price_per_piece);
    return total + (item.quantity * price);
  }, 0);

  return (
    <div className="min-h-screen">
      <div className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
          
            <div className="flex items-center space-x-6">
        
              
              <div className="flex items-center space-x-2 text-black">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-mono">
                  {currentTime.toLocaleTimeString()}
                </span>
                <span className="text-xs text-slate-500">
                  {currentTime.toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 bg-slate-100 px-3 py-2 rounded-lg">
                <ShoppingCart className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-black">{totalItems} items</span>
              </div>
              <div className="flex items-center space-x-2 bg-slate-100 px-3 py-2 rounded-lg">
                <DollarSign className="h-4 w-4 text-green-600" />
                <span className="text-sm text-black">KSh {totalValue.toFixed(2)}</span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="bg-slate-100 border-slate-300 text-black hover:bg-slate-200"
              >
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
              </Button>
              
              <div className="flex items-center space-x-2 bg-slate-100 px-3 py-2 rounded-lg">
                <User className="h-4 w-4 text-slate-600" />
                <span className="text-sm text-black">Cashier</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-140px)]">

        <div className="flex-1 p-6">
          <div className="h-full">

            <ProductCatalog
              cart={cart}
              onAddToCart={onAddToCart}
              onUpdateQuantity={onUpdateQuantity}
              onRemoveFromCart={onRemoveFromCart}
              getAvailableStock={getAvailableStock}
            />
          </div>
        </div>

  
        <div className="w-96 p-2 border-l border-slate-200">
          <div className="min-h-screen">
            <CartComponent
              cart={cart}
              onUpdateQuantity={onUpdateQuantity}
              onUpdatePrice={onUpdatePrice}
              onRemoveFromCart={onRemoveFromCart}
              onProceedToCheckout={onProceedToCheckout}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      </div>
    </div>
  );
}