"use client";

import { useQuery } from "@tanstack/react-query";
import { getPurchaseDetail } from "@/lib/api/purchase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PurchaseDetailModalProps {
  purchaseId: number | null;
  onClose: () => void;
}

export function PurchaseDetailModal({
  purchaseId,
  onClose,
}: PurchaseDetailModalProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["purchase-detail", purchaseId],
    queryFn: () => getPurchaseDetail(purchaseId!),
    enabled: !!purchaseId,
  });

  return (
    <Dialog open={!!purchaseId} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Purchase Details</DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="py-8 text-center text-muted-foreground">
            Loading...
          </div>
        )}

        {data && (
          <div className="space-y-6">
            {/* Header Info */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Invoice Number</p>
                <p className="font-semibold">{data.invoice_number}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Supplier</p>
                <p className="font-semibold">{data.supplier_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Purchase Date</p>
                <p className="font-semibold">{data.purchase_date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="font-semibold text-lg">
                  ৳ {data.total_amount.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Items Table */}
            <div>
              <h3 className="font-semibold mb-3">Purchase Items</h3>
              <div className="border dark:border-zinc-800 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 dark:bg-zinc-800">
                    <tr>
                      <th className="p-3 text-left">Medicine ID</th>
                      <th className="p-3 text-left">Batch No</th>
                      <th className="p-3 text-left">Expiry Date</th>
                      <th className="p-3 text-right">Quantity</th>
                      <th className="p-3 text-right">Purchase Price</th>
                      <th className="p-3 text-right">Selling Price</th>
                      <th className="p-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.items.map((item) => (
                      <tr
                        key={item.id}
                        className="border-t dark:border-zinc-800"
                      >
                        <td className="p-3">{item.medicine_id}</td>
                        <td className="p-3">{item.batch_no}</td>
                        <td className="p-3">{item.expiry_date}</td>
                        <td className="p-3 text-right">{item.quantity}</td>
                        <td className="p-3 text-right">
                          ৳ {item.purchase_price.toFixed(2)}
                        </td>
                        <td className="p-3 text-right">
                          ৳ {item.selling_price.toFixed(2)}
                        </td>
                        <td className="p-3 text-right font-semibold">
                          ৳ {(item.purchase_price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
