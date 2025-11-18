// lib/api/dashboard.ts
import api from "./axios";

export interface TodaySummary {
    date: string;
    total_sales: number;
    total_purchases: number;
    total_invoices: number;
    total_items_sold: number;
}

export interface InventorySummary {
    low_stock: { medicine_id: number; medicine_name: string; quantity: number }[];
    near_expiry: {
        batch_id: number;
        medicine_id: number;
        batch_no: string;
        expiry_date: string;
        quantity: number;
    }[];
    total_stock_value: number;
}

export interface DayAmount {
    date: string;
    amount: number;
}

export interface MonthlyReport {
    year: number;
    month: number;
    total_amount: number;
    daily_breakdown: { date: string; total: number }[];
}

export interface SaleItemShort {
    id: number;
    invoice_number: string;
    customer_name: string;
    sale_date: string;
    total_amount: number;
}

export interface SalesListResponse {
    items: SaleItemShort[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        pages: number;
    };
}

export async function getTodaySummary() {
    const res = await api.get("/dashboard/today");
    return res.data.data as TodaySummary;
}

export async function getInventorySummary() {
    const res = await api.get("/dashboard/inventory");
    return res.data.data as InventorySummary;
}

export async function getSales7Days() {
    const res = await api.get("/dashboard/sales-7-days");
    return res.data.data as DayAmount[];
}

export async function getDailyReport(day: string) {
    const res = await api.get("/reports/sales/daily", { params: { day } });
    return res.data.data as { date: string; total_amount: number; total_items: number };
}

export async function getMonthlyReport(year: number, month: number) {
    const res = await api.get("/reports/sales/monthly", { params: { year, month } });
    return res.data.data as MonthlyReport;
}

export async function getRecentSales(page = 1, limit = 5) {
    const res = await api.get("/sales", { params: { page, limit } });
    return res.data.data as SalesListResponse;
}

export async function getExpiredItem(){
    const res = await api.get("/inventory/expired");
    return res.data.data as {
        batch_id: number;
        medicine_id: number;
        batch_no: string;
        expiry_date: string;
        quantity: number;
    }[];

}