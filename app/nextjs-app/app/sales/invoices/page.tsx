"use client";
import { useState, useEffect, useMemo } from "react";
import { toast } from "react-toastify";
import { Invoice } from "../types";
import { getAllInvoices } from "@/app/api/sales";
import { createCreditNote } from "@/app/api/credit-notes";
import InvoiceFilter from "./InvoiceFilter";
import InvoiceSummary from "./InvoiceSummary";
import InvoiceList from "./InvoiceList";
import ViewInvoiceModal from "./ViewInvoiceModal";
import CreditNoteModal from "./CreditNoteModal";
import { Receipt } from "lucide-react";

export default function InvoicesPage() {
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [creditNoteModalOpen, setCreditNoteModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [creditNoteNotes, setCreditNoteNotes] = useState("");
  const [creatingCreditNote, setCreatingCreditNote] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("30");
  const [showCustomRange, setShowCustomRange] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCustomRange, setIsCustomRange] = useState(false);

  // Calculate totals for filtered invoices
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

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await getAllInvoices();
        setAllInvoices(response.results);
        setFilteredInvoices(response.results);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching invoices:", error);
        toast.error("Failed to load invoices");
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const formatCurrency = (amount: number | string) => {
    return new Intl.NumberFormat("en-KE", {
      style: "currency",
      currency: "KES",
    }).format(Number(amount));
  };

  const handleCreateCreditNote = async () => {
    if (!selectedInvoice) return;
    setCreatingCreditNote(true);

    try {
      const response = await createCreditNote({
        invoice_id: selectedInvoice.id,
        notes: creditNoteNotes,
      });

      if (response && response.credit_note) {
        toast.success(
          `Credit note ${response.credit_note.credit_note_number} created successfully`
        );
        const updatedInvoices = await getAllInvoices();
        setAllInvoices(updatedInvoices.results);
        if (isCustomRange && startDate && endDate) {
          filterInvoicesByDateRange(startDate, endDate);
        } else {
          filterInvoicesByPeriod(selectedPeriod);
        }
        setCreditNoteModalOpen(false);
        setCreditNoteNotes("");
        setSelectedInvoice(null);
      } else {
        const errorMsg =
          response?.invoice?.[0] ||
          response?.message ||
          "Failed to create credit note";
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Error creating credit note:", error);
      toast.error("Failed to create credit note");
    } finally {
      setCreatingCreditNote(false);
    }
  };

  const filterInvoicesByPeriod = (period: string) => {
    setFilterLoading(true);
    const now = new Date();
    let startFilterDate: Date;

    switch (period) {
      case "1":
        startFilterDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate()
        );
        break;
      case "last_7_days":
        startFilterDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30":
        startFilterDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "45":
        startFilterDate = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000);
        break;
      case "90":
        startFilterDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        setFilteredInvoices(allInvoices);
        setFilterLoading(false);
        return;
    }

    const filtered = allInvoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.created_at);
      return invoiceDate >= startFilterDate;
    });

    setTimeout(() => {
      setFilteredInvoices(filtered);
      setFilterLoading(false);
    }, 300);
  };

  const filterInvoicesByDateRange = (start: string, end: string) => {
    setFilterLoading(true);
    const startFilterDate = new Date(start);
    const endFilterDate = new Date(end);
    endFilterDate.setHours(23, 59, 59, 999);

    const filtered = allInvoices.filter((invoice) => {
      const invoiceDate = new Date(invoice.created_at);
      return invoiceDate >= startFilterDate && invoiceDate <= endFilterDate;
    });

    setTimeout(() => {
      setFilteredInvoices(filtered);
      setFilterLoading(false);
    }, 300);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">
            Manage and track all your invoices
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Receipt className="h-4 w-4" />
          <span>
            {filteredInvoices.length} of {allInvoices.length} invoices
          </span>
        </div>
      </div>

      <InvoiceSummary
        filteredTotals={filteredTotals}
        formatCurrency={formatCurrency}
      />

      <InvoiceFilter
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
        showCustomRange={showCustomRange}
        setShowCustomRange={setShowCustomRange}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        isCustomRange={isCustomRange}
        setIsCustomRange={setIsCustomRange}
        filterLoading={filterLoading}
        filterInvoicesByPeriod={filterInvoicesByPeriod}
        filterInvoicesByDateRange={filterInvoicesByDateRange}
      />

      <InvoiceList
        filteredInvoices={filteredInvoices}
        loading={loading}
        formatCurrency={formatCurrency}
        setSelectedInvoice={setSelectedInvoice}
        setViewModalOpen={setViewModalOpen}
        setCreditNoteModalOpen={setCreditNoteModalOpen}
      />

      <ViewInvoiceModal
        open={viewModalOpen}
        onOpenChange={setViewModalOpen}
        selectedInvoice={selectedInvoice}
        formatCurrency={formatCurrency}
      />

      <CreditNoteModal
        open={creditNoteModalOpen}
        onOpenChange={setCreditNoteModalOpen}
        selectedInvoice={selectedInvoice}
        creditNoteNotes={creditNoteNotes}
        setCreditNoteNotes={setCreditNoteNotes}
        creatingCreditNote={creatingCreditNote}
        handleCreateCreditNote={handleCreateCreditNote}
        formatCurrency={formatCurrency}
      />
    </div>
  );
}
