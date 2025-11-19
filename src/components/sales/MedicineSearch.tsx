"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { getMedicines } from "@/lib/api/medicine";
import { useQuery } from "@tanstack/react-query";
import { BarcodeScanner } from "./BarcodeScanner";
import { toast } from "sonner";

export const MedicineSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const { addToCart } = useCartStore();

  const { data } = useQuery({
    queryKey: ["medicines"],
    queryFn: () => getMedicines(1, 1000),
  });

  const medicines = data?.items ?? [];

  const list = medicines.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleBarcodeScan = (barcode: string) => {
    const medicine = medicines.find((m) => m.barcode === barcode);

    if (medicine) {
      addToCart(medicine);
      toast.success(`${medicine.name} added to cart`);
    } else {
      toast.error(`No medicine found with barcode: ${barcode}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Search medicine..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <BarcodeScanner onScan={handleBarcodeScan} />
      </div>

      <div className="space-y-2">
        {list?.map((m) => (
          <div
            key={m.id}
            className="flex items-center justify-between p-3 bg-white dark:bg-zinc-900 rounded-lg border dark:border-zinc-800"
          >
            <div>
              <p className="font-medium">{m.name}</p>
              <p className="text-sm text-muted-foreground">৳ {m.price}</p>
            </div>

            <Button onClick={() => addToCart(m)}>Add</Button>
          </div>
        ))}

        {list?.length === 0 && (
          <p className="text-center text-muted-foreground text-sm">
            No medicine found
          </p>
        )}
      </div>
    </div>
  );
};
