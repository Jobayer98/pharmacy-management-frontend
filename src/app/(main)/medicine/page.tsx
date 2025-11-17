"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AddMedicineModal,
  MedicineFormValues,
} from "@/components/medicine/AddMedicineModal";

interface Medicine {
  id: number;
  name: string;
  generic: string;
  company: string;
}

export default function MedicinePage() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [list, setList] = useState<Medicine[]>([
    { id: 1, name: "Napa", generic: "Paracetamol", company: "Square" },
    { id: 2, name: "Seclo", generic: "Omeprazole", company: "Square" },
  ]);

  const filtered = list.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (data: MedicineFormValues) => {
    setList((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        name: data.name,
        generic: data.generic,
        company: data.company,
      },
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Medicine List</h1>
        <Button onClick={() => setOpen(true)}>+ Add Medicine</Button>
      </div>

      <Input
        placeholder="Search medicine..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <div className="mt-4 bg-white dark:bg-zinc-900 rounded-xl shadow border dark:border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-zinc-800">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Generic</th>
              <th className="p-3 text-left">Company</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((m) => (
              <tr
                key={m.id}
                className="border-t dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800"
              >
                <td className="p-3">{m.name}</td>
                <td className="p-3">{m.generic}</td>
                <td className="p-3">{m.company}</td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="p-4 text-center text-muted-foreground"
                >
                  No medicine found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddMedicineModal
        open={open}
        onClose={() => setOpen(false)}
        onAdd={handleAdd}
      />
    </div>
  );
}
