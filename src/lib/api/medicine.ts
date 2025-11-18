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
}

// CREATE MEDICINE
export async function createMedicine(payload: MedicinePayload) {
    const res = await api.post("/medicines/create", payload);
    return res.data.data as MedicineResponse;
}

// GET ALL MEDICINES
export async function getMedicines() {
    const res = await api.get("/medicines");
    console.log(res.data.data);
    return res.data.data.items as MedicineResponse[];
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
