"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface InvoiceItem {
  name: string;
  qty: number;
  price: number;
}

interface InvoiceData {
  id: string;
  invoice_number: string;
  date: string;
  customer: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  total: number;
}

interface PharmacyInfo {
  pharmacy_name: string;
  address: string;
  phone: string;
  email: string;
  invoice_footer?: string;
}

interface InvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceData: InvoiceData | null;
  pharmacyInfo?: PharmacyInfo | null;
}

export function InvoiceModal({
  open,
  onOpenChange,
  invoiceData,
  pharmacyInfo,
}: InvoiceModalProps) {
  if (!invoiceData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-700 [&::-webkit-scrollbar-thumb]:rounded-full">
        <DialogHeader>
          <DialogTitle>Invoice</DialogTitle>
        </DialogHeader>

        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold">
                {pharmacyInfo?.pharmacy_name || "Your Pharmacy Name"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {pharmacyInfo?.address || "Address here"}
              </p>
              <p className="text-sm text-muted-foreground">
                Phone: {pharmacyInfo?.phone || "0123456789"}
              </p>
              {pharmacyInfo?.email && (
                <p className="text-sm text-muted-foreground">
                  Email: {pharmacyInfo.email}
                </p>
              )}
            </div>

            <div className="text-right">
              <p className="text-sm text-muted-foreground">Invoice No</p>
              <p className="font-medium">{invoiceData.invoice_number}</p>

              <p className="text-sm text-muted-foreground mt-2">Date</p>
              <p className="font-medium">{invoiceData.date}</p>
            </div>
          </div>

          {/* Customer */}
          <div className="mb-6">
            <h3 className="font-medium">Customer</h3>
            <p className="text-sm text-muted-foreground">
              {invoiceData.customer}
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
              {invoiceData.items.map((item, index) => (
                <tr
                  key={index}
                  className="border-t dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800"
                >
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.qty}</td>
                  <td className="p-3">৳ {item.price}</td>
                  <td className="p-3">৳ {item.qty * item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Summary */}
          <div className="text-right space-y-1">
            <p className="text-sm">Subtotal: ৳ {invoiceData.subtotal}</p>
            <p className="text-sm">Discount: ৳ {invoiceData.discount}</p>
            <p className="text-lg font-semibold">
              Total: ৳ {invoiceData.total}
            </p>
          </div>

          {/* Footer */}
          {pharmacyInfo?.invoice_footer && (
            <div className="mt-6 pt-4 border-t text-center text-sm text-muted-foreground">
              {pharmacyInfo.invoice_footer}
            </div>
          )}

          {/* Download */}
          <div className="mt-6 text-right">
            <Button onClick={() => alert("PDF download coming soon")}>
              Download PDF
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
