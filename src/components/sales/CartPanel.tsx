"use client";

import React, { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkout } from "@/lib/api/sale";
import { toast } from "sonner";

export const CartPanel: React.FC = () => {
  const { items, increase, decrease, remove, clear } = useCartStore();
  const queryClient = useQueryClient();

  const { mutate: handleCheckout, isPending } = useMutation({
    mutationFn: checkout,
    onSuccess: (data) => {
      toast.success(`Sale completed! Invoice: ${data.invoice_number}`);
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["batches-for-sale"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      clear();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Checkout failed");
    },
  });

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discount = 0; // future
  const total = subtotal - discount;

  const handleSubmit = () => {
    if (items.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    handleCheckout({
      customer_name: "Walk-in Customer",
      items: items.map((item) => ({
        medicine_id: item.id,
        quantity: item.qty,
      })),
    });
  };

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
      <div className="pt-4 border-t dark:border-zinc-800 space-y-1">
        <div className="flex justify-between text-sm">
          <span>Subtotal:</span>
          <span>৳ {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Discount:</span>
          <span>৳ {discount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-semibold pt-2 border-t dark:border-zinc-800">
          <span>Total:</span>
          <span>৳ {total.toFixed(2)}</span>
        </div>
      </div>

      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={isPending || items.length === 0}
      >
        {isPending ? "Processing..." : "Checkout"}
      </Button>
    </div>
  );
};
