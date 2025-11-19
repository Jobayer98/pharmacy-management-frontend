import api from "./axios";

export interface BatchPayload {
    batch_no: string;
    expiry_date: string;
    purchase_price: number;
    selling_price: number;
    quantity: number;
    medicine_id: number;
}

export interface BatchResponse {
    id: number;
    batch_no: string;
    expiry_date: string;
    purchase_price: number;
    selling_price: number;
    quantity: number;
    medicine_id: number;
    medicine_name?: string;
}

export interface BatchPaginationResponse {
    items: BatchResponse[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export async function createBatch(payload: BatchPayload) {
    const res = await api.post("/batches/create", payload);
    return res.data.data as BatchResponse;
}

export async function getBatches(page: number = 1, limit: number = 10, search?: string) {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    if (search) {
        params.append('search', search);
    }

    const res = await api.get(`/batches?${params.toString()}`);
    return res.data.data as BatchPaginationResponse;
}

export async function getBatch(id: number) {
    const res = await api.get(`/batches/${id}`);
    return res.data.data as BatchResponse;
}

export async function updateBatch(id: number, payload: BatchPayload) {
    const res = await api.put(`/batches/${id}`, payload);
    return res.data.data as BatchResponse;
}

export async function deleteBatch(id: number) {
    const res = await api.delete(`/batches/${id}`);
    return res.data.data;
}
