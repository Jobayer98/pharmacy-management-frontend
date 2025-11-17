"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddMedicineModal } from "@/components/medicine/AddMedicineModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMedicines,
  deleteMedicine,
  type MedicineResponse,
} from "@/lib/api/medicine";
import { toast } from "sonner";

export default function MedicinePage() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [editData, setEditData] = useState<MedicineResponse | null>(null);

  const queryClient = useQueryClient();

  // FETCH LIST
  const { data, isLoading, isError } = useQuery({
    queryKey: ["medicines"],
    queryFn: getMedicines,
  });

  const list = data ?? [];

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

  const filtered = list.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Medicine List</h1>
        <Button
          onClick={() => {
            setEditData(null); // reset edit data
            setOpen(true);
          }}
        >
          + Add Medicine
        </Button>
      </div>

      <Input
        placeholder="Search medicine..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
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
              {filtered.map((m) => (
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

              {filtered.length === 0 && (
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
    </div>
  );
}
