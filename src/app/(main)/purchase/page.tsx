"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createPurchase } from "@/lib/api/purchase";
import { getMedicines } from "@/lib/api/medicine";
import { getSuppliers } from "@/lib/api/supplier";
import type { PurchaseItem } from "@/types/purchase";
import { Trash2 } from "lucide-react";

let itemId = 1;

export default function PurchasePage() {
  const [supplierName, setSupplierName] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Item form fields
  const [medicineId, setMedicineId] = useState("");
  const [batchNo, setBatchNo] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [quantity, setQuantity] = useState("");

  const [items, setItems] = useState<PurchaseItem[]>([]);

  const queryClient = useQueryClient();

  // Fetch medicines
  const { data: medicines } = useQuery({
    queryKey: ["medicines"],
    queryFn: getMedicines,
  });

  // Fetch suppliers
  const { data: suppliersData } = useQuery({
    queryKey: ["suppliers"],
    queryFn: () => getSuppliers({ page: 1, limit: 100 }),
  });

  const suppliers = suppliersData?.items ?? [];

  // Create purchase mutation
  const { mutate: submitPurchase, isPending } = useMutation({
    mutationFn: createPurchase,
    onSuccess: () => {
      toast.success("Purchase created successfully");
      queryClient.invalidateQueries({ queryKey: ["purchases"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["batches"] });

      // Reset form
      setSupplierName("");
      setPurchaseDate(new Date().toISOString().split("T")[0]);
      setItems([]);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to create purchase");
    },
  });

  const addItem = () => {
    if (
      !medicineId ||
      !batchNo ||
      !expiryDate ||
      !purchasePrice ||
      !sellingPrice ||
      !quantity
    ) {
      toast.error("All fields are required");
      return;
    }

    const medicine = medicines?.find((m) => m.id === Number(medicineId));
    if (!medicine) {
      toast.error("Invalid medicine selected");
      return;
    }

    const newItem: PurchaseItem = {
      id: itemId++,
      medicine_id: Number(medicineId),
      medicine_name: medicine.name,
      batch_no: batchNo,
      expiry_date: expiryDate,
      purchase_price: Number(purchasePrice),
      selling_price: Number(sellingPrice),
      quantity: Number(quantity),
    };

    setItems((prev) => [...prev, newItem]);

    // Reset item form
    setMedicineId("");
    setBatchNo("");
    setExpiryDate("");
    setPurchasePrice("");
    setSellingPrice("");
    setQuantity("");
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const totalAmount = items.reduce(
    (sum, i) => sum + i.purchase_price * i.quantity,
    0
  );

  const handleSubmit = () => {
    if (!supplierName) {
      toast.error("Please select a supplier");
      return;
    }

    if (!purchaseDate) {
      toast.error("Please select purchase date");
      return;
    }

    if (items.length === 0) {
      toast.error("Please add at least one item");
      return;
    }

    submitPurchase({
      supplier_name: supplierName,
      purchase_date: purchaseDate,
      items: items.map((item) => ({
        medicine_id: item.medicine_id,
        batch_no: item.batch_no,
        expiry_date: item.expiry_date,
        purchase_price: item.purchase_price,
        selling_price: item.selling_price,
        quantity: item.quantity,
      })),
    });
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">New Purchase</h1>
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/purchase/history")}
        >
          View Purchase History
        </Button>
      </div>

      {/* Supplier & Date Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-zinc-900 p-6 rounded-xl shadow border dark:border-zinc-800">
        <div className="space-y-2">
          <label className="text-sm font-medium">Supplier *</label>
          <select
            value={supplierName}
            onChange={(e) => setSupplierName(e.target.value)}
            className="w-full p-2 rounded border dark:bg-zinc-900 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select supplier...</option>
            {suppliers.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name} - {s.company_name}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Purchase Date *</label>
          <DatePicker
            value={purchaseDate}
            onChange={setPurchaseDate}
            placeholder="Select date"
          />
        </div>
      </div>

      {/* Add Item Section */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow border dark:border-zinc-800">
        <h2 className="text-lg font-semibold mb-4">Add Items</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Medicine *</label>
            <select
              value={medicineId}
              onChange={(e) => setMedicineId(e.target.value)}
              className="w-full p-2 rounded border dark:bg-zinc-900 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select medicine...</option>
              {medicines?.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} - {m.generic_name || "N/A"}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Batch No *</label>
            <Input
              value={batchNo}
              onChange={(e) => setBatchNo(e.target.value)}
              placeholder="e.g., BATCH001"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Expiry Date *</label>
            <DatePicker
              value={expiryDate}
              onChange={setExpiryDate}
              placeholder="Select expiry date"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Purchase Price *</label>
            <Input
              type="number"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              placeholder="0.00"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Selling Price *</label>
            <Input
              type="number"
              value={sellingPrice}
              onChange={(e) => setSellingPrice(e.target.value)}
              placeholder="0.00"
              step="0.01"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Quantity *</label>
            <Input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="0"
            />
          </div>
        </div>

        <div className="mt-4">
          <Button onClick={addItem} className="w-full md:w-auto">
            + Add Item
          </Button>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow border dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-zinc-800">
              <tr>
                <th className="p-3 text-left">Medicine</th>
                <th className="p-3 text-left">Batch No</th>
                <th className="p-3 text-left">Expiry</th>
                <th className="p-3 text-left">Qty</th>
                <th className="p-3 text-left">Purchase Price</th>
                <th className="p-3 text-left">Selling Price</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-t dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
                >
                  <td className="p-3 font-medium">{item.medicine_name}</td>
                  <td className="p-3">{item.batch_no}</td>
                  <td className="p-3">{item.expiry_date}</td>
                  <td className="p-3">{item.quantity}</td>
                  <td className="p-3">৳ {item.purchase_price.toFixed(2)}</td>
                  <td className="p-3">৳ {item.selling_price.toFixed(2)}</td>
                  <td className="p-3 font-semibold">
                    ৳ {(item.purchase_price * item.quantity).toFixed(2)}
                  </td>
                  <td className="p-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}

              {items.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="p-8 text-center text-muted-foreground"
                  >
                    No items added yet. Add items using the form above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Total & Submit */}
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow border dark:border-zinc-800">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Amount</p>
            <p className="text-3xl font-bold">৳ {totalAmount.toFixed(2)}</p>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isPending || items.length === 0}
            size="lg"
            className="w-full md:w-auto"
          >
            {isPending ? "Submitting..." : "Submit Purchase"}
          </Button>
        </div>
      </div>
    </div>
  );
}
