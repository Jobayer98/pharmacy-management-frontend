"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getBatches, deleteBatch, type BatchResponse } from "@/lib/api/batch";
import { toast } from "sonner";
import { BatchModal } from "@/components/batch/BatchModal";

export default function BatchPage() {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<BatchResponse | null>(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const queryClient = useQueryClient();

  // GET batches
  const { data, isLoading, isError } = useQuery({
    queryKey: ["batches", currentPage, limit, search],
    queryFn: () => getBatches(currentPage, limit, search),
  });

  const items = data?.items ?? [];
  const pagination = data?.pagination;

  const deleteMutation = useMutation({
    mutationFn: deleteBatch,
    onSuccess: () => {
      toast.success("Batch deleted");
      queryClient.invalidateQueries({ queryKey: ["batches"] });
    },
  });

  const handleEdit = (batch: BatchResponse) => {
    setEditData(batch);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this batch?")) {
      deleteMutation.mutate(id);
    }
  };

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
        <h1 className="text-xl font-semibold">Batches</h1>
        <p className="text-sm text-muted-foreground">
          Batches are created automatically from purchases
        </p>
      </div>

      <Input
        placeholder="Search batch..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="max-w-sm"
      />

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading batches</p>}

      {!isLoading && (
        <div className="mt-4 bg-white dark:bg-zinc-900 rounded-xl shadow border dark:border-zinc-800 overflow-hidden">
          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border-b dark:border-zinc-800">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              💡 Batches are automatically created when you make a purchase. You
              can edit or delete them here.
            </p>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-zinc-800">
              <tr>
                <th className="p-3 text-left">Batch No</th>
                <th className="p-3 text-left">Medicine</th>
                <th className="p-3 text-left">Expiry</th>
                <th className="p-3 text-left">Qty</th>
                <th className="p-3 text-left">Purchase</th>
                <th className="p-3 text-left">Selling</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {items.map((b) => (
                <tr
                  key={b.id}
                  className="border-t dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800"
                >
                  <td className="p-3">{b.batch_no}</td>
                  <td className="p-3">{b.medicine_name}</td>
                  <td className="p-3">{b.expiry_date}</td>
                  <td className="p-3">{b.quantity}</td>
                  <td className="p-3">{b.purchase_price}</td>
                  <td className="p-3">{b.selling_price}</td>

                  <td className="p-3 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(b)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(b.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="p-4 text-center text-muted-foreground"
                  >
                    No batch found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
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

      <BatchModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditData(null);
        }}
        editData={editData}
      />
    </div>
  );
}
