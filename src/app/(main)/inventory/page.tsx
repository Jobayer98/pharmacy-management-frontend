"use client";

import React, { useMemo, useState } from "react";
import { BatchItem } from "@/types/inventory";
import { Input } from "@/components/ui/input";

const MOCK_DATA: BatchItem[] = [
  {
    id: 1,
    medicine: "Napa",
    batchNo: "BATCH-001",
    expiry: "2026-01-01",
    quantity: 50,
  },
  {
    id: 2,
    medicine: "Napa",
    batchNo: "BATCH-002",
    expiry: "2025-03-01",
    quantity: 8,
  },
  {
    id: 3,
    medicine: "Seclo",
    batchNo: "SEC-1001",
    expiry: "2024-12-02",
    quantity: 120,
  },
  {
    id: 4,
    medicine: "Fexo",
    batchNo: "FX-900",
    expiry: "2024-12-15",
    quantity: 3,
  },
];

export default function InventoryPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    return MOCK_DATA.filter((i) =>
      i.medicine.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const isNearExpiry = (expiry: string) => {
    const today = new Date();
    const exp = new Date(expiry);
    const diff = (exp.getTime() - today.getTime()) / (1000 * 3600 * 24);
    return diff <= 30; // less than 30 days
  };

  const isLowStock = (qty: number) => qty < 10;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Inventory / Batch List</h1>

      <Input
        placeholder="Search medicine..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow border dark:border-zinc-800 overflow-hidden mt-4">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-zinc-800">
            <tr>
              <th className="p-3 text-left">Medicine</th>
              <th className="p-3 text-left">Batch No</th>
              <th className="p-3 text-left">Expiry</th>
              <th className="p-3 text-left">Quantity</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((i) => (
              <tr
                key={i.id}
                className="border-t dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800"
              >
                <td className="p-3">{i.medicine}</td>
                <td className="p-3">{i.batchNo}</td>
                <td className="p-3">{i.expiry}</td>
                <td className="p-3">{i.quantity}</td>

                <td className="p-3">
                  {isNearExpiry(i.expiry) && (
                    <span className="text-yellow-500 font-medium">
                      Near Expiry
                    </span>
                  )}

                  {isLowStock(i.quantity) && (
                    <span className="text-red-500 font-medium ml-2">
                      Low Stock
                    </span>
                  )}

                  {!isNearExpiry(i.expiry) && !isLowStock(i.quantity) && "OK"}
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-4 text-center text-muted-foreground"
                >
                  No items found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
