"use client";

import { useState, useEffect } from "react";
import { Package, Search, RefreshCw, AlertTriangle, Plus } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProducts } from "@/app/api/products";
import { Product } from "@/types/product";
import { ProductTable } from "./table";
import { AddProductForm } from "@/app/admin/products/components/AddProductForm";

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [pageSize, setPageSize] = useState(20);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const loadAllProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getProducts({});
      if (data?.results) {
        setAllProducts(data.results);
      } else {
        setAllProducts([]);
        toast.error("Failed to load products data");
      }
    } catch (error) {
      setError("Failed to load products");
      toast.error("Failed to load products data");
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...allProducts];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(search) ||
          product.generic_name?.toLowerCase().includes(search) ||
          product.description?.toLowerCase().includes(search)
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    loadAllProducts();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [allProducts, searchTerm]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleRefresh = () => {
    toast.info("Refreshing products...");
    loadAllProducts();
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };
  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProduct(null);
    loadAllProducts();
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <div className="space-y-6 p-4">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Products</h1>
              <p className="text-sm text-gray-500">
                View all products in the catalog
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleAddProduct}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
            <Button
              onClick={handleRefresh}
              disabled={loading}
              variant="outline"
              className="flex items-center"
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-800">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearError}
              className="ml-auto text-red-600 hover:text-red-800"
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}
      {!loading && filteredProducts.length !== allProducts.length && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            Showing {filteredProducts.length} of {allProducts.length} products
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-500">
            {searchTerm
              ? "Try adjusting your search terms"
              : "No products available in the catalog"}
          </p>
        </div>
      ) : (
        <ProductTable
          products={filteredProducts}
          currentPage={currentPage}
          pageSize={pageSize}
          loading={loading}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}

      <AddProductForm
        isOpen={showForm}
        onClose={handleFormClose}
        product={editingProduct}
        onSuccess={handleFormSuccess}
      />
    </div>
  );
}
