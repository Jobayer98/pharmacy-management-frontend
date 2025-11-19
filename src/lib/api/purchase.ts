import api from "./axios";

export interface PurchaseItemPayload {
  medicine_id: number;
  batch_no: string;
  expiry_date: string;
  purchase_price: number;
  selling_price: number;
  quantity: number;
}

export interface PurchasePayload {
  invoice_number?: string;
  supplier_name: string;
  purchase_date: string;
  items: PurchaseItemPayload[];
}

export interface PurchaseResponse {
  id: number;
  invoice_number: string;
  supplier_name: string;
  purchase_date: string;
  total_amount: number;
  created_at: string;
}

export interface PurchaseDetailItem {
  id: number;
  medicine_id: number;
  batch_no: string;
  expiry_date: string;
  purchase_price: number;
  selling_price: number;
  quantity: number;
}

export interface PurchaseDetailResponse {
  id: number;
  invoice_number: string;
  supplier_name: string;
  purchase_date: string;
  total_amount: number;
  created_at: string;
  items: PurchaseDetailItem[];
}

export interface PurchasePaginationResponse {
  items: PurchaseResponse[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export async function createPurchase(payload: PurchasePayload) {
  const res = await api.post("/purchases/create", payload);
  return res.data.data as PurchaseDetailResponse;
}

export async function getPurchases(page: number = 1, limit: number = 10, search?: string) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (search) {
    params.append('search', search);
  }

  const res = await api.get(`/purchases?${params.toString()}`);
  return res.data.data as PurchasePaginationResponse;
}

export async function getPurchaseDetail(id: number) {
  const res = await api.get(`/purchases/${id}`);
  return res.data.data as PurchaseDetailResponse;
}
