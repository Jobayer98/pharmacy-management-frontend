"use client";

import React from "react";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";

export const CartPanel: React.FC = () => {
  const { items, increase, decrease, remove, clear } = useCartStore();

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discount = 0; // future
  const total = subtotal - discount;

  return (
    <div className="w-full md:w-80 bg-white dark:bg-zinc-900 rounded-xl shadow p-4 border dark:border-zinc-800 space-y-4">
      <h2 className="text-lg font-semibold">Cart</h2>

      {items.length === 0 && (
        <p className="text-sm text-muted-foreground">Cart is empty</p>
      )}

      {items.map((i) => (
        <div
          key={i.id}
          className="flex items-center justify-between border-b pb-2 dark:border-zinc-800"
        >
          <div>
            <p className="font-medium">{i.name}</p>
            <p className="text-sm text-muted-foreground">
              ৳ {i.price} × {i.qty}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => decrease(i.id)}>
              -
            </Button>
            <Button size="sm" variant="outline" onClick={() => increase(i.id)}>
              +
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => remove(i.id)}
            >
              x
            </Button>
          </div>
        </div>
      ))}

      {/* Summary */}
      <div className="pt-4 border-t dark:border-zinc-800">
        <p className="text-sm">Subtotal: ৳ {subtotal}</p>
        <p className="text-sm">Discount: ৳ {discount}</p>
        <p className="text-lg font-semibold">Total: ৳ {total}</p>
      </div>

      <Button className="w-full" onClick={() => clear()}>
        Checkout (Mock)
      </Button>
    </div>
  );
};
