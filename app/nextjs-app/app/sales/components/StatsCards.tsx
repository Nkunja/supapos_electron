// 'use client';

// import { Card, CardContent } from '@/components/ui/card';
// import { 
//   DollarSign, 
//   Activity, 
//   TrendingUp, 
//   AlertTriangle 
// } from 'lucide-react';
// import { SalesStats } from '../types';

// interface StatsCardsProps {
//   salesStats: SalesStats | null;
// }

// export function StatsCards({ salesStats }: StatsCardsProps) {
//   if (!salesStats) return null;

//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//       <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
//         <CardContent className="p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-green-100 text-sm font-medium">Total Sales</p>
//               <p className="text-2xl font-bold">
//                 KSh {salesStats.summary.total_sales.toLocaleString()}
//               </p>
//               <p className="text-green-100 text-xs">
//                 Last {salesStats.period_days} days
//               </p>
//             </div>
//             <div className="p-3 bg-white/20 rounded-full">
//               <DollarSign className="h-6 w-6" />
//             </div>
//           </div>
//         </CardContent>
//       </Card>
      
//       <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
//         <CardContent className="p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-blue-100 text-sm font-medium">Total Invoices</p>
//               <p className="text-2xl font-bold">
//                 {salesStats.summary.total_invoices}
//               </p>
//               <p className="text-blue-100 text-xs">
//                 Transactions
//               </p>
//             </div>
//             <div className="p-3 bg-white/20 rounded-full">
//               <Activity className="h-6 w-6" />
//             </div>
//           </div>
//         </CardContent>
//       </Card>
      
//       <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
//         <CardContent className="p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-purple-100 text-sm font-medium">Items Sold</p>
//               <p className="text-2xl font-bold">
//                 {salesStats.summary.total_items_sold}
//               </p>
//               <p className="text-purple-100 text-xs">
//                 Products sold
//               </p>
//             </div>
//             <div className="p-3 bg-white/20 rounded-full">
//               <TrendingUp className="h-6 w-6" />
//             </div>
//           </div>
//         </CardContent>
//       </Card>
      
//       <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
//         <CardContent className="p-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <p className="text-orange-100 text-sm font-medium">Average Invoice</p>
//               <p className="text-2xl font-bold">
//                 KSh {salesStats.summary.average_invoice_value.toLocaleString()}
//               </p>
//               <p className="text-orange-100 text-xs">
//                 Per transaction
//               </p>
//             </div>
//             <div className="p-3 bg-white/20 rounded-full">
//               <AlertTriangle className="h-6 w-6" />
//             </div>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// } 

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { 
  DollarSign, 
  Activity, 
  TrendingUp, 
  Calculator,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react';
import { SalesStats } from '../types';

interface StatsCardsProps {
  salesStats: SalesStats | null;
  loading?: boolean;
  selectedPeriod?: string;
}

const PERIOD_LABELS: Record<string, string> = {
  '1': 'today',
  'last_7_days': 'last 7 days',
  'week': 'this week',
  'month': 'this month',
  '30': 'last 30 days',
  '45': 'last 45 days',
  '90': 'last 90 days',
};

export function StatsCards({ salesStats, loading = false, selectedPeriod = '30' }: StatsCardsProps) {
  const periodLabel = PERIOD_LABELS[selectedPeriod] || `last ${selectedPeriod} days`;

  // Skeleton loader component
  const SkeletonCard = ({ gradient }: { gradient: string }) => (
    <Card className={`${gradient} text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-4 bg-white/20 rounded animate-pulse mb-2"></div>
            <div className="h-8 bg-white/30 rounded animate-pulse mb-1"></div>
            <div className="h-3 bg-white/20 rounded animate-pulse w-20"></div>
          </div>
          <div className="p-3 bg-white/20 rounded-full animate-pulse">
            <div className="h-6 w-6 bg-white/30 rounded"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SkeletonCard gradient="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700" />
        <SkeletonCard gradient="bg-gradient-to-br from-blue-500 via-cyan-600 to-indigo-700" />
        <SkeletonCard gradient="bg-gradient-to-br from-purple-500 via-pink-600 to-rose-700" />
        <SkeletonCard gradient="bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-700" />
      </div>
    );
  }

  if (!salesStats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-gray-400 to-gray-600 text-white border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <p className="text-gray-200">No data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate trend indicators (placeholder - you'll need historical data for real trends)
  const getTrendIcon = (value: number) => {
    // This is a placeholder - implement actual trend calculation
    const trend = Math.random() > 0.5 ? 'up' : Math.random() > 0.3 ? 'down' : 'neutral';
    if (trend === 'up') return <ArrowUpRight className="h-4 w-4 text-green-200" />;
    if (trend === 'down') return <ArrowDownRight className="h-4 w-4 text-red-200" />;
    return <Minus className="h-4 w-4 text-gray-200" />;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Sales Card */}
      <Card className="bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-10 -translate-x-10"></div>
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
              <DollarSign className="h-6 w-6" />
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon(salesStats.summary.total_sales)}
              <Sparkles className="h-4 w-4 text-green-200" />
            </div>
          </div>
          <div>
            <p className="text-green-100 text-sm font-medium mb-1">Total Sales</p>
            <p className="text-2xl font-bold mb-1">
              {formatCurrency(salesStats.summary.total_sales)}
            </p>
            <p className="text-green-100 text-xs">
              Revenue for {periodLabel}
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Total Invoices Card */}
      <Card className="bg-gradient-to-br from-blue-500 via-cyan-600 to-indigo-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-10 -translate-x-10"></div>
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
              <Activity className="h-6 w-6" />
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon(salesStats.summary.total_invoices)}
            </div>
          </div>
          <div>
            <p className="text-blue-100 text-sm font-medium mb-1">Total Invoices</p>
            <p className="text-2xl font-bold mb-1">
              {salesStats.summary.total_invoices.toLocaleString()}
            </p>
            <p className="text-blue-100 text-xs">
              Transactions processed
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Items Sold Card */}
      <Card className="bg-gradient-to-br from-purple-500 via-pink-600 to-rose-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-10 -translate-x-10"></div>
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon(salesStats.summary.total_items_sold)}
            </div>
          </div>
          <div>
            <p className="text-purple-100 text-sm font-medium mb-1">Items Sold</p>
            <p className="text-2xl font-bold mb-1">
              {salesStats.summary.total_items_sold.toLocaleString()}
            </p>
            <p className="text-purple-100 text-xs">
              Products moved
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Average Invoice Card */}
      <Card className="bg-gradient-to-br from-orange-500 via-amber-600 to-yellow-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-10 -translate-x-10"></div>
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl shadow-lg">
              <Calculator className="h-6 w-6" />
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon(salesStats.summary.average_invoice_value)}
            </div>
          </div>
          <div>
            <p className="text-orange-100 text-sm font-medium mb-1">Average Invoice</p>
            <p className="text-2xl font-bold mb-1">
              {formatCurrency(salesStats.summary.average_invoice_value)}
            </p>
            <p className="text-orange-100 text-xs">
              Per transaction
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}