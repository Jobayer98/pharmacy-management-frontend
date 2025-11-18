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
  items: PurchaseItemPayload[];
}

export async function createPurchase(payload: PurchasePayload) {
  const res = await api.post("/purchases/create", payload);
  return res.data.data as PurchaseResponse;
}

export async function getPurchases(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  const res = await api.get("/purchases", { params });
  return {
    items: res.data.data.items as PurchaseResponse[],
    pagination: res.data.data.pagination,
  };
}
