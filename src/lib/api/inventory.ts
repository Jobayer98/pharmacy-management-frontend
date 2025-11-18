import api from "./axios";

// 1. Main inventory item
export interface InventoryItem {
    medicine_id: number;
    medicine_name: string;
    quantity: number;
}

// 2. Low stock item
export interface LowStockItem {
    medicine_id: number;
    name: string;
    total_stock: number;
}

// 3. Near expiry batch
export interface NearExpiryItem {
    batch_id: number;
    medicine_id: number;
    batch_no: string;
    expiry_date: string;
    quantity: number;
}

// 4. Expired batch
export interface ExpiredBatchItem {
    batch_id: number;
    medicine_id: number;
    batch_no: string;
    expiry_date: string;
    quantity: number;
}

// GET /inventory
export async function getInventory(params?: {
    page?: number;
    limit?: number;
}) {
    const res = await api.get("/inventory", { params });

    return {
        items: res.data.data.items as InventoryItem[],
        pagination: res.data.data.pagination,
    };
}

// GET /inventory/medicine/{id}
export async function getInventoryDetail(id: number) {
    const res = await api.get(`/inventory/medicine/${id}`);
    return res.data.data;
}

// GET /inventory/low
export async function getLowStock() {
    const res = await api.get("/inventory/low");
    return res.data.data as LowStockItem[];
}

// GET /inventory/near-expiry
export async function getNearExpiry() {
    const res = await api.get("/inventory/near-expiry");
    return res.data.data as NearExpiryItem[];
}

// GET /inventory/expired
export async function getExpiredStock() {
    const res = await api.get("/inventory/expired");
    return res.data.data as ExpiredBatchItem[];
}
