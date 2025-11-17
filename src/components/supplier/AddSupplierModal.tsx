"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSupplier, type SupplierResponse } from "@/lib/api/supplier";

interface SupplierModalProps {
  open: boolean;
  onClose: () => void;
  editData?: SupplierResponse | null;
}

export const AddSupplierModal: React.FC<SupplierModalProps> = ({
  open,
  onClose,
  editData,
}) => {
  const [form, setForm] = useState({
    name: "",
    company_name: "",
    phone: "",
    email: "",
    address: "",
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: createSupplier,
    onSuccess: () => {
      toast.success("Supplier saved");
      queryClient.invalidateQueries({ queryKey: ["suppliers"] });
      onClose();
    },
    onError: () => toast.error("Failed to save supplier"),
  });

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name,
        company_name: editData.company_name,
        phone: editData.phone,
        email: editData.email,
        address: editData.address,
      });
    } else {
      setForm({
        name: "",
        company_name: "",
        phone: "",
        email: "",
        address: "",
      });
    }
  }, [editData]);

  const handleSubmit = () => {
    if (!form.name || !form.company_name) {
      toast.error("Name & company are required");
      return;
    }

    mutate(form);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {editData ? "Edit Supplier" : "Add Supplier"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            placeholder="Company Name"
            value={form.company_name}
            onChange={(e) => setForm({ ...form, company_name: e.target.value })}
          />
          <Input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Input
            placeholder="Address"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />

          <Button
            className="w-full"
            disabled={isPending}
            onClick={handleSubmit}
          >
            {isPending
              ? "Saving..."
              : editData
              ? "Update Supplier"
              : "Save Supplier"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
