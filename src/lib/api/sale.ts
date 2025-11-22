import api from "./axios";

export interface SaleItemPayload {
  medicine_id: number;
  quantity: number;
}

export interface SalePayload {
  customer_name: string;
  discount_amount: number;
  items: SaleItemPayload[];
}

export interface SaleResponse {
  id: number,
  invoice_number: string,
  customer_name: string,
  sale_date: string,
  subtotal: number,
  discount_amount: number,
  total_amount: number,
  items: SaleItem[]
}

export interface SaleItem {
  id: number,
  invoice_number: string,
  customer_name: string
  sale_date: string,
  total_amount: number
}

export const checkout = async (payload: SalePayload) => {
  const response = await api.post("/sales/create", payload);
  return response.data.data as SaleResponse;
}

export const getSales = async () => {
  const response = await api.get('/sales');
  return response.data.data.items as SaleResponse[];
}

export const getSaleDetails = async (saleId: number) => {
  const response = await api.get(`/sales/${saleId}`);
  return response.data.data;
}

export interface POSMedicine {
  id: number;
  name: string;
  brand: string | null;
  category: string | null;
  strength: string;
  price: number;
  expiry_date: string;
  barcode: string | null;
  quantity: number;
}

export interface POSMedicinesResponse {
  items: POSMedicine[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export const getPOSMedicines = async (page: number = 1, limit: number = 20, search?: string) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) {
    params.append('search', search);
  }

  const response = await api.get(`/sales/pos/medicines?${params.toString()}`);
  return response.data.data as POSMedicinesResponse;
}