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

interface AddMedicineModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: MedicineFormValues) => void;
}

export interface MedicineFormValues {
  name: string;
  generic: string;
  company: string;
}

export const AddMedicineModal: React.FC<AddMedicineModalProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [form, setForm] = useState<MedicineFormValues>({
    name: "",
    generic: "",
    company: "",
  });

  const handleSubmit = () => {
    if (!form.name) {
      toast.error("Medicine name is required");
      return;
    }

    onAdd(form);
    toast.success("Medicine added");
    onClose();
    setForm({ name: "", generic: "", company: "" });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Medicine</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm">Medicine Name</label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Napa"
            />
          </div>

          <div>
            <label className="text-sm">Generic Name</label>
            <Input
              value={form.generic}
              onChange={(e) => setForm({ ...form, generic: e.target.value })}
              placeholder="Paracetamol"
            />
          </div>

          <div>
            <label className="text-sm">Company</label>
            <Input
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="Square"
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
