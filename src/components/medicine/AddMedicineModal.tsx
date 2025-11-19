"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createMedicine,
  updateMedicine,
  type MedicineResponse,
} from "@/lib/api/medicine";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface AddMedicineModalProps {
  open: boolean;
  onClose: () => void;
  editData?: MedicineResponse | null;
}

export interface MedicineFormValues {
  name: string;
  generic: string;
  company: string;
  category: string;
  unit: string;
  strength: string;
  barcode: string;
  image_url: string;
}

export const AddMedicineModal: React.FC<AddMedicineModalProps> = ({
  open,
  onClose,
  editData,
}) => {
  const [form, setForm] = useState<MedicineFormValues>({
    name: "",
    generic: "",
    company: "",
    category: "",
    unit: "",
    strength: "",
    barcode: "",
    image_url: "",
  });

  const UNIT_OPTIONS = ["Strip", "Bottle", "Piece", "ML"];
  const CATEGORY_OPTIONS = ["Tablet", "Capsule", "Syrup", "Ijection"];

  const queryClient = useQueryClient();

  // CREATE mutation
  const createMutation = useMutation({
    mutationFn: createMedicine,
    onSuccess: () => {
      toast.success("Medicine added");
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to add medicine");
    },
  });

  // UPDATE mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: any }) =>
      updateMedicine(id, payload),
    onSuccess: () => {
      toast.success("Medicine updated");
      queryClient.invalidateQueries({ queryKey: ["medicines"] });
      onClose();
    },
    onError: () => {
      toast.error("Failed to update medicine");
    },
  });

  // Load edit data into form
  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name,
        generic: editData.generic_name || "",
        company: editData.brand || "",
        category: editData.category || "",
        unit: editData.unit || "",
        strength: editData.strength,
        barcode: editData.barcode || "",
        image_url: "",
      });
    } else {
      setForm({
        name: "",
        generic: "",
        company: "",
        category: "",
        unit: "",
        strength: "",
        barcode: "",
        image_url: "",
      });
    }
  }, [editData]);

  const handleSubmit = () => {
    if (!form.name) {
      toast.error("Medicine name is required");
      return;
    }

    const payload = {
      name: form.name,
      generic_name: form.generic || null,
      brand: form.company || null,
      category: form.category || null,
      unit: form.unit || null,
      strength: form.strength,
      barcode: form.barcode || null,
      image_url: form.image_url || null,
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
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {editData ? "Edit Medicine" : "Add Medicine"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto flex-1 pr-2">
          {/* Name */}
          <div>
            <label className="text-sm">Medicine Name</label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Napa"
            />
          </div>

          {/* Generic */}
          <div>
            <label className="text-sm">Generic Name</label>
            <Input
              value={form.generic}
              onChange={(e) => setForm({ ...form, generic: e.target.value })}
              placeholder="Paracetamol"
            />
          </div>

          {/* Brand */}
          <div>
            <label className="text-sm">Company</label>
            <Input
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="Square"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full p-2 rounded border dark:bg-zinc-900 dark:border-zinc-800"
            >
              <option value="">Select Category</option>
              {CATEGORY_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Unit */}
          <div>
            <label className="text-sm">Unit</label>
            <select
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="w-full p-2 rounded border dark:bg-zinc-900 dark:border-zinc-800"
            >
              <option value="">Select Unit</option>
              {UNIT_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Strength */}
          <div>
            <label className="text-sm">Strength</label>
            <Input
              value={form.strength}
              onChange={(e) => setForm({ ...form, strength: e.target.value })}
              placeholder="500mg"
            />
          </div>

          {/* Barcode */}
          <div>
            <label className="text-sm">Barcode</label>
            <Input
              value={form.barcode}
              onChange={(e) => setForm({ ...form, barcode: e.target.value })}
              placeholder="8940001280419"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="text-sm">Image URL</label>
            <Input
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div className="pt-4 border-t mt-4">
          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={isPending}
          >
            {isPending
              ? "Processing..."
              : editData
              ? "Update Medicine"
              : "Save Medicine"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
