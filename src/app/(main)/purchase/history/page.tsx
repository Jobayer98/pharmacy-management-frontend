"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { getPurchases } from "@/lib/api/purchase";
import { PurchaseDetailModal } from "@/components/purchase/PurchaseDetailModal";

export default function PurchaseHistoryPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState<number | null>(null);
  const limit = 10;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["purchases", currentPage, limit, search],
    queryFn: () => getPurchases(currentPage, limit, search),
  });

  const list = data?.items ?? [];
  const pagination = data?.pagination;

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

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
        <h1 className="text-xl font-semibold">Purchase History</h1>
        <Button
          variant="outline"
          onClick={() => window.location.href = '/purchase'}
        >
          New Purchase
        </Button>
      </div>

      <Input
        placeholder="Search by invoice or supplier..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="max-w-sm"
      />

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading purchases</p>}

      {!isLoading && (
        <div className="mt-4 bg-white dark:bg-zinc-900 rounded-xl shadow border dark:border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-zinc-800">
              <tr>
                <th className="p-3 text-left">Invoice Number</th>
                <th className="p-3 text-left">Supplier</th>
                <th className="p-3 text-left">Purchase Date</th>
                <th className="p-3 text-right">Total Amount</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {list.map((purchase) => (
                <tr
                  key={purchase.id}
                  className="border-t dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800"
                >
                  <td className="p-3 font-medium">{purchase.invoice_number}</td>
                  <td className="p-3">{purchase.supplier_name}</td>
                  <td className="p-3">{purchase.purchase_date}</td>
                  <td className="p-3 text-right font-semibold">
                    ৳ {purchase.total_amount.toFixed(2)}
                  </td>
                  <td className="p-3 text-center">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedPurchaseId(purchase.id)}
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}

              {list.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-4 text-center text-muted-foreground"
                  >
                    No purchases found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {pagination && pagination.total > 0 && (
            <div className="flex items-center justify-between p-4 border-t dark:border-zinc-800">
              <div className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * limit + 1} to{" "}
                {Math.min(currentPage * limit, pagination.total)} of{" "}
                {pagination.total} results
              </div>

              {pagination.pages > 1 && (
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
              )}
            </div>
          )}
        </div>
      )}

      <PurchaseDetailModal
        purchaseId={selectedPurchaseId}
        onClose={() => setSelectedPurchaseId(null)}
      />
    </div>
  );
}
