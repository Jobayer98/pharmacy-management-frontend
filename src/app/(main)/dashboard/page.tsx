"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { StatCard } from "@/components/StatCard";
import {
  getTodaySummary,
  getInventorySummary,
  getSales7Days,
  getMonthlyReport,
  getRecentSales,
  type DayAmount,
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
import { LowStockModal } from "@/components/dashboard/LowStockModal";
import { NearExpiryModal } from "@/components/dashboard/NearExpiryModal";

export default function DashboardPage() {
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [showLowStockModal, setShowLowStockModal] = useState(false);
  const [showNearExpiryModal, setShowNearExpiryModal] = useState(false);
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
  const { data: sales7 } = useQuery({
    queryKey: ["dashboard-sales-7"],
    queryFn: getSales7Days,
  });

  // Monthly report for selectedMonth
  const { data: monthly } = useQuery({
    queryKey: ["dashboard-monthly", selectedMonth.year, selectedMonth.month],
    queryFn: () => getMonthlyReport(selectedMonth.year, selectedMonth.month),
  });

  // Recent sales (first page, limit 3)
  const { data: recentSales, isLoading: loadingRecent } = useQuery({
    queryKey: ["recent-sales", 1, 3],
    queryFn: () => getRecentSales(1, 3),
  });

  // Expired items
  const { data: expired, isLoading: loadingExpired } = useQuery({
    queryKey: ["expired-items"],
    queryFn: () => getExpiredItem(),
  });

  // Recent purchases (first page, limit 3)
  const { data: recentPurchases, isLoading: loadingPurchases } = useQuery({
    queryKey: ["recent-purchases", 1, 3],
    queryFn: () => getPurchases({ page: 1, limit: 3 }),
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
        {/* Low Stock Card */}
        <Card className="border-l-4 border-l-yellow-500 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                  <svg
                    className="w-5 h-5 text-yellow-600 dark:text-yellow-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Low Stock
                  </p>
                  <h3 className="text-2xl font-bold text-yellow-600 dark:text-yellow-500">
                    {lowStockCount}
                  </h3>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setShowLowStockModal(true)}
            >
              View Details
            </Button>
          </CardContent>
        </Card>

        {/* Near Expiry Card */}
        <Card className="border-l-4 border-l-orange-500 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <svg
                    className="w-5 h-5 text-orange-600 dark:text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Near Expiry
                  </p>
                  <h3 className="text-2xl font-bold text-orange-600 dark:text-orange-500">
                    {nearExpiryCount}
                  </h3>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setShowNearExpiryModal(true)}
            >
              View Details
            </Button>
          </CardContent>
        </Card>

        {/* Expired Items Card */}
        <Card className="border-l-4 border-l-red-500 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <svg
                    className="w-5 h-5 text-red-600 dark:text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Expired Items
                  </p>
                  <h3 className="text-2xl font-bold text-red-600 dark:text-red-500">
                    {expiredCount}
                  </h3>
                </div>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setShowExpiredModal(true)}
            >
              View Details
            </Button>
          </CardContent>
        </Card>

        {/* Stock Value Card */}
        <Card className="border-l-4 border-l-green-500 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <svg
                    className="w-5 h-5 text-green-600 dark:text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Stock Value
                  </p>
                  <h3 className="text-2xl font-bold text-green-600 dark:text-green-500">
                    ৳ {totalStockValue.toLocaleString()}
                  </h3>
                </div>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Total estimated inventory value
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

      <LowStockModal
        open={showLowStockModal}
        onClose={() => setShowLowStockModal(false)}
        lowStock={inventory?.low_stock}
        isLoading={loadingInventory}
      />

      <NearExpiryModal
        open={showNearExpiryModal}
        onClose={() => setShowNearExpiryModal(false)}
        nearExpiry={inventory?.near_expiry}
        isLoading={loadingInventory}
      />

      <ExpiredModal
        open={showExpiredModal}
        onClose={() => setShowExpiredModal(false)}
        expired={expired}
        isLoading={loadingExpired}
      />
    </div>
  );
}
