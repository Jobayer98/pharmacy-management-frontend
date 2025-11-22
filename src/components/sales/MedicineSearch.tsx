"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { getPOSMedicines } from "@/lib/api/sale";
import { useInfiniteQuery } from "@tanstack/react-query";
import { BarcodeScanner } from "./BarcodeScanner";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export const MedicineSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const { addToCart } = useCartStore();
  const observerTarget = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["pos-medicines", query],
      queryFn: ({ pageParam = 1 }) => getPOSMedicines(pageParam, 20, query),
      getNextPageParam: (lastPage) => {
        const { page, pages } = lastPage.pagination;
        return page < pages ? page + 1 : undefined;
      },
      initialPageParam: 1,
    });

  const medicines = data?.pages.flatMap((page) => page.items) ?? [];

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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

      <div className="space-y-2 max-h-[calc(100vh-250px)] overflow-y-auto">
        {isLoading && (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}

        {medicines.map((m) => (
          <div
            key={m.id}
            className="flex items-center justify-between p-3 bg-white dark:bg-zinc-900 rounded-lg border dark:border-zinc-800"
          >
            <div>
              <p className="font-medium">{`${m.name} ${m.strength}`}</p>
              <p className="text-sm text-muted-foreground">
                ৳ {m.price} • Stock: {m.quantity}
              </p>
            </div>

            <Button onClick={() => addToCart(m)} disabled={m.quantity === 0}>
              {m.quantity === 0 ? "Out of Stock" : "Add"}
            </Button>
          </div>
        ))}

        {medicines.length === 0 && !isLoading && (
          <p className="text-center text-muted-foreground text-sm py-8">
            No medicine found
          </p>
        )}

        {/* Infinite scroll trigger */}
        <div ref={observerTarget} className="h-4">
          {isFetchingNextPage && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
