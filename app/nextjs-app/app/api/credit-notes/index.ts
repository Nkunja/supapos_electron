import { NextRequest, NextResponse } from 'next/server';
import api from '../auth';

export interface CreditNoteItem {
  id: string;
  inventory: number;
  product_name: string;
  product_form: string;
  quantity: number;
  unit_price: string;
  total_price: string;
  available_stock: number;
}

export interface CreditNote {
  id: string;
  credit_note_number: string;
  invoice: string;
  original_invoice_number: string;
  shop: number;
  shop_name: string;
  created_by: number;
  created_by_name: string;
  customer_name: string;
  customer_phone: string;
  subtotal: string;
  tax_amount: string;
  discount_amount: string;
  total_amount: string;
  notes: string;
  items: CreditNoteItem[];
  created_at: string;
  updated_at: string;
}

export interface CreditNotesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: CreditNote[];
}

export interface CreateCreditNoteData {
  invoice_id: string;
  notes?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://pharmasys.sirnkunja.co.ke/';
const API_URL = `${API_BASE_URL}api/credit-notes/`;

// Core API functions
export const getCreditNotes = async (params?: {
  page?: string;
  search?: string;
  date_from?: string;
  date_to?: string;
  shop?: string;
}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.date_from) queryParams.append('date_from', params.date_from);
    if (params?.date_to) queryParams.append('date_to', params.date_to);
    if (params?.shop) queryParams.append('shop', params.shop);

    const url = queryParams.toString() ? `${API_URL}?${queryParams.toString()}` : API_URL;
    const response = await api.get(url);
    return response.data as CreditNotesResponse;
  } catch (error) {
    throw new Error("Failed to fetch credit notes.");
  }
};

export const getCreditNoteById = async (creditNoteId: string) => {
  try {
    const response = await api.get(`${API_URL}${creditNoteId}/`);
    return response.data as CreditNote;
  } catch (error) {
    throw new Error("Failed to fetch credit note.");
  }
};


export const createCreditNote = async (creditNoteData: CreateCreditNoteData) => {
  try {
    const response = await api.post(API_URL, creditNoteData);
    return response.data;
  } catch (error: any) {
    if (error.response?.data) {
      return error.response.data; 
    }
    throw error; 
  }
};

// API Route Handlers
export async function GET(request: NextRequest) {
  try {
    const { pathname, searchParams } = new URL(request.url);
    const segments = pathname.split('/');
    
    // Check for specific credit note ID
    const creditNoteId = segments[segments.length - 1];
    if (creditNoteId && creditNoteId !== 'credit-notes') {
      const creditNote = await getCreditNoteById(creditNoteId);
      return NextResponse.json(creditNote);
    }

    // Get query parameters
    const page = searchParams.get('page') || undefined;
    const search = searchParams.get('search') || undefined;
    const dateFrom = searchParams.get('date_from') || undefined;
    const dateTo = searchParams.get('date_to') || undefined;
    const shop = searchParams.get('shop') || undefined;

    // Get all credit notes with filters
    const creditNotes = await getCreditNotes({ 
      page, 
      search, 
      date_from: dateFrom, 
      date_to: dateTo, 
      shop 
    });
    return NextResponse.json(creditNotes);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch credit notes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const creditNote = await createCreditNote(body);
    return NextResponse.json(creditNote, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create credit note' },
      { status: 500 }
    );
  }
}