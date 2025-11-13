// "use client";

// import React, { useState } from "react";
// import { useStockMovements } from "@/lib/hooks/useStockMovements";
// import { StockMovementFormData } from "@/lib/types/stock-movements/stock-movements";
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
// import { Textarea } from "@/components/ui/textarea";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import {
//   Package,
//   AlertTriangle,
//   CheckCircle,
//   ArrowLeft,
//   PlusCircle,
// } from "lucide-react";
// import Link from "next/link";
// import { StockMovementCreateRequest } from "@/lib/types/stock-movements/stock-movements";

// // interface StockMovementCreateRequest {
// //   inventory: number;
// //   movement_type: string;
// //   quantity: number;
// //   previous_quantity: number;
// //   new_quantity: number;
// //   reference_number: string;
// //   invoice: string;
// //   notes: string;
// // }

// interface StockInFormProps {
//   onSuccess?: () => void;
//   onCancel?: () => void;
// }

// export function StockInForm({ onSuccess, onCancel }: StockInFormProps) {
//   const { createStockMovement, loading, error: apiError } = useStockMovements();
//   const [formData, setFormData] = useState<StockMovementFormData>({
//     inventory: "",
//     movement_type: "in",
//     quantity: "",
//     previous_quantity: "",
//     new_quantity: "",
//     reference_number: "",
//     invoice: "",
//     notes: "",
//   });
//   const [formError, setFormError] = useState<string>("");
//   const [success, setSuccess] = useState<string>("");

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//     if (formError) setFormError("");
//     if (success) setSuccess("");
//   };

//   const validateForm = (): boolean => {
//     if (!formData.inventory.trim()) {
//       setFormError("Inventory ID is required");
//       return false;
//     }
//     if (!formData.quantity.trim()) {
//       setFormError("Quantity is required");
//       return false;
//     }
//     if (!formData.previous_quantity.trim()) {
//       setFormError("Previous quantity is required");
//       return false;
//     }
//     if (!formData.new_quantity.trim()) {
//       setFormError("New quantity is required");
//       return false;
//     }
//     const quantity = parseInt(formData.quantity);
//     if (isNaN(quantity) || quantity <= 0) {
//       setFormError("Quantity must be a positive number");
//       return false;
//     }
//     const previousQuantity = parseInt(formData.previous_quantity);
//     if (isNaN(previousQuantity) || previousQuantity < 0) {
//       setFormError("Previous quantity must be a non-negative number");
//       return false;
//     }
//     const newQuantity = parseInt(formData.new_quantity);
//     if (isNaN(newQuantity) || newQuantity < 0) {
//       setFormError("New quantity must be a non-negative number");
//       return false;
//     }
//     return true;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     const submitData: StockMovementCreateRequest = {
//       inventory: parseInt(formData.inventory),
//       movement_type: formData.movement_type,
//       quantity: parseInt(formData.quantity),
//       previous_quantity: parseInt(formData.previous_quantity),
//       new_quantity: parseInt(formData.new_quantity),
//       reference_number: formData.reference_number.trim(),
//       invoice: formData.invoice.trim(),
//       notes: formData.notes.trim(),
//     };

//     try {
//       const result = await createStockMovement(submitData);
//       if (result && onSuccess) {
//         setSuccess("Stock added successfully");
//         setFormData({
//           inventory: "",
//           movement_type: "in",
//           quantity: "",
//           previous_quantity: "",
//           new_quantity: "",
//           reference_number: "",
//           invoice: "",
//           notes: "",
//         });
//         setTimeout(() => {
//           onSuccess();
//         }, 2000);
//       }
//     } catch (err) {
//       setFormError(err instanceof Error ? err.message : "Failed to add stock");
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 sm:px-6 lg:px-8">
//       {/* Stock In Form */}
//       <div className="max-w-7xl mx-auto">
//         <Card className="shadow-lg">
//           <CardHeader>
//             <CardTitle className="flex items-center space-x-2">
//               <PlusCircle className="h-5 w-5 text-green-600" />
//               <span>Add Stock In</span>
//             </CardTitle>
//             <CardDescription>
//               Enter the details below to add new stock to inventory
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             {/* Alerts */}
//             {(formError || apiError) && (
//               <Alert variant="destructive" className="mb-6">
//                 <AlertTriangle className="h-4 w-4" />
//                 <AlertDescription>{formError || apiError}</AlertDescription>
//               </Alert>
//             )}

