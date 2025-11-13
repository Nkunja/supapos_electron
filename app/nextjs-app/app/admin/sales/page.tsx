// "use client";

// import { useState, useEffect, useMemo } from "react";
// import { SalesFilters, InvoicesList, SalesStatsCards } from "./components";

// import {
//   SalesSummary,
//   InvoicesResponse,
//   FilterOptions,
//   PeriodFilter,
//   Invoice,
// } from "./types";
// import { getInvoices } from "@/app/api/invoices";
// import { getSalesSummary } from "@/app/api/invoices/sales_summary";
// import { toast } from "react-toastify";
// import { getRecentInvoices, getAllInvoices } from "@/app/api/sales";

// export default function Sales() {
//   const [salesSummary, setSalesSummary] = useState<SalesSummary | null>(null);
//   const [invoices, setInvoices] = useState<InvoicesResponse | null>(null);
//   const [filters, setFilters] = useState<FilterOptions>({
//     period: "30",
//   });
//   const [loading, setLoading] = useState(true);
//   const [summaryLoading, setSummaryLoading] = useState(true);
//   const [invoicesLoading, setInvoicesLoading] = useState(true);
//   const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
//   const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
//   const [customDateRange, setCustomDateRange] = useState<{
//     start: string;
//     end: string;
//   } | null>(null);
//   const [initialLoad, setInitialLoad] = useState(true);

//   const filteredTotals = useMemo(() => {
//     const totals = {
//       totalAmount: 0,
//       totalPaid: 0,
//       totalTax: 0,
//       totalDiscount: 0,
//       invoiceCount: filteredInvoices.length,
//     };

//     filteredInvoices.forEach((invoice) => {
//       totals.totalAmount += Number(invoice.total_amount) || 0;
//       totals.totalPaid += Number(invoice.amount_paid) || 0;
//       totals.totalTax += Number(invoice.tax_amount) || 0;
//       totals.totalDiscount += Number(invoice.discount_amount) || 0;
//     });

//     return totals;
//   }, [filteredInvoices]);

//   // Initial load - fetch all invoices and show them
//   useEffect(() => {
//     const fetchInvoices = async () => {
//       try {
//         const response = await getAllInvoices();
//         setAllInvoices(response.results);
//         setFilteredInvoices(response.results); // Show ALL invoices initially
//         setInitialLoad(false);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching invoices:", error);
//         toast.error("Failed to load invoices");
//         setLoading(false);
//       }
//     };
//     fetchInvoices();
//   }, []);

//   useEffect(() => {
//     loadSalesSummary();
//   }, [filters.period, customDateRange]);

//   useEffect(() => {
//     loadInvoices();
//     loadSalesSummary();
//   }, [filters, customDateRange]);

//   // Apply filters to all invoices (skip on initial load to show all)
//   useEffect(() => {
//     if (!initialLoad) {
//       applyFilters();
//     }
//   }, [filters, allInvoices, customDateRange, initialLoad]);

//   const applyFilters = () => {
//     let filtered = [...allInvoices];

//     // Apply date filter
//     if (
//       filters.period === "custom" &&
//       customDateRange &&
//       customDateRange.start &&
//       customDateRange.end
//     ) {
//       const startDate = new Date(customDateRange.start);
//       const endDate = new Date(customDateRange.end);
//       endDate.setHours(23, 59, 59, 999);

//       filtered = filtered.filter((invoice) => {
//         const invoiceDate = new Date(invoice.created_at);
//         return invoiceDate >= startDate && invoiceDate <= endDate;
//       });
//     } else if (filters.period !== "custom") {
//       const now = new Date();
//       let startFilterDate: Date;

//       switch (filters.period) {
//         case "1":
//           startFilterDate = new Date(
//             now.getFullYear(),
//             now.getMonth(),
//             now.getDate()
//           );
//           break;
//         case "7":
//         case "week":
//           startFilterDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
//           break;
//         case "30":
//         case "month":
//           startFilterDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
//           break;
//         case "45":
//           startFilterDate = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000);
//           break;
//         case "90":
//         case "6months":
//           startFilterDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
//           break;
//         case "day":
//           startFilterDate = new Date(
//             now.getFullYear(),
//             now.getMonth(),
//             now.getDate()
//           );
//           break;
//         default:
//           startFilterDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
//       }

