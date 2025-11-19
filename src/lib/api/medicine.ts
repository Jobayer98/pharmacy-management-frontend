import api from "./axios";

export interface MedicinePayload {
    name: string;
    generic_name?: string | null;
    brand?: string | null;
    category?: string | null;
    unit?: string | null;
    strength: string;
}

export interface MedicineResponse {
    id: number;
    name: string;
    generic_name: string | null;
    brand: string | null;
    category: string | null;
    unit: string | null;
    strength: string;
    price: number;
    expiry_date: string;
    barcode?: string | null;
}

export interface MedicinePaginationResponse {
    items: MedicineResponse[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

// CREATE MEDICINE
export async function createMedicine(payload: MedicinePayload) {
    const res = await api.post("/medicines/create", payload);
    return res.data.data as MedicineResponse;
}

// GET ALL MEDICINES WITH PAGINATION
export async function getMedicines(page: number = 1, limit: number = 10, search?: string) {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
    });

    if (search) {
        params.append('search', search);
    }

    const res = await api.get(`/medicines?${params.toString()}`);
    return res.data.data as MedicinePaginationResponse;
}

// UPDATE
export async function updateMedicine(id: number, payload: MedicinePayload) {
    const res = await api.put(`/medicines/${id}`, payload);
    return res.data.data;
}

// DELETE
export async function deleteMedicine(id: number) {
    const res = await api.delete(`/medicines/${id}`);
    return res.data.data;
}