//             {success && (
//               <Alert className="mb-6 border-green-200 bg-green-50">
//                 <CheckCircle className="h-4 w-4 text-green-600" />
//                 <AlertDescription className="text-green-800">
//                   {success}
//                 </AlertDescription>
//               </Alert>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-6">
//               {/* Inventory Information Section */}
//               <div className="space-y-4">
//                 <div className="border-b pb-2">
//                   <h3 className="text-lg font-medium text-gray-900">
//                     Inventory Details
//                   </h3>
//                   <p className="text-sm text-gray-600">
//                     Basic information about the stock movement
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <Label htmlFor="inventory" className="text-sm font-medium">
//                       Inventory ID *
//                     </Label>
//                     <div className="relative">
//                       <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                       <Input
//                         id="inventory"
//                         type="number"
//                         name="inventory"
//                         placeholder="Enter inventory ID"
//                         value={formData.inventory}
//                         onChange={handleInputChange}
//                         className="pl-10 h-12"
//                         required
//                         disabled={loading}
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="quantity" className="text-sm font-medium">
//                       Quantity *
//                     </Label>
//                     <div className="relative">
//                       <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                       <Input
//                         id="quantity"
//                         type="number"
//                         name="quantity"
//                         placeholder="Enter quantity"
//                         value={formData.quantity}
//                         onChange={handleInputChange}
//                         className="pl-10 h-12"
//                         required
//                         disabled={loading}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Quantity Information Section */}
//               <div className="space-y-4">
//                 <div className="border-b pb-2">
//                   <h3 className="text-lg font-medium text-gray-900">
//                     Quantity Information
//                   </h3>
//                   <p className="text-sm text-gray-600">
//                     Stock quantity details
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <Label
//                       htmlFor="previous_quantity"
//                       className="text-sm font-medium"
//                     >
//                       Previous Quantity *
//                     </Label>
//                     <div className="relative">
//                       <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                       <Input
//                         id="previous_quantity"
//                         type="number"
//                         name="previous_quantity"
//                         placeholder="Enter previous quantity"
//                         value={formData.previous_quantity}
//                         onChange={handleInputChange}
//                         className="pl-10 h-12"
//                         required
//                         disabled={loading}
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label
//                       htmlFor="new_quantity"
//                       className="text-sm font-medium"
//                     >
//                       New Quantity *
//                     </Label>
//                     <div className="relative">
//                       <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//                       <Input
//                         id="new_quantity"
//                         type="number"
//                         name="new_quantity"
//                         placeholder="Enter new quantity"
//                         value={formData.new_quantity}
//                         onChange={handleInputChange}
//                         className="pl-10 h-12"
//                         required
//                         disabled={loading}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Additional Information Section */}
//               <div className="space-y-4">
//                 <div className="border-b pb-2">
//                   <h3 className="text-lg font-medium text-gray-900">
//                     Additional Information
//                   </h3>
//                   <p className="text-sm text-gray-600">
//                     Optional details for the stock movement
//                   </p>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="space-y-2">
//                     <Label
//                       htmlFor="reference_number"
//                       className="text-sm font-medium"
//                     >
//                       Reference Number
//                     </Label>
//                     <Input
//                       id="reference_number"
//                       type="text"
//                       name="reference_number"
//                       placeholder="Enter reference number"
//                       value={formData.reference_number}
//                       onChange={handleInputChange}
//                       className="h-12"
//                       disabled={loading}
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor="invoice" className="text-sm font-medium">
//                       Invoice
//                     </Label>
//                     <Input
//                       id="invoice"
//                       type="text"
//                       name="invoice"
//                       placeholder="Enter invoice number"
//                       value={formData.invoice}
//                       onChange={handleInputChange}
//                       className="h-12"
//                       disabled={loading}
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="notes" className="text-sm font-medium">
//                     Notes
//                   </Label>
//                   <Textarea
//                     id="notes"
//                     name="notes"
//                     placeholder="Add any additional notes"
//                     value={formData.notes}
//                     onChange={handleInputChange}
//                     rows={4}
//                     disabled={loading}
//                   />
//                 </div>
//               </div>

//               {/* Form Actions */}
//               <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
//                 <Button
//                   type="submit"
//                   className="flex-1 bg-blue-600 hover:bg-blue-700 h-12"
//                   disabled={loading}
//                 >
//                   {loading ? (
//                     <>
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                       Adding Stock...
//                     </>
//                   ) : (
//                     <>
//                       <PlusCircle className="h-4 w-4 mr-2" />
//                       Add Stock
//                     </>
//                   )}
//                 </Button>
//                 {onCancel && (
//                   <Button
//                     type="button"
//                     variant="outline"
//                     className="flex-1 h-12"
//                     onClick={onCancel}
//                     disabled={loading}
//                   >
//                     Cancel
//                   </Button>
//                 )}
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