//       filtered = filtered.filter((invoice) => {
//         const invoiceDate = new Date(invoice.created_at);
//         return invoiceDate >= startFilterDate;
//       });
//     }

//     // Apply status filter
//     if (filters.status) {
//       filtered = filtered.filter(
//         (invoice) =>
//           invoice.status?.toLowerCase() === filters.status?.toLowerCase()
//       );
//     }

//     // Apply payment method filter
//     if (filters.payment_method) {
//       filtered = filtered.filter(
//         (invoice) =>
//           invoice.payment_method?.toLowerCase() ===
//           filters.payment_method?.toLowerCase()
//       );
//     }

//     // Apply search filter
//     if (filters.search) {
//       const searchLower = filters.search.toLowerCase();
//       filtered = filtered.filter(
//         (invoice) =>
//           invoice.invoice_number?.toLowerCase().includes(searchLower) ||
//           invoice.customer_name?.toLowerCase().includes(searchLower) ||
//           invoice.customer?.name?.toLowerCase().includes(searchLower)
//       );
//     }

//     setFilteredInvoices(filtered);
//   };

//   const loadSalesSummary = async () => {
//     setSummaryLoading(true);
//     try {
//       const periodDays = getPeriodDays(filters.period);
//       const data = await getSalesSummary(periodDays.toString());

//       if (!data || !data.overall_summary) {
//         throw new Error("Invalid data structure received");
//       }

//       setSalesSummary(data);
//     } catch (error) {
//       console.error("Error loading sales summary:", error);
//       setSalesSummary(null);
//     } finally {
//       setSummaryLoading(false);
//     }
//   };

//   const loadInvoices = async () => {
//     setInvoicesLoading(true);
//     try {
//       let dateFrom: string;
//       let dateTo: string = new Date().toISOString().split("T")[0];

//       if (
//         filters.period === "custom" &&
//         customDateRange &&
//         customDateRange.start &&
//         customDateRange.end
//       ) {
//         dateFrom = customDateRange.start;
//         dateTo = customDateRange.end;
//       } else {
//         dateFrom = getDateFromPeriod(filters.period);
//       }

//       const params = {
//         status: filters.status || undefined,
//         payment_method: filters.payment_method || undefined,
//         search: filters.search || undefined,
//         date_from: dateFrom,
//         date_to: dateTo,
//       };

//       const data = await getInvoices(params);
//       setInvoices(data);
//     } catch (error) {
//       console.error("Error loading invoices:", error);
//       setInvoices(null);
//     } finally {
//       setInvoicesLoading(false);
//     }
//   };

//   const getPeriodDays = (period: PeriodFilter): number => {
//     switch (period) {
//       case "1":
//       case "day":
//         return 1;
//       case "7":
//       case "week":
//         return 7;
//       case "30":
//       case "month":
//         return 30;
//       case "45":
//         return 45;
//       case "90":
//       case "6months":
//         return 90;
//       case "custom":
//         return 30; // Default fallback
//       default:
//         return 30;
//     }
//   };

//   const formatCurrency = (amount: number | string) => {
//     return new Intl.NumberFormat("en-KE", {
//       style: "currency",
//       currency: "KES",
//     }).format(Number(amount));
//   };

//   const getDateFromPeriod = (period: PeriodFilter): string => {
//     const today = new Date();
//     let daysAgo: number;

//     switch (period) {
//       case "1":
//       case "day":
//         daysAgo = 1;
//         break;
//       case "7":
//       case "week":
//         daysAgo = 7;
//         break;
//       case "30":
//       case "month":
//         daysAgo = 30;
//         break;
//       case "45":
//         daysAgo = 45;
//         break;
//       case "90":
//       case "6months":
//         daysAgo = 90;
//         break;
//       default:
//         daysAgo = 30;
//     }

//     const date = new Date(today);
//     date.setDate(date.getDate() - daysAgo);
//     return date.toISOString().split("T")[0];
//   };

//   const handleFiltersChange = (newFilters: FilterOptions) => {
//     setFilters(newFilters);
//   };

