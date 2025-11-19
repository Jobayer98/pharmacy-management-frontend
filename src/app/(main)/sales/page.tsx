"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getSalesByYear } from "@/lib/api/dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function SalesPage() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const { data, isLoading } = useQuery({
    queryKey: ["sales", selectedYear, currentPage, limit],
    queryFn: () => getSalesByYear(selectedYear, currentPage, limit),
  });

  const yearSummary = data?.year_summary;
  const salesItems = data?.items ?? [];
  const pagination = data?.pagination;

  // Generate year options (last 5 years)
  const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

  // Prepare monthly data for chart (aggregate by month)
  const monthlyData = salesItems.reduce((acc, sale) => {
    const month = new Date(sale.sale_date).toLocaleString("default", {
      month: "short",
    });
    const existing = acc.find((item) => item.month === month);
    if (existing) {
      existing.amount += sale.total_amount;
    } else {
      acc.push({ month, amount: sale.total_amount });
    }
    return acc;
  }, [] as { month: string; amount: number }[]);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (pagination && currentPage < pagination.pages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Sales Report</h1>

        {/* Year Selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Year:</span>
          <select
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-3 py-2 border rounded-md bg-background"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <svg
                  className="w-6 h-6 text-blue-600 dark:text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Sales</p>
                <h3 className="text-2xl font-bold">
                  {isLoading ? "..." : yearSummary?.total_sales ?? 0}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <svg
                  className="w-6 h-6 text-orange-600 dark:text-orange-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <h3 className="text-2xl font-bold">
                  {isLoading
                    ? "..."
                    : `৳ ${yearSummary?.total_sale_amount ?? 0}`}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <svg
                  className="w-6 h-6 text-green-600 dark:text-green-500"
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
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <h3 className="text-2xl font-bold">
                  {isLoading ? "..." : `৳ ${yearSummary?.total_revenue ?? 0}`}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <svg
                  className="w-6 h-6 text-purple-600 dark:text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Items Sold</p>
                <h3 className="text-2xl font-bold">
                  {isLoading ? "..." : yearSummary?.total_items_sold ?? 0}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Sales Overview - {selectedYear}
            </h3>
          </div>

          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="amount" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Sales List */}
      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold mb-4">Sales List</h3>

          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Invoice Number</th>
                      <th className="text-left py-3 px-4">Customer Name</th>
                      <th className="text-left py-3 px-4">Sale Date</th>
                      <th className="text-right py-3 px-4">Discount</th>
                      <th className="text-right py-3 px-4">Sub-total Amount</th>
                      <th className="text-right py-3 px-4">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salesItems.map((sale) => (
                      <tr key={sale.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">
                          {sale.invoice_number}
                        </td>
                        <td className="py-3 px-4">{sale.customer_name}</td>
                        <td className="py-3 px-4">{sale.sale_date}</td>
                        <td className="py-3 px-4 text-right">
                          ৳ {sale.discount_amount}
                        </td>
                        <td className="py-3 px-4 text-right">
                          ৳ {sale.subtotal}
                        </td>
                        <td className="py-3 px-4 text-right font-semibold">
                          ৳ {sale.total_amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {salesItems.length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  No sales found for {selectedYear}
                </p>
              )}

              {/* Pagination */}
              {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-muted-foreground">
                    Showing {(currentPage - 1) * limit + 1} to{" "}
                    {Math.min(currentPage * limit, pagination.total)} of{" "}
                    {pagination.total} results
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                        .filter(
                          (page) =>
                            page === 1 ||
                            page === pagination.pages ||
                            Math.abs(page - currentPage) <= 1
                        )
                        .map((page, idx, arr) => (
                          <>
                            {idx > 0 && arr[idx - 1] !== page - 1 && (
                              <span key={`ellipsis-${page}`} className="px-2">
                                ...
                              </span>
                            )}
                            <Button
                              key={page}
                              variant={
                                currentPage === page ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </Button>
                          </>
                        ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage === pagination.pages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
