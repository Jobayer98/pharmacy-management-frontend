"use client";

import { MedicineSearch } from "@/components/sales/MedicineSearch";
import { CartPanel } from "@/components/sales/CartPanel";

export default function SalesPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
      <div>
        <h1 className="text-xl font-semibold mb-4">Sales (POS)</h1>
        <MedicineSearch />
      </div>

      <CartPanel />
    </div>
  );
}

