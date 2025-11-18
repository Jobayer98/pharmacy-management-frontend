"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ExpiredItem {
  batch_id: number;
  batch_no: string;
  medicine_id: number;
  expiry_date: string;
  quantity: number;
}

interface ExpiredModalProps {
  open: boolean;
  onClose: () => void;
  expired: ExpiredItem[] | undefined;
  isLoading: boolean;
}

export const ExpiredModal: React.FC<ExpiredModalProps> = ({
  open,
  onClose,
  expired,
  isLoading,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Expired Items</DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {isLoading && <p>Loading...</p>}

          {!isLoading && expired && expired.length > 0 && (
            <div className="bg-white dark:bg-zinc-900 rounded-xl border dark:border-zinc-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 dark:bg-zinc-800">
                  <tr>
                    <th className="p-3 text-left">Batch No</th>
                    <th className="p-3 text-left">Medicine ID</th>
                    <th className="p-3 text-left">Expiry Date</th>
                    <th className="p-3 text-left">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {expired.map((item) => (
                    <tr
                      key={item.batch_id}
                      className="border-t dark:border-zinc-800"
                    >
                      <td className="p-3">{item.batch_no}</td>
                      <td className="p-3">{item.medicine_id}</td>
                      <td className="p-3 text-red-600 font-medium">
                        {item.expiry_date}
                      </td>
                      <td className="p-3">{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!isLoading && expired?.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No expired items
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
