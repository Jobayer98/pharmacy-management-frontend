"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { getMedicines } from "@/lib/api/medicine";
import { useQuery } from "@tanstack/react-query";

export const MedicineSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const { addToCart } = useCartStore();

  // FETCH LIST
  const { data, isLoading, isError } = useQuery({
    queryKey: ["medicines"],
    queryFn: getMedicines,
  });

  const list = data?.filter((m) =>
    m.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search medicine..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

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
