import api from "./axios";

export interface SupplierPayload {
    name: string;
    company_name: string;
    phone: string;
    email: string;
    address: string;
}

export interface SupplierResponse {
    id: number;
    name: string;
    company_name: string;
    phone: string;
    email: string;
    address: string;
}

export async function getSuppliers(params?: {
    search?: string;
    page?: number;
    limit?: number;
}) {
    const res = await api.get("/suppliers", { params });

    return {
        items: res.data.data.items as SupplierResponse[],
        pagination: res.data.data.pagination,
    };
}

export async function createSupplier(payload: SupplierPayload) {
    const res = await api.post("/suppliers/create", payload);
    return res.data.data as SupplierResponse;
}
