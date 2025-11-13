'use client';

import { useState, useEffect } from 'react';
import { Package, Search, Filter, RefreshCw, AlertTriangle, Eye, TrendingUp, PlusIcon, Sparkles } from 'lucide-react';
import { toast } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { useInventory } from '@/lib/hooks/useInventory';
import InventoryTable from './table';
import { Inventory, InventoryFilters } from '@/types/inventory/inventory';
import Link from 'next/link';


export default function SalespersonInventoryPage() {
  const { fetchInventory, loading, error, clearError } = useInventory();
  const [allInventoryData, setAllInventoryData] = useState<Inventory[]>([]);
  const [filteredData, setFilteredData] = useState<Inventory[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockStatusFilter, setStockStatusFilter] = useState<string>('all');
  const [expiryStatusFilter, setExpiryStatusFilter] = useState<string>('all');
  const [formFilter, setFormFilter] = useState<string>('all');

  // Statistics
  const [stats, setStats] = useState({
    totalItems: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
    nearExpiry: 0,
    totalValue: 0
  });

  const loadAllInventory = async () => {
    clearError();

    const filters: InventoryFilters = {
      page_size: 1000 // sizenn
    };

    try {
      const response = await fetchInventory(filters);
      if (response) {
        setAllInventoryData(response.results);
        setTotalCount(response.count);
        calculateStats(response.results);
      } else {
        toast.error('Failed to load inventory data');
      }
    } catch (error) {
      toast.error('Failed to load inventory data');
    }
  };

  const calculateStats = (data: Inventory[]) => {
    const stats = data.reduce((acc, item) => {
      const totalPieces = item.total_pieces || 0;
      const reorderLevel = item.reorder_level || 0;
      const sellingPrice = item.selling_price_per_piece || 0;
      
      acc.totalItems++;
      acc.totalValue += totalPieces * sellingPrice;
      
      if (totalPieces === 0) {
        acc.outOfStock++;
      } else if (totalPieces <= reorderLevel) {
        acc.lowStock++;
      } else {
        acc.inStock++;
      }
      
      // Check if near expiry (within 30 days)
      if (item.expiry_date) {
        const today = new Date();
        const expiry = new Date(item.expiry_date);
        const daysToExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (daysToExpiry <= 30 && daysToExpiry > 0) {
          acc.nearExpiry++;
        }
      }
      
      return acc;
    }, {
      totalItems: 0,
      inStock: 0,
      lowStock: 0,
      outOfStock: 0,
      nearExpiry: 0,
      totalValue: 0
    });
    
    setStats(stats);
  };


  const applyFilters = () => {
    let filtered = [...allInventoryData];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(item => 
        item.product_name?.toLowerCase().includes(search) ||
        item.product_generic_name?.toLowerCase().includes(search) ||
        item.batch_number?.toLowerCase().includes(search) ||
        item.supplier?.toLowerCase().includes(search) ||
        item.barcode?.toLowerCase().includes(search)
      );
    }

    if (stockStatusFilter !== 'all') {
      filtered = filtered.filter(item => {
        const totalPieces = item.total_pieces || 0;
        const reorderLevel = item.reorder_level || 0;
        
        switch (stockStatusFilter) {
          case 'in_stock':
            return totalPieces > reorderLevel;
          case 'low_stock':
            return totalPieces > 0 && totalPieces <= reorderLevel;
          case 'out_of_stock':
            return totalPieces === 0;
          default:
            return true;
        }
      });
    }

    if (expiryStatusFilter !== 'all') {
      filtered = filtered.filter(item => {
        if (!item.expiry_date) return expiryStatusFilter === 'no_expiry';
        
        const today = new Date();
        const expiry = new Date(item.expiry_date);
        const daysToExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        switch (expiryStatusFilter) {
          case 'good':
            return daysToExpiry > 30;
          case 'expiring_soon':
            return daysToExpiry > 0 && daysToExpiry <= 30;
          case 'expired':
            return daysToExpiry <= 0;
          case 'no_expiry':
            return !item.expiry_date;
          default:
            return true;
        }
      });
    }

    // Apply form filter
    if (formFilter !== 'all') {
      filtered = filtered.filter(item => item.form === formFilter);
    }

    setFilteredData(filtered);
    setCurrentPage(1); 
  };

  useEffect(() => {
    loadAllInventory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [allInventoryData, searchTerm, stockStatusFilter, expiryStatusFilter, formFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    toast.info('Refreshing inventory...');
    loadAllInventory();
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setStockStatusFilter('all');
    setExpiryStatusFilter('all');
    setFormFilter('all');
  };

  // Get unique forms for filter dropdown
  const uniqueForms = Array.from(new Set(allInventoryData.map(item => item.form).filter(Boolean)));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Inventory Overview</h1>
                <p className="text-xs sm:text-sm text-gray-500">View stock levels and product details</p>
              </div>
            </div>




 <button
       
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
              >
                <Sparkles className="h-5 w-5" />
                <Link
              href= '/sales/inventory/create'
              >
             Add Inventory to PO </Link>
              </button>



            <Button
              onClick={handleRefresh}
              disabled={loading}
              variant="outline"
              size="sm"
              className="flex items-center w-full sm:w-auto justify-center"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>


        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.totalItems}</p>
              </div>
              <Package className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">In Stock</p>
                <p className="text-lg sm:text-2xl font-bold text-green-600">{stats.inStock}</p>
              </div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-lg sm:text-2xl font-bold text-amber-600">{stats.lowStock}</p>
              </div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-amber-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-amber-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-lg sm:text-2xl font-bold text-red-600">{stats.outOfStock}</p>
              </div>
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-100 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Near Expiry</p>
                <p className="text-lg sm:text-2xl font-bold text-orange-600">{stats.nearExpiry}</p>
              </div>
              <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-orange-500" />
            </div>
          </div>

          {/* <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-lg sm:text-2xl font-bold text-blue-600">
                  KSh {stats.totalValue.toLocaleString()}
                </p>
              </div>
              <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
            </div>
          </div> */}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200">
          <div className="flex flex-col space-y-3 sm:space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search products, batch, barcode, or supplier..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm"
              />
            </div>
            
            {/* Filter Row */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <Select value={stockStatusFilter} onValueChange={setStockStatusFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Stock Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stock</SelectItem>
                    <SelectItem value="in_stock">In Stock</SelectItem>
                    <SelectItem value="low_stock">Low Stock</SelectItem>
                    <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1 min-w-0">
                <Select value={expiryStatusFilter} onValueChange={setExpiryStatusFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Expiry Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Items</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="no_expiry">No Expiry Set</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex-1 min-w-0">
                <Select value={formFilter} onValueChange={setFormFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Form" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Forms</SelectItem>
                    {uniqueForms.map((form) => (
                      <SelectItem key={form} value={form}>
                        {form.charAt(0).toUpperCase() + form.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button 
                variant="outline" 
                onClick={clearAllFilters}
                className="w-full sm:w-auto"
                size="sm"
              >
                <Filter className="w-4 h-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" />
              <p className="text-red-800 text-sm flex-1">{error}</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearError}
                className="ml-2 text-red-600 hover:text-red-800 flex-shrink-0"
              >
                Dismiss
              </Button>
            </div>
          </div>
        )}

        {/* Filter Results Info */}
        {!loading && filteredData.length !== allInventoryData.length && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <p className="text-blue-800 text-sm">
              Showing {filteredData.length} of {allInventoryData.length} items
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-sm">Loading inventory...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <Package className="w-8 h-8 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No inventory found</h3>
            <p className="text-gray-500 text-sm mb-4">
              {searchTerm || stockStatusFilter !== 'all' || expiryStatusFilter !== 'all' || formFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'No items available'}
            </p>
            {(searchTerm || stockStatusFilter !== 'all' || expiryStatusFilter !== 'all' || formFilter !== 'all') && (
              <Button variant="outline" onClick={clearAllFilters} size="sm">
                Clear All Filters
              </Button>
            )}
          </div>
        ) : (
          <InventoryTable
            inventoryData={filteredData}
            currentPage={currentPage}
            pageSize={pageSize}
            totalCount={filteredData.length}
            loading={loading}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            readOnly={true} />
        )}
      </div>
    </div>
  );
}