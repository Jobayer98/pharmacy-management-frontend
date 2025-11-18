"use client";

import { useState } from "react";
import { MedicineSearch } from "@/components/sales/MedicineSearch";
import { CartPanel } from "@/components/sales/CartPanel";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useCartStore } from "@/store/cartStore";
import { ShoppingCart } from "lucide-react";

export default function SalesPage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items } = useCartStore();
  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
        <div>
          <h1 className="text-xl font-semibold mb-4">Sales (POS)</h1>
          <MedicineSearch />
        </div>

        {/* Desktop Cart - Always visible on large screens */}
        <div className="hidden lg:block">
          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow p-4 border dark:border-zinc-800 sticky top-4">
            <h2 className="text-lg font-semibold mb-4">Cart</h2>
            <CartPanel />
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Floating Cart Button */}
      <Button
        className="fixed bottom-6 right-6 lg:hidden h-14 w-14 rounded-full shadow-lg z-40"
        size="icon"
        onClick={() => setIsCartOpen(true)}
      >
        <ShoppingCart className="h-6 w-6" />
        {itemCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </Button>

      {/* Mobile/Tablet Cart Sheet */}
      <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
        <SheetContent side="right" className="w-full sm:w-96 p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Shopping Cart</SheetTitle>
          </SheetHeader>
          <div className="p-4">
            <CartPanel onCheckoutSuccess={() => setIsCartOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

