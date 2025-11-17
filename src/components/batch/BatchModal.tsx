"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBatch, updateBatch, type BatchResponse } from "@/lib/api/batch";
import { getMedicines } from "@/lib/api/medicine";

interface BatchModalProps {
  open: boolean;
  onClose: () => void;
  editData?: BatchResponse | null;
}

export const BatchModal: React.FC<BatchModalProps> = ({
  open,
  onClose,
  editData,
}) => {
  const [form, setForm] = useState({
    batch_no: "",
    expiry_date: "",
    purchase_price: "",
    selling_price: "",
    quantity: "",
    medicine_id: "",
  });

  const queryClient = useQueryClient();

  // fetch medicines
  const medicinesQuery = useQuery({
    queryKey: ["medicines-dropdown"],
    queryFn: getMedicines,
  });

  // create mutation
  const createMutation = useMutation({
    mutationFn: createBatch,
    onSuccess: () => {
      toast.success("Batch created");
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      onClose();
    },
  });

  // update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      updateBatch(id, payload),
    onSuccess: () => {
      toast.success("Batch updated");
      queryClient.invalidateQueries({ queryKey: ["batches"] });
      onClose();
    },
  });

  useEffect(() => {
    if (editData) {
      setForm({
        batch_no: editData.batch_no,
        expiry_date: editData.expiry_date,
        purchase_price: String(editData.purchase_price),
        selling_price: String(editData.selling_price),
        quantity: String(editData.quantity),
        medicine_id: String(editData.medicine_id),
      });
    } else {
      setForm({
        batch_no: "",
        expiry_date: "",
        purchase_price: "",
        selling_price: "",
        quantity: "",
        medicine_id: "",
      });
    }
  }, [editData]);

  const handleSubmit = () => {
    const payload = {
      ...form,
      purchase_price: Number(form.purchase_price),
      selling_price: Number(form.selling_price),
      quantity: Number(form.quantity),
      medicine_id: Number(form.medicine_id),
    };

    if (editData) {
      updateMutation.mutate({ id: editData.id, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Batch" : "Add Batch"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm">Batch No</label>
            <Input
              placeholder="BATCH-001"
              value={form.batch_no}
              onChange={(e) => setForm({ ...form, batch_no: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm">Expiry Date</label>
            <Input
              type="date"
              value={form.expiry_date}
              onChange={(e) =>
                setForm({ ...form, expiry_date: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-sm">Purchase Price</label>

            <Input
              placeholder="4.5"
              value={form.purchase_price}
              onChange={(e) =>
                setForm({ ...form, purchase_price: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-sm">Selling Price</label>
            <Input
              placeholder="5"
              value={form.selling_price}
              onChange={(e) =>
                setForm({ ...form, selling_price: e.target.value })
              }
            />
          </div>
          <div>
            <label className="text-sm">Quantity</label>
            <Input
              placeholder="10"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />
          </div>
          {!editData && (
            <select
              value={form.medicine_id}
              onChange={(e) =>
                setForm({ ...form, medicine_id: e.target.value })
              }
              className="w-full p-2 border rounded dark:bg-zinc-900 dark:border-zinc-800"
            >
              <option value="">Select Medicine</option>
              {medicinesQuery.data?.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          )}
          <Button
            disabled={isPending}
            className="w-full"
            onClick={handleSubmit}
          >
            {isPending ? "Saving..." : editData ? "Update Batch" : "Save Batch"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
