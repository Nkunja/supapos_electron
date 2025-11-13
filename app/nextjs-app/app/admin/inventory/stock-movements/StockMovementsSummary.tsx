// "use client";

// import React, { useState, useEffect } from "react";
// import { useStockMovements } from "@/lib/hooks/useStockMovements";
// import {
//   StockMovement,
//   StockMovementFilters,
// } from "@/lib/types/stock-movements/stock-movements";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Package, AlertTriangle, ArrowLeft } from "lucide-react";
// import Link from "next/link";

// interface StockMovementsSummaryProps {
//   filters?: StockMovementFilters;
// }

// export function StockMovementsSummary({ filters }: StockMovementsSummaryProps) {
//   const {
//     fetchMovementSummary,
//     loading,
//     error: apiError,
//   } = useStockMovements();
//   const [movements, setMovements] = useState<StockMovement[]>([]);
//   const [localFilters, setLocalFilters] = useState<StockMovementFilters>({
//     date_from: "",
//     date_to: "",
//     movement_type: undefined,
//     ...filters,
//   });

//   useEffect(() => {
//     loadSummary();
//   }, [localFilters]);

//   const loadSummary = async () => {
//     try {
//       const data = await fetchMovementSummary(localFilters);
//       setMovements(Array.isArray(data) ? data : []);
//     } catch (err) {
//       setMovements([]);
//     }
//   };

//   const handleFilterChange = (key: keyof StockMovementFilters, value: any) => {
//     setLocalFilters((prev) => ({
//       ...prev,
//       [key]: value || undefined,
//     }));
//   };

//   const getMovementTypeColor = (type: string) => {
//     switch (type) {
//       case "in":
//         return "text-green-600 bg-green-50 border-green-200";
//       case "out":
//         return "text-red-600 bg-red-50 border-red-200";
//       case "adjustment":
//         return "text-yellow-600 bg-yellow-50 border-yellow-200";
//       case "transfer":
//         return "text-blue-600 bg-blue-50 border-blue-200";
//       case "sale":
//         return "text-purple-600 bg-purple-50 border-purple-200";
//       default:
//         return "text-gray-600 bg-gray-50 border-gray-200";
//     }
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString("en-US", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   return (
//     <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//       {/* Back Button */}
//       <div className="mb-6">
//         <Link href="/admin/inventory">
//           <Button variant="outline" size="sm">
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Inventory
//           </Button>
//         </Link>
//       </div>

//       {/* Stock Movements Summary */}
//       <div className="max-w-7xl mx-auto">
//         <Card className="shadow-lg">
//           <CardHeader>
//             <CardTitle className="flex items-center space-x-2">
//               <Package className="h-5 w-5 text-blue-600" />
//               <span>Stock Movements Summary</span>
//             </CardTitle>
//             <CardDescription>
//               View and filter stock movement history
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             {/* Filters Section */}
//             <div className="space-y-4 mb-6">
//               <div className="border-b pb-2">
//                 <h3 className="text-lg font-medium text-gray-900">Filters</h3>
//                 <p className="text-sm text-gray-600">
//                   Refine the stock movements displayed
//                 </p>
//               </div>
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="date_from" className="text-sm font-medium">
//                     From Date
//                   </Label>
//                   <Input
//                     id="date_from"
//                     type="date"
//                     value={localFilters.date_from || ""}
//                     onChange={(e) =>
//                       handleFilterChange("date_from", e.target.value)
//                     }
//                     className="h-12"
//                     disabled={loading}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="date_to" className="text-sm font-medium">
//                     To Date
//                   </Label>
//                   <Input
//                     id="date_to"
//                     type="date"
//                     value={localFilters.date_to || ""}
//                     onChange={(e) =>
//                       handleFilterChange("date_to", e.target.value)
//                     }
//                     className="h-12"
//                     disabled={loading}
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label
//                     htmlFor="movement_type"
//                     className="text-sm font-medium"
//                   >
//                     Movement Type
//                   </Label>
//                   <Select
//                     value={localFilters.movement_type || "all"}
//                     onValueChange={(value) =>
//                       handleFilterChange(
//                         "movement_type",
//                         value === "all" ? undefined : value
//                       )
//                     }
//                     disabled={loading}
//                   >
//                     <SelectTrigger id="movement_type" className="h-12">
//                       <SelectValue placeholder="All Types" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="all">All Types</SelectItem>
//                       <SelectItem value="in">Stock In</SelectItem>
//                       <SelectItem value="out">Stock Out</SelectItem>
//                       <SelectItem value="adjustment">Adjustment</SelectItem>
//                       <SelectItem value="transfer">Transfer</SelectItem>
//                       <SelectItem value="sale">Sale</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             </div>

//             {/* Error Alert */}
//             {apiError && (
//               <Alert variant="destructive" className="mb-6">
//                 <AlertTriangle className="h-4 w-4" />
//                 <AlertDescription>{apiError}</AlertDescription>
//               </Alert>
//             )}

//             {/* Loading State */}
//             {loading ? (
//               <div className="text-center py-8">
//                 <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//                 <p className="mt-2 text-gray-600">Loading movements...</p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full table-auto divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Product
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Shop
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Type
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Quantity
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Previous
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         New
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Date
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Created By
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {movements.length > 0 ? (
//                       movements.map((movement) => (
//                         <tr key={movement.id} className="hover:bg-gray-50">
//                           <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                             {movement.product_name}
//                           </td>
//                           <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
//                             {movement.shop_name}
//                           </td>
//                           <td className="px-4 py-4 whitespace-nowrap">
//                             <span
//                               className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getMovementTypeColor(
//                                 movement.movement_type
//                               )}`}
//                             >
//                               {movement.movement_type_display}
//                             </span>
//                           </td>
//                           <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
//                             {movement.quantity > 0 ? "+" : ""}
//                             {movement.quantity}
//                           </td>
//                           <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
//                             {movement.previous_quantity}
//                           </td>
//                           <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
//                             {movement.new_quantity}
//                           </td>
//                           <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
//                             {formatDate(movement.created_at)}
//                           </td>
//                           <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
//                             {movement.created_by_name}
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td
//                           colSpan={8}
//                           className="px-4 py-8 text-center text-gray-500"
//                         >
//                           No stock movements found for the selected criteria.
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
