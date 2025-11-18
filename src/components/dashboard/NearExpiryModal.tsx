"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface NearExpiryItem {
  batch_id: number;
  medicine_id: number;
  batch_no: string;
  expiry_date: string;
  quantity: number;
}

interface NearExpiryModalProps {
  open: boolean;
  onClose: () => void;
  nearExpiry: NearExpiryItem[] | undefined;
  isLoading: boolean;
}

export const NearExpiryModal: React.FC<NearExpiryModalProps> = ({
  open,
  onClose,
  nearExpiry,
  isLoading,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <svg
                className="w-5 h-5 text-orange-600 dark:text-orange-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <DialogTitle>Near Expiry Items</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                {nearExpiry?.length || 0} items expiring soon
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-4 overflow-y-auto max-h-[calc(80vh-120px)]">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            </div>
          )}

          {!isLoading && nearExpiry && nearExpiry.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border dark:border-zinc-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-orange-50 dark:bg-orange-900/20 sticky top-0">
                  <tr>
                    <th className="p-3 text-left font-semibold">Batch No</th>
                    <th className="p-3 text-left font-semibold">Medicine ID</th>
                    <th className="p-3 text-left font-semibold">Expiry Date</th>
                    <th className="p-3 text-left font-semibold">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {nearExpiry.map((item, index) => (
                    <tr
                      key={item.batch_id}
                      className={`border-t dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors ${
                        index % 2 === 0 ? "bg-white dark:bg-zinc-900" : "bg-gray-50/50 dark:bg-zinc-900/50"
                      }`}
                    >
                      <td className="p-3 font-medium">{item.batch_no}</td>
                      <td className="p-3 text-muted-foreground">
                        #{item.medicine_id}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-orange-600 dark:text-orange-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <span className="font-medium text-orange-600 dark:text-orange-500">
                            {item.expiry_date}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 font-semibold">{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && nearExpiry?.length === 0 && (
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
                No items expiring soon!
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
