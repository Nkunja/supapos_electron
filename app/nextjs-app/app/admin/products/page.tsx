"use client";

import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { getProducts, deleteProduct } from "@/app/api/products";
import { Product, ProductFilters } from "@/types/product";
import { HeaderSection } from "./components/HeaderSection";
import { SummaryCard } from "./components/SummaryCard";
import { SearchControls } from "./components/SearchControls";
import { ProductTable } from "./components/ProductTable";
import { PaginationControls } from "./components/PaginationControls";
import { AddProductForm } from "./components/AddProductForm";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

function useSearch<T>(
  data: T[],
  query: string,
  fields: (keyof T)[],
  matchType: "contains" | "startsWith" | "exact" = "contains"
) {
  const debouncedQuery = useDebounce(query, 300);

  return useMemo(() => {
    if (!debouncedQuery) return data;

    const trimmedQuery = debouncedQuery.trim().toLowerCase();
    return data.filter((item) =>
      fields.some((field) => {
        const value = item[field];
        if (!value) return false;
        const stringValue = String(value).toLowerCase();
        switch (matchType) {
          case "contains":
            return stringValue.includes(trimmedQuery);
          case "startsWith":
            return stringValue.startsWith(trimmedQuery);
          case "exact":
            return stringValue === trimmedQuery;
          default:
            return false;
        }
      })
    );
  }, [data, debouncedQuery, fields, matchType]);
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState<ProductFilters>({
    search: "",
    page: 1,
  });
  const [pagination, setPagination] = useState({
    count: 0,
    next: null as string | null,
    previous: null as string | null,
  });

  // Use the search hook to filter products locally
  const filteredProducts = useSearch<Product>(
    products,
    filters.search,
    ["name", "generic_name", "description"],
    "contains"
  );

  useEffect(() => {
    loadProducts();
  }, [filters.page]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: filters.page > 1 ? filters.page.toString() : undefined,
      };
      const data = await getProducts(params);
      setProducts(data.results || []);
      setPagination({
        count: data.count || 0,
        next: data.next,
        previous: data.previous,
      });
    } catch (error) {
      toast.error("Failed to load products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProduct(null);
    loadProducts();
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct(productId);
      toast.success("Product deleted successfully!");
      loadProducts();
    } catch (error) {
      toast.error("Failed to delete product");
    }
  };

  const exportToCSV = () => {
    try {
      const headers = ["ID", "Name", "Generic Name", "Description"];
      const csvData = filteredProducts.map((product) => [
        product.id,
        product.name,
        product.generic_name,
        product.description,
      ]);
      const csvContent = [headers, ...csvData]
        .map((row) => row.map((cell) => `"${cell}"`).join(","))
        .join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `products_${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("CSV exported successfully!");
    } catch (error) {
      toast.error("Failed to export CSV");
    }
  };

  const exportToPDF = () => {
    try {
      const printWindow = window.open("", "_blank");
      if (!printWindow) throw new Error("Failed to open print window");
      const htmlContent = `
        <html>
          <head>
            <title>Products Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; }
              th, td { border: 1px solid #ddd; padding: 6px; text-align: left; }
              th { background-color: #f2f2f2; font-weight: bold; }
              h1 { color: #333; }
              .header { margin-bottom: 20px; }
              .summary-card { border: 1px solid #ddd; padding: 10px; text-align: center; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>Products Report</h1>
              <p>Generated on: ${new Date().toLocaleDateString()}</p>
              <p>Total Products: ${filteredProducts.length}</p>
            </div>
            <div class="summary-card">
              <h3>Total Products</h3>
              <p>${filteredProducts.length}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Generic Name</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                ${filteredProducts
                  .map(
                    (product) => `
                  <tr>
                    <td>${product.name}</td>
                    <td>${product.generic_name}</td>
                    <td>${product.description || "N/A"}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </body>
        </html>
      `;
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.print();
      toast.success("PDF export initiated!");
    } catch (error) {
      toast.error("Failed to export PDF");
    }
  };

  return (
    <>
      <div className="mb-6">
        <HeaderSection
          totalProducts={pagination.count}
          loading={loading}
          onRefresh={loadProducts}
          onAddProduct={handleAddProduct}
        />
        <SummaryCard totalProducts={filteredProducts.length} />
      </div>

      <SearchControls
        searchQuery={filters.search}
        onSearch={handleSearch}
        onExportCSV={exportToCSV}
        onExportPDF={exportToPDF}
      />

      <ProductTable
        products={filteredProducts}
        loading={loading}
        searchQuery={filters.search}
        onAddProduct={handleAddProduct}
        onEditProduct={handleEditProduct}
        onDeleteProduct={handleDeleteProduct}
      />

      {pagination.count > 0 && (
        <PaginationControls
          currentPage={filters.page}
          totalCount={pagination.count}
          hasPrevious={!!pagination.previous}
          hasNext={!!pagination.next}
          onPageChange={handlePageChange}
        />
      )}

      <AddProductForm
        isOpen={showForm}
        onClose={handleFormClose}
        product={editingProduct}
        onSuccess={handleFormSuccess}
      />
    </>
  );
}
