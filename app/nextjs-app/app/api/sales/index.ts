import { NextRequest, NextResponse } from "next/server";
import api from "../auth";
import { invoiceCache, CACHE_KEYS } from "@/lib/utils/invoiceCache";

// Import existing API functions
import { getInvoices, getInvoiceById, createInvoice } from "../invoices";
import { getInventory } from "../inventory";
import { getSalesSummary } from "../invoices/sales_summary";

// Re-export types for convenience
export type { Invoice, InvoicesResponse, CreateInvoiceData } from "../invoices";
export type { InventoryResponse } from "../inventory";
export type { SalesSummary } from "../invoices/sales_summary";

// Sales-specific API functions
export const getSalesStats = async (periodDays: string = "30") => {
  try {
    return await getSalesSummary(periodDays);
  } catch (error) {
    throw new Error("Failed to fetch sales statistics.");
  }
};

export const getRecentInvoices = async (
  limit: number = 10,
  forceRefresh: boolean = false
) => {
  try {
    console.log("🔄 Fetching recent invoices from API");
    const response = await getInvoices({ page: "1" });

    if (Array.isArray(response?.results) && response.results.length) {
      response.results = response.results.slice(0, limit);
    }

    return response;
  } catch (error) {
    throw new Error("Failed to fetch recent invoices.");
  }
};

export const getAllInvoices = async (forceRefresh: boolean = false) => {
  try {
    console.log("🔄 Fetching fresh invoices from API");
    const response = await getInvoices({});

    if (Array.isArray(response?.results) && response.results.length) {
      response.results = response.results.slice(0, response.count);
    }

    return response;
  } catch (error) {
    throw new Error("Failed to fetch all invoices.");
  }
};

export const getProductsForSale = async (search?: string) => {
  try {
    const response = await getInventory({
      search,
      // limit: '100' // Get more products for sale
    });
    return response;
  } catch (error) {
    throw new Error("Failed to fetch products for sale.");
  }
};

export const createSalesInvoice = async (invoiceData: any) => {
  try {
    return await createInvoice(invoiceData);
  } catch (error) {
    throw new Error("Failed to create sales invoice.");
  }
};

export const getInvoiceForPreview = async (invoiceId: number) => {
  try {
    return await getInvoiceById(invoiceId);
  } catch (error) {
    throw new Error("Failed to fetch invoice for preview.");
  }
};

// API Route Handlers for sales-specific endpoints
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    switch (action) {
      case "stats":
        const periodDays = searchParams.get("period_days") || "30";
        const stats = await getSalesStats(periodDays);
        return NextResponse.json(stats);

      case "recent_invoices":
        const limit = searchParams.get("limit") || "10";
        const invoices = await getRecentInvoices(parseInt(limit));
        return NextResponse.json(invoices);

      case "products":
        const search = searchParams.get("search") || undefined;
        const products = await getProductsForSale(search);
        return NextResponse.json(products);

      default:
        return NextResponse.json(
          { error: "Invalid action parameter" },
          { status: 400 }
        );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to process sales request" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action;

    switch (action) {
      case "create_invoice":
        const { invoiceData } = body;
        const invoice = await createSalesInvoice(invoiceData);
        return NextResponse.json(invoice, { status: 201 });

      case "get_invoice_preview":
        const { invoiceId } = body;
        const previewInvoice = await getInvoiceForPreview(invoiceId);
        return NextResponse.json(previewInvoice);

      default:
        return NextResponse.json(
          { error: "Invalid action parameter" },
          { status: 400 }
        );
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to process sales request" },
      { status: 500 }
    );
  }
}
