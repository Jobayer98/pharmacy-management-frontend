"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSuppliers,
  createSupplier,
  type SupplierResponse,
} from "@/lib/api/supplier";
import { toast } from "sonner";
import { AddSupplierModal } from "@/components/supplier/AddSupplierModal";

export default function SuppliersPage() {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState<SupplierResponse | null>(null);
  const [search, setSearch] = useState("");
  const [page] = useState(1);
  const [limit] = useState(10);

  const queryClient = useQueryClient();

  // Fetch suppliers
  const { data, isLoading, isError } = useQuery({
    queryKey: ["suppliers", search, page, limit],
    queryFn: () =>
      getSuppliers({
        search,
        page,
        limit,
      }),
  });

  const items = data?.items ?? [];

  const handleEdit = (supplier: SupplierResponse) => {
    setEditData(supplier);
    setOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this supplier?")) {
      // TODO: delete API
      toast.info("Delete API coming next...");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Suppliers</h1>
        <Button
          onClick={() => {
            setEditData(null);
            setOpen(true);
          }}
        >
          + Add Supplier
        </Button>
      </div>

      <Input
        placeholder="Search supplier..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error loading suppliers</p>}

      {!isLoading && (
        <div className="mt-4 bg-white dark:bg-zinc-900 rounded-xl shadow border dark:border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-zinc-800">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Company</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Email</th>
                {/* <th className="p-3 text-left">Actions</th> */}
              </tr>
            </thead>

            <tbody>
              {items.map((s) => (
                <tr
                  key={s.id}
                  className="border-t dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800"
                >
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.company_name}</td>
                  <td className="p-3">{s.phone}</td>
                  <td className="p-3">{s.email}</td>
                  {/* <td className="p-3 flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(s)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(s.id)}
                    >
                      Delete
                    </Button>
                  </td> */}
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="p-4 text-center text-muted-foreground"
                  >
                    No supplier found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <AddSupplierModal
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
