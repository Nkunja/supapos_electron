import { Product, ProductsResponse } from "@/types/products_shops/product";
import { useState, useEffect } from "react";


interface UseProductsResult {
  products: Product[] | null;
  loading: boolean;
  error: string | null;
}

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/products");
        const data: ProductsResponse = await res.json();

        if (!res.ok) {
          setError("Failed to fetch products");
          setProducts(null);
          setLoading(false);
          return;
        }

        setProducts(data.results);
        setLoading(false);
      } catch (err) {
        setError("Network error");
        setProducts(null);
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return { products, loading, error };
}
