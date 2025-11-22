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
      <DialogContent className="w-[95vw] max-w-6xl h-[95vh] max-h-[95vh] flex flex-col p-0">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3 sm:pb-4 border-b dark:border-zinc-800 shrink-0">
          <DialogTitle className="text-base sm:text-lg">
            Purchase Details
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4 min-h-0">
          {isLoading && (
            <div className="py-8 text-center text-muted-foreground">
              Loading...
            </div>
          )}

          {data && (
            <div className="space-y-4 sm:space-y-6">
              {/* Header Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Invoice Number
                  </p>
                  <p className="font-semibold text-sm sm:text-base break-all">
                    {data.invoice_number}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Supplier
                  </p>
                  <p className="font-semibold text-sm sm:text-base break-words">
                    {data.supplier_name}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Purchase Date
                  </p>
                  <p className="font-semibold text-sm sm:text-base">
                    {data.purchase_date}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Total Amount
                  </p>
                  <p className="font-semibold text-base sm:text-lg">
                    ৳ {data.total_amount.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h3 className="font-semibold mb-2 sm:mb-3 text-sm sm:text-base">
                  Purchase Items
                </h3>

                {/* Desktop Table View */}
                <div className="hidden md:block border dark:border-zinc-800 rounded-lg overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 dark:bg-zinc-800">
                      <tr>
                        <th className="p-2 lg:p-3 text-left whitespace-nowrap text-xs lg:text-sm">
                          Medicine ID
                        </th>
                        <th className="p-2 lg:p-3 text-left whitespace-nowrap text-xs lg:text-sm">
                          Batch No
                        </th>
                        <th className="p-2 lg:p-3 text-left whitespace-nowrap text-xs lg:text-sm">
                          Expiry Date
                        </th>
                        <th className="p-2 lg:p-3 text-right whitespace-nowrap text-xs lg:text-sm">
                          Qty
                        </th>
                        <th className="p-2 lg:p-3 text-right whitespace-nowrap text-xs lg:text-sm">
                          Purchase
                        </th>
                        <th className="p-2 lg:p-3 text-right whitespace-nowrap text-xs lg:text-sm">
                          Selling
                        </th>
                        <th className="p-2 lg:p-3 text-right whitespace-nowrap text-xs lg:text-sm">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.items.map((item) => (
                        <tr
                          key={item.id}
                          className="border-t dark:border-zinc-800"
                        >
                          <td className="p-2 lg:p-3 whitespace-nowrap text-xs lg:text-sm">
                            {item.medicine_id}
                          </td>
                          <td className="p-2 lg:p-3 whitespace-nowrap text-xs lg:text-sm">
                            {item.batch_no}
                          </td>
                          <td className="p-2 lg:p-3 whitespace-nowrap text-xs lg:text-sm">
                            {item.expiry_date}
                          </td>
                          <td className="p-2 lg:p-3 text-right whitespace-nowrap text-xs lg:text-sm">
                            {item.quantity}
                          </td>
                          <td className="p-2 lg:p-3 text-right whitespace-nowrap text-xs lg:text-sm">
                            ৳ {item.purchase_price.toFixed(2)}
                          </td>
                          <td className="p-2 lg:p-3 text-right whitespace-nowrap text-xs lg:text-sm">
                            ৳ {item.selling_price.toFixed(2)}
                          </td>
                          <td className="p-2 lg:p-3 text-right font-semibold whitespace-nowrap text-xs lg:text-sm">
                            ৳ {(item.purchase_price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                  {data.items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 border dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-900 space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Medicine ID
                          </p>
                          <p className="font-semibold text-sm">
                            {item.medicine_id}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            Quantity
                          </p>
                          <p className="font-semibold text-sm">
                            {item.quantity}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-muted-foreground">Batch No</p>
                          <p className="font-medium">{item.batch_no}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Expiry Date</p>
                          <p className="font-medium">{item.expiry_date}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t dark:border-zinc-800">
                        <div>
                          <p className="text-muted-foreground">
                            Purchase Price
                          </p>
                          <p className="font-medium">
                            ৳ {item.purchase_price.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Selling Price</p>
                          <p className="font-medium">
                            ৳ {item.selling_price.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="pt-2 border-t dark:border-zinc-800">
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-muted-foreground">
                            Subtotal
                          </p>
                          <p className="font-bold text-sm">
                            ৳ {(item.purchase_price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
