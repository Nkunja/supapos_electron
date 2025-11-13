import { NextRequest, NextResponse } from 'next/server';
import api from '../auth';

export interface InvoiceItem {
  id: number;
  product: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  customer_name: string;
  customer_phone: string;
  items: InvoiceItem[];
  subtotal: number;
  tax_amount: number;
  total_amount: number;
  payment_method: string;
  status: string;
  created_by: number;
  created_by_name: string;
  shop: number;
  shop_name: string;
  created_at: string;
  updated_at: string;
}

export interface InvoicesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Invoice[];
}

export interface CreateInvoiceData {
  customer_name: string;
  customer_phone: string;
  items: {
    product: number;
    quantity: number;
    unit_price: number;
  }[];
  payment_method: string;
  shop?: number;
}

export interface UpdateInvoiceData {
  customer_name?: string;
  customer_phone?: string;
  items?: {
    product: number;
    quantity: number;
    unit_price: number;
  }[];
  payment_method?: string;
  status?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ||  'https://pharmasys.sirnkunja.co.ke/';
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pharmacy-suite.onrender.com/';

const API_URL = `${API_BASE_URL}api/invoices/`;

// Core API functions
export const getInvoices = async (params?: {
  page?: string;
  search?: string;
  status?: string;
  date_from?: string;
  date_to?: string;
  shop?: string;
}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.status) queryParams.append('status', params.status);
    if (params?.date_from) queryParams.append('date_from', params.date_from);
    if (params?.date_to) queryParams.append('date_to', params.date_to);
    if (params?.shop) queryParams.append('shop', params.shop);

    const url = queryParams.toString() ? `${API_URL}?${queryParams.toString()}` : API_URL;
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch invoices.");
  }
};

export const getInvoiceById = async (invoiceId: number) => {
  try {
    const response = await api.get(`${API_URL}${invoiceId}/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch invoice.");
  }
};

export const createInvoice = async (invoiceData: CreateInvoiceData) => {
  try {
    const response = await api.post(API_URL, invoiceData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to create invoice.");
  }
};

export const updateInvoice = async (invoiceId: number, invoiceData: UpdateInvoiceData) => {
  try {
    const response = await api.put(`${API_URL}${invoiceId}/`, invoiceData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to update invoice.");
  }
};

export const partialUpdateInvoice = async (invoiceId: number, invoiceData: Partial<UpdateInvoiceData>) => {
  try {
    const response = await api.patch(`${API_URL}${invoiceId}/`, invoiceData);
    return response.data;
  } catch (error) {
    throw new Error("Failed to update invoice.");
  }
};

export const deleteInvoice = async (invoiceId: number) => {
  try {
    const response = await api.delete(`${API_URL}${invoiceId}/`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete invoice.");
  }
};

// API Route Handlers
export async function GET(request: NextRequest) {
  try {
    const { pathname, searchParams } = new URL(request.url);
    const segments = pathname.split('/');
    
    // Check for specific invoice ID
    const invoiceId = segments[segments.length - 1];
    if (invoiceId && invoiceId !== 'invoices' && !isNaN(Number(invoiceId))) {
      const invoice = await getInvoiceById(Number(invoiceId));
      return NextResponse.json(invoice);
    }

    // Get query parameters
    const page = searchParams.get('page') || undefined;
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const dateFrom = searchParams.get('date_from') || undefined;
    const dateTo = searchParams.get('date_to') || undefined;
    const shop = searchParams.get('shop') || undefined;

    // Get all invoices with filters
    const invoices = await getInvoices({ 
      page, 
      search, 
      status, 
      date_from: dateFrom, 
      date_to: dateTo, 
      shop 
    });
    return NextResponse.json(invoices);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const invoice = await createInvoice(body);
    return NextResponse.json(invoice, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create invoice' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...invoiceData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    const invoice = await updateInvoice(id, invoiceData);
    return NextResponse.json(invoice);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update invoice' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...invoiceData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    const invoice = await partialUpdateInvoice(id, invoiceData);
    return NextResponse.json(invoice);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update invoice' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Invoice ID is required' },
        { status: 400 }
      );
    }

    await deleteInvoice(Number(id));
    return NextResponse.json({ message: 'Invoice deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete invoice' },
      { status: 500 }
    );
  }
} 