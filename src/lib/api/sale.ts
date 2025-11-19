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