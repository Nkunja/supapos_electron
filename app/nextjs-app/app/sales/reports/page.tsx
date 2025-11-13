"use client";

import { useState, useEffect } from "react";
import { RotateCcw, RefreshCw, Search, Filter } from "lucide-react";
import { toast } from "react-toastify";

// Import components - reusing ReportsTab for invoice data display
import { ReportsTab } from "../components/ReportsTab";

// Import types
import { SalesStats, Invoice } from "../types";

// Import centralized API functions
import { getSalesStats, getAllInvoices } from "@/app/api/sales";

export default function ReturnsPage() {
  const [salesStats, setSalesStats] = useState<SalesStats | null>(null);
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "completed" | "returned"
  >("all");

  useEffect(() => {
    loadReturnsData();
    loadAllInvoices();
  }, []);

  const loadReturnsData = async () => {
    setLoadingStats(true);
    try {
      const data = await getSalesStats("30");
      setSalesStats(data);
    } catch (error) {
      console.error("Error loading returns data:", error);
      toast.error("Failed to load returns statistics");
      setSalesStats({
        shop: { id: 1, name: "Business" },
        period_days: 30,
        summary: {
          total_sales: 0,
          total_invoices: 0,
          total_items_sold: 0,
          average_invoice_value: 0,
        },
        top_products: [],
      });
    } finally {
      setLoadingStats(false);
    }
  };

  const loadAllInvoices = async () => {
    setLoadingInvoices(true);
    try {
      const data = await getAllInvoices(true); // Force refresh to get latest data
      setAllInvoices(data.results || []);
      toast.success(`Loaded ${data.results?.length || 0} invoices`);
    } catch (error) {
      console.error("Error loading all invoices:", error);
      toast.error("Failed to load invoices");
      setAllInvoices([]);
    } finally {
      setLoadingInvoices(false);
    }
  };

  const handleRefreshReturns = async () => {
    toast.info("Refreshing returns data...");
    await Promise.all([loadReturnsData(), loadAllInvoices()]);
    toast.success("Returns data refreshed successfully");
  };

  const handleProcessReturn = (invoiceId: string) => {
    // TODO: Implement return processing logic
    toast.success(`Processing return for invoice #${invoiceId}`);
  };

  const filteredInvoices = allInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.invoice_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.customer_name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || invoice.status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <ReportsTab
          salesStats={salesStats}
          recentInvoices={allInvoices}
          loadingInvoices={loadingInvoices}
          onRefreshInvoices={loadAllInvoices}
        />
      </div>
    </div>
  );
}
