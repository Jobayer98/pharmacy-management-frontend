"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export interface SupplierFormValues {
  name: string;
  phone: string;
  company: string;
}

interface AddSupplierModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: SupplierFormValues) => void;
}

export const AddSupplierModal: React.FC<AddSupplierModalProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [form, setForm] = useState<SupplierFormValues>({
    name: "",
    phone: "",
    company: "",
  });

  const handleSubmit = () => {
    if (!form.name) {
      toast.error("Supplier name is required");
      return;
    }

    onAdd(form);
    toast.success("Supplier added");
    onClose();
    setForm({ name: "", phone: "", company: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Supplier</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm">Name</label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Supplier name"
            />
          </div>

          <div>
            <label className="text-sm">Phone</label>
            <Input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="017XXXXXXXX"
            />
          </div>

          <div>
            <label className="text-sm">Company</label>
            <Input
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="Square, Acme..."
            />
          </div>

          <Button className="w-full" onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
