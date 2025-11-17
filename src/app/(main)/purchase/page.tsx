"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { PurchaseItem } from "@/types/purchase";

// Mock supplier + medicine data
const SUPPLIERS = ["Square Distributor", "Incepta Agency", "Beximco Pharma"];
const MEDICINES = ["Napa", "Seclo", "Fexo", "Monas"];

// For ID auto-increment
let itemId = 1;

export default function PurchasePage() {
  const [supplier, setSupplier] = useState("");
  const [medicine, setMedicine] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");

  const [items, setItems] = useState<PurchaseItem[]>([]);

  const addItem = () => {
    if (!supplier) {
      toast.error("Select supplier first");
      return;
    }
    if (!medicine || !qty || !price) {
      toast.error("All fields required");
      return;
    }

    const newItem: PurchaseItem = {
      id: itemId++,
      medicine,
      quantity: Number(qty),
      price: Number(price),
    };

    setItems((prev) => [...prev, newItem]);

    setMedicine("");
    setQty("");
    setPrice("");
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const submitPurchase = () => {
    if (!supplier) {
      toast.error("Select supplier");
      return;
    }

    if (items.length === 0) {
      toast.error("No items added");
      return;
    }

    toast.success("Purchase saved (mock)");
  };

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold">New Purchase</h1>

      {/* Supplier Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Supplier</label>
        <select
          value={supplier}
          onChange={(e) => setSupplier(e.target.value)}
          className="w-full p-2 rounded border dark:bg-zinc-900 dark:border-zinc-800"
        >
          <option value="">Select supplier...</option>
          {SUPPLIERS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Add Item Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white dark:bg-zinc-900 p-4 rounded-xl shadow border dark:border-zinc-800">
        <div>
          <label className="text-sm">Medicine</label>
          <select
            value={medicine}
            onChange={(e) => setMedicine(e.target.value)}
            className="w-full p-2 rounded border dark:bg-zinc-800 dark:bg-zinc-900"
          >
            <option value="">Select medicine...</option>
            {MEDICINES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm">Quantity</label>
          <Input
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder="0"
          />
        </div>

        <div>
          <label className="text-sm">Price</label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0"
          />
        </div>

        <div className="flex items-end">
          <Button onClick={addItem} className="w-full">
            Add Item
          </Button>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow border dark:border-zinc-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 dark:bg-zinc-800">
            <tr>
              <th className="p-3 text-left">Medicine</th>
              <th className="p-3 text-left">Qty</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Total</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {items.map((i) => (
              <tr
                key={i.id}
                className="border-t dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800"
              >
                <td className="p-3">{i.medicine}</td>
                <td className="p-3">{i.quantity}</td>
                <td className="p-3">৳ {i.price}</td>
                <td className="p-3 font-semibold">৳ {i.quantity * i.price}</td>
                <td className="p-3">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem(i.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}

            {items.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="p-4 text-center text-muted-foreground"
                >
                  No items added
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Total + Submit */}
      <div className="text-right space-y-2">
        <p className="text-lg font-semibold">Total: ৳ {total}</p>
        <Button onClick={submitPurchase}>Submit Purchase</Button>
      </div>
    </div>
  );
}
