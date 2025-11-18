"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from "@/components/ui/status-badge";

interface LowStockItem {
  medicine_id: number;
  medicine_name: string;
  quantity: number;
}

interface LowStockModalProps {
  open: boolean;
  onClose: () => void;
  lowStock: LowStockItem[] | undefined;
  isLoading: boolean;
}

export const LowStockModal: React.FC<LowStockModalProps> = ({
  open,
  onClose,
  lowStock,
  isLoading,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <svg
                className="w-5 h-5 text-yellow-600 dark:text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <DialogTitle>Low Stock Items</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {lowStock?.length || 0} items need restocking
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 overflow-y-auto max-h-[calc(80vh-120px)]">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
            </div>
          )}

          {!isLoading && lowStock && lowStock.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border dark:border-zinc-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-yellow-50 dark:bg-yellow-900/20 sticky top-0">
                  <tr>
                    <th className="p-3 text-left font-semibold">Medicine ID</th>
                    <th className="p-3 text-left font-semibold">
                      Medicine Name
                    </th>
                    <th className="p-3 text-left font-semibold">Quantity</th>
                    <th className="p-3 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStock.map((item, index) => (
                    <tr
                      key={item.medicine_id}
                      className={`border-t dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors ${
                        index % 2 === 0 ? "bg-white dark:bg-zinc-900" : "bg-gray-50/50 dark:bg-zinc-900/50"
                      }`}
                    >
                      <td className="p-3 text-muted-foreground">
                        #{item.medicine_id}
                      </td>
                      <td className="p-3 font-medium">{item.medicine_name}</td>
                      <td className="p-3">
                        <span className="font-semibold text-yellow-600 dark:text-yellow-500">
                          {item.quantity}
                        </span>
                      </td>
                      <td className="p-3">
                        <StatusBadge qty={item.quantity} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && lowStock?.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                <svg
                  className="w-8 h-8 text-green-600 dark:text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <p className="text-muted-foreground">
                All items are well stocked!
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
