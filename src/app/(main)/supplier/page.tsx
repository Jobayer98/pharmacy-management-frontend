"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AddSupplierModal,
  SupplierFormValues,
} from "@/components/supplier/AddSupplierModal";

interface Supplier {
  id: number;
  name: string;
  phone: string;
  company: string;
}

export default function SupplierPage() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [list, setList] = useState<Supplier[]>([
    { id: 1, name: "Rahim Traders", phone: "01711111111", company: "Square" },
    { id: 2, name: "Medi House", phone: "01722222222", company: "Incepta" },
  ]);

  const filtered = list.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (data: SupplierFormValues) => {
    setList((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        name: data.name,
        phone: data.phone,
        company: data.company,
      },
    ]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Suppliers</h1>
        <Button onClick={() => setOpen(true)}>+ Add Supplier</Button>
      </div>

      <Input
        placeholder="Search supplier..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <div className="mt-4 bg-white dark:bg-zinc-900 rounded-xl shadow border dark:border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-zinc-800">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Company</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((s) => (
              <tr
                key={s.id}
                className="border-t dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800"
              >
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.phone}</td>
                <td className="p-3">{s.company}</td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="p-4 text-center text-muted-foreground"
                >
                  No supplier found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <AddSupplierModal
        open={open}
        onClose={() => setOpen(false)}
        onAdd={handleAdd}
      />
    </div>
  );
}
