'use client'
import React, { useState } from 'react';
import { 
  Package, 
  ShoppingCart, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  Sparkles,
  Building2,
  Clipboard,
  Plus
} from 'lucide-react';
import { AddInventoryForm } from '@/app/admin/inventory/form';

export default function SalesInventoryPage() {
  const [showForm, setShowForm] = useState(true); 
  const [successCount, setSuccessCount] = useState(0);

  const handleFormSuccess = () => {
    setSuccessCount(prev => prev + 1);
  };

  const handleShowSuccessMessage = () => {
    setShowForm(false);
  };

  const handleShowForm = () => {
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Inventory Management
                  </h1>
                  <p className="text-lg text-gray-600 mt-1">
                    Add products to your shop inventory from purchase orders
                  </p>
                </div>
              </div>
              
              <div className="flex space-x-3">
                {!showForm && (
                  <button
                    onClick={handleShowForm}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                  >
                    <Plus className="h-5 w-5" />
                    <span>Add Another Product</span>
                  </button>
                )}
                
                {showForm && successCount > 0 && (
                  <button
                    onClick={handleShowSuccessMessage}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
                  >
                    <CheckCircle2 className="h-5 w-5" />
                    <span>View Success ({successCount})</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          <div className="bg-white rounded-xl shadow-lg border border-blue-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-blue-100">
              <div className="flex items-center space-x-3">
                <FileText className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-900">Purchase Orders</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    Select from approved or completed purchase orders
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    Automatically links products to their original orders
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    Purchase order selection is optional but recommended for tracking
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-purple-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-purple-100">
              <div className="flex items-center space-x-3">
                <Building2 className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-purple-900">Shop Assignment</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    Assign products to specific shop locations
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    Shop selection is automatically filled from purchase orders
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    Ensure correct shop selection for accurate inventory tracking
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-green-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-green-100">
              <div className="flex items-center space-x-3">
                <Clipboard className="h-6 w-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-900">Product Details</h3>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    Set batch numbers, expiry dates, and pricing information
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    Automatic price calculations with 30% markup suggestion
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-700">
                    Configure units, pieces per unit, and reorder levels
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          {showForm ? (
            <div className="p-0">
              <AddInventoryForm
                onSuccess={handleFormSuccess}
                onClose={() => setShowForm(false)}
                isEmbedded={true}
              />
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Products Added Successfully!
              </h3>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 max-w-md mx-auto mb-8">
                <div className="flex items-center justify-center space-x-3">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                  <span className="text-green-800 font-semibold text-lg">
                    {successCount} product{successCount !== 1 ? 's' : ''} added to inventory
                  </span>
                </div>
              </div>
              <button
                onClick={handleShowForm}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2 mx-auto"
              >
                <Plus className="h-5 w-5" />
                <span>Add Another Product</span>
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}