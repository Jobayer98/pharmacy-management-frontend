"use client";

import { Button } from "@/components/ui/button";

export default function InvoicePage() {
  const MOCK_INVOICE = {
    id: "INV-001",
    date: "2025-02-12",
    customer: "Customer Name",
    items: [
      { name: "Napa", qty: 2, price: 5 },
      { name: "Seclo", qty: 1, price: 12 },
    ],
  };

  const subtotal = MOCK_INVOICE.items.reduce(
    (sum, i) => sum + i.qty * i.price,
    0
  );

  const discount = 0;
  const total = subtotal - discount;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Invoice</h1>

      <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow border dark:border-zinc-800 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Your Pharmacy Name</h2>
            <p className="text-sm text-muted-foreground">Address here</p>
            <p className="text-sm text-muted-foreground">Phone: 0123456789</p>
          </div>

          <div className="text-right">
            <p className="text-sm text-muted-foreground">Invoice No</p>
            <p className="font-medium">{MOCK_INVOICE.id}</p>

            <p className="text-sm text-muted-foreground mt-2">Date</p>
            <p className="font-medium">{MOCK_INVOICE.date}</p>
          </div>
        </div>

        {/* Customer */}
        <div className="mb-6">
          <h3 className="font-medium">Customer</h3>
          <p className="text-sm text-muted-foreground">
            {MOCK_INVOICE.customer}
          </p>
        </div>

        {/* Items */}
        <table className="w-full text-sm mb-6">
          <thead className="bg-gray-100 dark:bg-zinc-800">
            <tr>
              <th className="p-3 text-left">Item</th>
              <th className="p-3 text-left">Qty</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Total</th>
            </tr>
          </thead>

          <tbody>
            {MOCK_INVOICE.items.map((i, index) => (
              <tr
                key={index}
                className="border-t dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800"
              >
                <td className="p-3">{i.name}</td>
                <td className="p-3">{i.qty}</td>
                <td className="p-3">৳ {i.price}</td>
                <td className="p-3">৳ {i.qty * i.price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary */}
        <div className="text-right space-y-1">
          <p className="text-sm">Subtotal: ৳ {subtotal}</p>
          <p className="text-sm">Discount: ৳ {discount}</p>
          <p className="text-lg font-semibold">Total: ৳ {total}</p>
        </div>

        {/* Download */}
        <div className="mt-6 text-right">
          <Button onClick={() => alert("PDF download coming soon")}>
            Download PDF (Mock)
          </Button>
        </div>
      </div>
    </div>
  );
}
