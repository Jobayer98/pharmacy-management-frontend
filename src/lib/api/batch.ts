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

export async function createBatch(payload: BatchPayload) {
    const res = await api.post("/batches/create", payload);
    return res.data.data as BatchResponse;
}

export async function getBatches(params?: {
    page?: number;
    limit?: number;
    search?: string;
}) {
    const res = await api.get("/batches", { params });

    return {
        items: res.data.data.items as BatchResponse[],
        pagination: res.data.data.pagination,
    };
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
