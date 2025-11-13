import { Shop } from "@/app/api/shop";
import { useEffect, useState } from "react";

interface UseShopsResult {
  shops: Shop[] | null;
  loading: boolean;
  error: string | null;
}

export function useShops(): UseShopsResult {
  const [shops, setShops] = useState<Shop[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/shops", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to fetch shops");
          setShops(null);
        } else {
          setShops(data.results || []);
        }
      } catch (err) {
        setError("Network error");
        setShops(null);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, []);

  return { shops, loading, error };
}
