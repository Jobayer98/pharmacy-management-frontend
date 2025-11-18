"use client";

import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  getTodaySummary,
  getInventorySummary,
  getSales7Days,
  getMonthlyReport,
  getRecentSales,
  type DayAmount,
  type InventorySummary,
  type TodaySummary,
  type SalesListResponse,
  getExpiredItem,
} from "@/lib/api/dashboard";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getMedicines } from "@/lib/api/medicine";
import { getSuppliers } from "@/lib/api/supplier";
import { getPurchases } from "@/lib/api/purchase";
import { ExpiredModal } from "@/components/dashboard/ExpiredModal";

export default function DashboardPage() {
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [selectedMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() + 1 }; // 1-based month
  });

  // Fetch medicine
  const { data: medicines } = useQuery({
    queryKey: ["medicines"],
    queryFn: getMedicines,
  });

  const TOTAL_MEDICINES = medicines?.length;

  // Fetch suppliers
  const { data: suppliers } = useQuery({
    queryKey: ["suppliers"],
    queryFn: () => getSuppliers({ page: 1, limit: 10 }),
  });

  const TOTAL_SUPPLIERS = suppliers?.items?.length;

  // Today summary
  const { data: today, isLoading: loadingToday } = useQuery({
    queryKey: ["dashboard-today"],
    queryFn: getTodaySummary,
  });

  // Inventory summary
  const { data: inventory, isLoading: loadingInventory } = useQuery({
    queryKey: ["dashboard-inventory"],
    queryFn: getInventorySummary,
  });

  // Last 7 days sales
  const { data: sales7, isLoading: loading7 } = useQuery({
    queryKey: ["dashboard-sales-7"],
    queryFn: getSales7Days,
  });

  // Monthly report for selectedMonth
  const { data: monthly, isLoading: loadingMonthly } = useQuery({
    queryKey: ["dashboard-monthly", selectedMonth.year, selectedMonth.month],
    queryFn: () => getMonthlyReport(selectedMonth.year, selectedMonth.month),
  });

  // Recent sales (first page, limit 5)
  const { data: recentSales, isLoading: loadingRecent } = useQuery({
    queryKey: ["recent-sales", 1, 5],
    queryFn: () => getRecentSales(1, 5),
  });

  // Expired items
  const { data: expired, isLoading: loadingExpired } = useQuery({
    queryKey: ["expired-items"],
    queryFn: () => getExpiredItem(),
  });

  // Recent purchases (first page, limit 5)
  const { data: recentPurchases, isLoading: loadingPurchases } = useQuery({
    queryKey: ["recent-purchases", 1, 5],
    queryFn: () => getPurchases({ page: 1, limit: 5 }),
  });

  // derived numbers
  const lowStockCount = inventory?.low_stock?.length ?? 0;
  const nearExpiryCount = inventory?.near_expiry?.length ?? 0;
  const expiredCount = expired?.length ?? 0;
  const totalStockValue = inventory?.total_stock_value ?? 0;

  // prepare data for recharts (sales7)
  const sales7Data: DayAmount[] = sales7 ?? [];

  // monthly bar data fallback
  const monthlyData =
    monthly?.daily_breakdown?.map((d) => ({ date: d.date, total: d.total })) ??
    [];

  // total sales (sum last 7 or monthly total) — use today's total_sales if available
  const totalSales = today?.total_sales ?? monthly?.total_amount ?? 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {/* Stat cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Medicines"
          value={TOTAL_MEDICINES || 0}
          icon="Box"
        />
        <StatCard
          title="Total Suppliers"
          value={TOTAL_SUPPLIERS || 0}
          icon="Users"
        />
        <StatCard
          title="Today's Sales"
          value={loadingToday ? "..." : `৳ ${today?.total_sales ?? 0}`}
          icon="ShoppingCart"
        />
        <StatCard
          title="Items Sold Today"
          value={loadingToday ? "..." : today?.total_items_sold ?? 0}
          icon="FileText"
        />
      </div>

      {/* Inventory small cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Low Stock</p>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{lowStockCount}</h3>
              <Button variant="ghost" size="sm" onClick={() => {}}>
                View
              </Button>
            </div>
            <div className="mt-3 space-y-2">
              {inventory?.low_stock?.slice(0, 4).map((i) => (
                <div
                  key={i.medicine_id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{i.medicine_name}</div>
                    <div className="text-sm text-muted-foreground">
                      Qty: {i.quantity}
                    </div>
                  </div>
                  <StatusBadge qty={i.quantity} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Near Expiry</p>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{nearExpiryCount}</h3>
              <Button variant="ghost" size="sm" onClick={() => {}}>
                View
              </Button>
            </div>
            <div className="mt-3">
              {inventory?.near_expiry?.slice(0, 4).map((b) => (
                <div
                  key={b.batch_id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium">{b.batch_no}</div>
                    <div className="text-sm text-muted-foreground">
                      {b.expiry_date}
                    </div>
                  </div>
                  <div className="text-sm">{b.quantity}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Expired Items</p>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{expiredCount}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowExpiredModal(true)}
              >
                View
              </Button>
            </div>
            <div className="mt-3 space-y-2">
              {expired?.slice(0, 3).map((item) => (
                <div
                  key={item.batch_id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-sm">{item.batch_no}</div>
                    <div className="text-xs text-red-600">
                      Exp: {item.expiry_date}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Qty: {item.quantity}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <p className="text-sm text-muted-foreground">Stock Value</p>
            <h3 className="text-xl font-semibold">৳ {totalStockValue}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Estimated value of current stock
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 7-day line chart */}
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Sales — Last 7 Days</h3>
              <div className="text-sm text-muted-foreground">trend</div>
            </div>

            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <LineChart data={sales7Data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="amount"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Monthly bar chart */}
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Monthly Sales</h3>
              <div className="text-sm text-muted-foreground">
                {selectedMonth.month}/{selectedMonth.year}
              </div>
            </div>

            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="total" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sales + Recent Purchases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold mb-4">Recent Sales</h3>

            {loadingRecent && <p>Loading...</p>}

            <div className="space-y-3">
              {recentSales?.items?.map((s) => (
                <div key={s.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {s.invoice_number} — {s.customer_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {s.sale_date}
                    </div>
                  </div>
                  <div className="font-semibold">৳ {s.total_amount}</div>
                </div>
              ))}

              {recentSales?.items?.length === 0 && (
                <p className="text-sm text-muted-foreground">No recent sales</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold mb-4">Recent Purchases</h3>

            {loadingPurchases && <p>Loading...</p>}

            <div className="space-y-3">
              {recentPurchases?.items?.map((p) => (
                <div key={p.id} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {p.invoice_number} — {p.supplier_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {p.purchase_date}
                    </div>
                  </div>
                  <div className="font-semibold text-green-600">
                    ৳ {p.total_amount}
                  </div>
                </div>
              ))}

              {recentPurchases?.items?.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No recent purchases
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Summary */}
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardContent>
            <h3 className="text-lg font-semibold mb-4">Quick Summary</h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 rounded bg-gray-50 dark:bg-zinc-800">
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <div className="text-xl font-semibold">৳ {totalSales}</div>
              </div>

              <div className="p-3 rounded bg-gray-50 dark:bg-zinc-800">
                <p className="text-sm text-muted-foreground">Invoices Today</p>
                <div className="text-xl font-semibold">
                  {today?.total_invoices ?? 0}
                </div>
              </div>

              <div className="p-3 rounded bg-gray-50 dark:bg-zinc-800">
                <p className="text-sm text-muted-foreground">Today Purchases</p>
                <div className="text-xl font-semibold">
                  ৳ {today?.total_purchases ?? 0}
                </div>
              </div>

              <div className="p-3 rounded bg-gray-50 dark:bg-zinc-800">
                <p className="text-sm text-muted-foreground">
                  Items Sold Today
                </p>
                <div className="text-xl font-semibold">
                  {today?.total_items_sold ?? 0}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ExpiredModal
        open={showExpiredModal}
        onClose={() => setShowExpiredModal(false)}
        expired={expired}
        isLoading={loadingExpired}
      />
    </div>
  );
}