//   // Receive custom date range from child component
//   const handleCustomDateRange = (start: string, end: string) => {
//     if (start && end) {
//       setCustomDateRange({ start, end });
//     } else {
//       setCustomDateRange(null);
//     }
//   };

//   useEffect(() => {
//     setLoading(false);
//   }, []);

//   return (
//     <>
//       {/* Sales Stats Cards */}
//       <SalesStatsCards
//         filteredTotals={filteredTotals}
//         formatCurrency={formatCurrency}
//       />

//       {/* Sales Filters */}
//       <SalesFilters
//         filters={filters}
//         onFiltersChange={handleFiltersChange}
//         totalInvoices={allInvoices.length}
//         filteredInvoices={filteredInvoices}
//         filterLoading={invoicesLoading}
//         onCustomDateRange={handleCustomDateRange}
//       />

//       {/* Invoices List */}
//       <InvoicesList
//         invoices={filteredInvoices}
//         loading={invoicesLoading || loading}
//       />
//     </>
//   );
// }
"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { SalesFilters, InvoicesList, SalesStatsCards } from "./components";
import {
  SalesSummary,
  InvoicesResponse,
  FilterOptions,
  PeriodFilter,
  Invoice,
} from "./types";
import { getInvoices } from "@/app/api/invoices";
import { getSalesSummary } from "@/app/api/invoices/sales_summary";
import { toast } from "react-toastify";
import { getRecentInvoices, getAllInvoices } from "@/app/api/sales";
import { invoiceCache, CACHE_KEYS } from "@/lib/utils/invoiceCache";

