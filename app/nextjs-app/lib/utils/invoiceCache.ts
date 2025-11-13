// utils/invoiceCache.ts

interface CacheData<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

class InvoiceCache {
  private cache: Map<string, CacheData<any>>;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 30 minutes in milliseconds

  constructor() {
    this.cache = new Map();
  }

  /**
   * Get cached data if it exists and hasn't expired
   */
  get<T>(key: string): T | null {
    const cached = this.cache.get(key);

    if (!cached) {
      return null;
    }

    const now = Date.now();
    if (now > cached.expiresAt) {
      // Cache expired, remove it
      this.cache.delete(key);
      return null;
    }

    return cached.data as T;
  }

  /**
   * Set data in cache with expiration
   */
  set<T>(key: string, data: T, duration?: number): void {
    const now = Date.now();
    const expiresAt = now + (duration || this.CACHE_DURATION);

    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt,
    });
  }

  /**
   * Check if cache exists and is valid
   */
  has(key: string): boolean {
    const cached = this.cache.get(key);
    if (!cached) return false;

    const now = Date.now();
    if (now > cached.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  /**
   * Invalidate specific cache entry
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get time remaining until cache expires (in milliseconds)
   */
  getTimeRemaining(key: string): number {
    const cached = this.cache.get(key);
    if (!cached) return 0;

    const now = Date.now();
    return Math.max(0, cached.expiresAt - now);
  }

  /**
   * Get cache age (in milliseconds)
   */
  getCacheAge(key: string): number {
    const cached = this.cache.get(key);
    if (!cached) return 0;

    const now = Date.now();
    return now - cached.timestamp;
  }

  /**
   * Get all cache keys
   */
  getAllKeys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Invalidate all caches matching a pattern
   */
  invalidatePattern(pattern: string): void {
    const keys = this.getAllKeys();
    keys.forEach((key) => {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    });
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const keys = this.getAllKeys();
    return {
      totalCaches: keys.length,
      caches: keys.map((key) => {
        const cached = this.cache.get(key);
        return {
          key,
          ageMs: this.getCacheAge(key),
          remainingMs: this.getTimeRemaining(key),
          expiresAt: cached ? new Date(cached.expiresAt) : null,
        };
      }),
    };
  }
}

// Export singleton instance
export const invoiceCache = new InvoiceCache();

// Cache keys
export const CACHE_KEYS = {
  ALL_INVOICES: "all_invoices",
  SALES_SUMMARY: (period: string) => `sales_summary_${period}`,
  FILTERED_INVOICES: (filters: string) => `filtered_invoices_${filters}`,
};
