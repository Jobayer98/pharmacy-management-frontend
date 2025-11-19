"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddMedicineModal } from "@/components/medicine/AddMedicineModal";
import { BulkImportModal } from "@/components/medicine/BulkImportModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMedicines,
  deleteMedicine,
  type MedicineResponse,
} from "@/lib/api/medicine";
import { toast } from "sonner";

export default function MedicinePage() {
  const [open, setOpen] = useState(false);
  const [bulkImportOpen, setBulkImportOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [editData, setEditData] = useState<MedicineResponse | null>(null);
  const limit = 10;

  const queryClient = useQueryClient();

  // FETCH LIST
  const { data, isLoading, isError } = useQuery({
    queryKey: ["medicines", currentPage, limit, search],
    queryFn: () => getMedicines(currentPage, limit, search),
  });

  const list = data?.items ?? [];
  const pagination = data?.pagination;

  // DELETE MUTATION
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteMedicine(id),
    onSuccess: () => {
      toast.success("Medicine deleted");
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
    },
    onError: () => {
      toast.error("Failed to delete medicine");
    },
  });

  const handleEdit = (medicine: MedicineResponse) => {
    setEditData(medicine);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this medicine?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1); // Reset to first page on search
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
        <h1 className="text-xl font-semibold">Medicine List</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setBulkImportOpen(true)}>
            Bulk Import
          </Button>
          <Button
            onClick={() => {
              setEditData(null); // reset edit data
              setOpen(true);
            }}
          >
            + Add Medicine
          </Button>
        </div>
      </div>

      <Input
        placeholder="Search medicine..."
        value={search}
        onChange={(e) => handleSearch(e.target.value)}
        className="max-w-sm"
      />

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading medicines</p>}

      {!isLoading && (
        <div className="mt-4 bg-white dark:bg-zinc-900 rounded-xl shadow border dark:border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-zinc-800">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Generic</th>
                <th className="p-3 text-left">Brand</th>
                <th className="p-3 text-left">Strength</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {list.map((m) => (
                <tr
                  key={m.id}
                  className="border-t dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800"
                >
                  <td className="p-3">{m.name}</td>
                  <td className="p-3">{m.generic_name ?? "-"}</td>
                  <td className="p-3">{m.brand ?? "-"}</td>
                  <td className="p-3">{m.strength}</td>

                  <td className="p-3 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        (window.location.href = `/medicine/${m.id}`)
                      }
                    >
                      View
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(m)}
                    >
                      Edit
                    </Button>

                    {/* <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(m.id)}
                    >
                      Delete
                    </Button> */}
                  </td>
                </tr>
              ))}

              {list.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-4 text-center text-muted-foreground"
                  >
                    No medicine found
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

      <AddMedicineModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditData(null); // reset form after close
        }}
        editData={editData}
      />

      <BulkImportModal
        open={bulkImportOpen}
        onClose={() => setBulkImportOpen(false)}
      />
    </div>
  );
}
