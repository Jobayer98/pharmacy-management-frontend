"use client";

import React, { useState } from "react";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkout } from "@/lib/api/sale";
import { toast } from "sonner";

interface CartPanelProps {
  onCheckoutSuccess?: () => void;
}

export const CartPanel: React.FC<CartPanelProps> = ({ onCheckoutSuccess }) => {
  const { items, increase, decrease, remove, clear } = useCartStore();
  const queryClient = useQueryClient();
  const [discount, setDiscount] = useState<string>("");
  const [showDiscount, setShowDiscount] = useState<boolean>(false);

  const { mutate: handleCheckout, isPending } = useMutation({
    mutationFn: checkout,
    onSuccess: (data) => {
      toast.success(`Sale completed! Invoice: ${data.invoice_number}`);
      queryClient.invalidateQueries({ queryKey: ["sales"] });
      queryClient.invalidateQueries({ queryKey: ["batches-for-sale"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      clear();
      setDiscount("");
      setShowDiscount(false);
      onCheckoutSuccess?.();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Checkout failed");
    },
  });

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const discountAmount = parseFloat(discount) || 0;
  const total = Math.max(0, subtotal - discountAmount);

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow only numbers and decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setDiscount(value);
    }
  };

  const handleSubmit = () => {
    if (items.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    handleCheckout({
      customer_name: "Walk-in Customer",
      discount_amount: discountAmount,
      items: items.map((item) => ({
        medicine_id: item.id,
        quantity: item.qty,
      })),
    });
  };

  return (
    <div className="space-y-4">
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground">Cart is empty</p>
      )}

      <div className="space-y-2 max-h-[50vh] overflow-y-auto">
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
              <Button
                size="sm"
                variant="outline"
                onClick={() => decrease(i.id)}
              >
                -
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => increase(i.id)}
              >
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
      </div>

      {/* Summary */}
      <div className="pt-4 border-t dark:border-zinc-800 space-y-3">
        <div className="flex justify-between text-sm">
          <span>Subtotal:</span>
          <span>৳ {subtotal.toFixed(2)}</span>
        </div>

        {/* Discount Toggle Button */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setShowDiscount(!showDiscount);
            if (showDiscount) {
              setDiscount("");
            }
          }}
          className="w-full"
        >
          {showDiscount ? "Remove Discount" : "Add Discount"}
        </Button>

        {/* Discount Input - Conditionally Rendered */}
        {showDiscount && (
          <div className="space-y-1">
            <label className="text-sm font-medium">Discount Amount</label>
            <Input
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={discount}
              onChange={handleDiscountChange}
              className="text-right"
            />
          </div>
        )}

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