const AUTO_REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export default function Sales() {
  const [salesSummary, setSalesSummary] = useState<SalesSummary | null>(null);
  const [invoices, setInvoices] = useState<InvoicesResponse | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    period: "30",
  });
  const [loading, setLoading] = useState(true);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [invoicesLoading, setInvoicesLoading] = useState(true);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
  const [customDateRange, setCustomDateRange] = useState<{
    start: string;
    end: string;
  } | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const filteredTotals = useMemo(() => {
    const totals = {
      totalAmount: 0,
      totalPaid: 0,
      totalTax: 0,
      totalDiscount: 0,
      invoiceCount: filteredInvoices.length,
    };

    filteredInvoices.forEach((invoice) => {
      totals.totalAmount += Number(invoice.total_amount) || 0;
      totals.totalPaid += Number(invoice.amount_paid) || 0;
      totals.totalTax += Number(invoice.tax_amount) || 0;
      totals.totalDiscount += Number(invoice.discount_amount) || 0;
    });

    return totals;
  }, [filteredInvoices]);

  // Helper function (must be defined before useCallback functions that use it)
  const getPeriodDays = useCallback((period: PeriodFilter): number => {
    switch (period) {
      case "1":
      case "day":
        return 1;
      case "7":
      case "week":
        return 7;
      case "30":
      case "month":
        return 30;
      case "45":
        return 45;
      case "90":
      case "6months":
        return 90;
      case "custom":
        return 30;
      default:
        return 30;
    }
  }, []);

  // Load sales summary with caching
  const loadSalesSummary = useCallback(
    async (forceRefresh: boolean = false) => {
      setSummaryLoading(true);
      try {
        const periodDays = getPeriodDays(filters.period);
        const data = await getSalesSummary(periodDays.toString(), forceRefresh);

        if (!data || !data.overall_summary) {
          throw new Error("Invalid data structure received");
        }

        setSalesSummary(data);
      } catch (error) {
        console.error("Error loading sales summary:", error);
        setSalesSummary(null);
        toast.error("Failed to load sales summary");
      } finally {
        setSummaryLoading(false);
      }
    },
    [filters.period, getPeriodDays]
  );

  // Fetch invoices with caching
  const fetchInvoices = useCallback(
    async (forceRefresh: boolean = false) => {
      try {
        setInvoicesLoading(true);
        const response = await getAllInvoices(forceRefresh);
        setAllInvoices(response.results);

        if (initialLoad) {
          setFilteredInvoices(response.results);
          setInitialLoad(false);
        }

        setLastRefresh(new Date());

        if (forceRefresh) {
          toast.success("Invoices refreshed successfully");
        }
      } catch (error) {
        console.error("Error fetching invoices:", error);
        toast.error("Failed to load invoices");
      } finally {
        setInvoicesLoading(false);
        setLoading(false);
      }
    },
    [initialLoad]
  );

  // Manual refresh function
  const handleManualRefresh = useCallback(async () => {
    setIsRefreshing(true);

    // Invalidate cache
    invoiceCache.invalidate(CACHE_KEYS.ALL_INVOICES);

    // Fetch fresh data
    await Promise.all([fetchInvoices(true), loadSalesSummary(true)]);

    setIsRefreshing(false);
  }, [fetchInvoices, loadSalesSummary]);

  // Auto-refresh setup - runs only once on mount
  useEffect(() => {
    // Initial load
    const initializeData = async () => {
      try {
        await fetchInvoices(false);
        await loadSalesSummary(false);
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    };

    initializeData();

    // Set up auto-refresh interval
    refreshIntervalRef.current = setInterval(() => {
      console.log("🔄 Auto-refreshing invoices (5 minutes elapsed)");
      fetchInvoices(true);
      loadSalesSummary(true);
    }, AUTO_REFRESH_INTERVAL);

    // Cleanup interval on unmount
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [fetchInvoices, loadSalesSummary]);

  // Reload summary when period changes (but not on initial load)
  useEffect(() => {
    if (!initialLoad) {
      loadSalesSummary(false);
    }
  }, [filters.period, customDateRange, loadSalesSummary, initialLoad]);

  // Apply filters whenever they change
  useEffect(() => {
    if (!initialLoad) {
      applyFilters();
    }
  }, [filters, allInvoices, customDateRange, initialLoad]);

  const applyFilters = () => {
    let filtered = [...allInvoices];

    if (
      filters.period === "custom" &&
      customDateRange &&
      customDateRange.start &&
      customDateRange.end
    ) {
      const startDate = new Date(customDateRange.start);
      const endDate = new Date(customDateRange.end);
      endDate.setHours(23, 59, 59, 999);

      filtered = filtered.filter((invoice) => {
        const invoiceDate = new Date(invoice.created_at);
        return invoiceDate >= startDate && invoiceDate <= endDate;
      });
    } else if (filters.period !== "custom") {
      const now = new Date();
      let startFilterDate: Date;

      switch (filters.period) {
        case "1":
          startFilterDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
          break;
        case "7":
        case "week":
          startFilterDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "30":
        case "month":
          startFilterDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "45":
          startFilterDate = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000);
          break;
        case "90":
        case "6months":
          startFilterDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case "day":
          startFilterDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
          break;
        default:
          startFilterDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      }

      filtered = filtered.filter((invoice) => {
        const invoiceDate = new Date(invoice.created_at);
        return invoiceDate >= startFilterDate;
      });
    }

    // Apply status filter
    if (filters.status) {
      filtered = filtered.filter(
        (invoice) =>
          invoice.status?.toLowerCase() === filters.status?.toLowerCase()
      );
    }

    // Apply payment method filter
    if (filters.payment_method) {
      filtered = filtered.filter(
        (invoice) =>
          invoice.payment_method?.toLowerCase() ===
          filters.payment_method?.toLowerCase()
      );
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (invoice) =>
          invoice.invoice_number?.toLowerCase().includes(searchLower) ||
          invoice.customer_name?.toLowerCase().includes(searchLower) ||
          invoice.customer?.name?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredInvoices(filtered);
  };

  const formatCurrency = (amount: number | string) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(Number(amount));
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleCustomDateRange = (start: string, end: string) => {
    if (start && end) {
      setCustomDateRange({ start, end });
    } else {
      setCustomDateRange(null);
    }
  };

  return (
    <>
      {/* Sales Stats Cards */}
      <SalesStatsCards
        filteredTotals={filteredTotals}
        formatCurrency={formatCurrency}
        lastRefresh={lastRefresh}
        onRefresh={handleManualRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Sales Filters */}
      <SalesFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        totalInvoices={allInvoices.length}
        filteredInvoices={filteredInvoices}
        filterLoading={invoicesLoading}
        onCustomDateRange={handleCustomDateRange}
      />

      {/* Invoices List */}
      <InvoicesList
        invoices={filteredInvoices}
        loading={invoicesLoading || loading}
      />
    </>
  );
}
