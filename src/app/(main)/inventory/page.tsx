"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";

import { getInventory, type InventoryItem } from "@/lib/api/inventory";
import {
  getLowStock,
  getNearExpiry,
  getExpiredStock,
} from "@/lib/api/inventory";
import { StatusBadge } from "@/components/ui/status-badge";

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [page] = useState(1);
  const [limit] = useState(10);

  // ➤ ALL INVENTORY
  const inventoryQuery = useQuery({
    queryKey: ["inventory", page, limit],
    queryFn: () =>
      getInventory({
        page,
        limit,
      }),
  });

  const items = inventoryQuery.data?.items ?? [];

  const filtered = items.filter((i: InventoryItem) =>
    i.medicine_name.toLowerCase().includes(search.toLowerCase())
  );

  // ➤ LOW STOCK
  const lowStockQuery = useQuery({
    queryKey: ["inventory-low"],
    queryFn: getLowStock,
  });

  // ➤ NEAR EXPIRY
  const nearExpiryQuery = useQuery({
    queryKey: ["inventory-near-expiry"],
    queryFn: getNearExpiry,
  });

  // ➤ EXPIRED
  const expiredQuery = useQuery({
    queryKey: ["inventory-expired"],
    queryFn: getExpiredStock,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Inventory</h1>

      {/* Search for ALL tab only */}
      <Input
        placeholder="Search medicine in inventory..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {/* Tabs */}
      <Tabs defaultValue="all" className="mt-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="low">Low Stock</TabsTrigger>
          <TabsTrigger value="near">Near Expiry</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>

        {/* ALL INVENTORY TABLE          */}

        <TabsContent value="all">
          {inventoryQuery.isLoading && <p>Loading all inventory...</p>}

          <div className="mt-4 bg-white dark:bg-zinc-900 rounded-xl shadow border dark:border-zinc-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-zinc-800">
                <tr>
                  <th className="p-3 text-left">Medicine</th>
                  <th className="p-3 text-left">Quantity</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((row) => (
                  <tr
                    key={row.medicine_id}
                    className="border-t dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition"
                  >
                    <td className="p-3 font-medium">{row.medicine_name}</td>
                    <td className="p-3 flex items-center gap-2">
                      {row.quantity}
                      <StatusBadge qty={row.quantity} />
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={2}
                      className="p-4 text-center text-muted-foreground"
                    >
                      No items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* LOW STOCK TABLE              */}

        <TabsContent value="low">
          {lowStockQuery.isLoading && <p>Loading...</p>}

          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow border dark:border-zinc-800 overflow-hidden mt-4">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-zinc-800">
                <tr>
                  <th className="p-3 text-left">Medicine</th>
                  <th className="p-3 text-left">Stock</th>
                </tr>
              </thead>

              <tbody>
                {lowStockQuery.data?.map((item) => (
                  <tr
                    key={item.medicine_id}
                    className="border-t dark:border-zinc-800"
                  >
                    <td className="p-3">{item.name}</td>
                    <td className="p-3 flex items-center gap-2">
                      {item.total_stock}
                      <StatusBadge qty={item.total_stock} />
                    </td>
                  </tr>
                ))}

                {lowStockQuery.data?.length === 0 && (
                  <tr>
                    <td colSpan={2} className="p-4 text-center">
                      No low stock items
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* NEAR EXPIRY TABLE            */}

        <TabsContent value="near">
          {nearExpiryQuery.isLoading && <p>Loading...</p>}

          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow border dark:border-zinc-800 overflow-hidden mt-4">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-zinc-800">
                <tr>
                  <th className="p-3 text-left">Batch No</th>
                  <th className="p-3 text-left">Medicine ID</th>
                  <th className="p-3 text-left">Expiry</th>
                  <th className="p-3 text-left">Qty</th>
                </tr>
              </thead>

              <tbody>
                {nearExpiryQuery.data?.map((item) => (
                  <tr
                    key={item.batch_id}
                    className="border-t dark:border-zinc-800"
                  >
                    <td className="p-3">{item.batch_no}</td>
                    <td className="p-3">{item.medicine_id}</td>
                    <td className="p-3">{item.expiry_date}</td>
                    <td className="p-3">{item.quantity}</td>
                  </tr>
                ))}

                {nearExpiryQuery.data?.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center">
                      No near-expiry batches
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>

        {/* EXPIRED TABLE                */}

        <TabsContent value="expired">
          {expiredQuery.isLoading && <p>Loading...</p>}

          <div className="bg-white dark:bg-zinc-900 rounded-xl shadow border dark:border-zinc-800 overflow-hidden mt-4">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 dark:bg-zinc-800">
                <tr>
                  <th className="p-3 text-left">Batch No</th>
                  <th className="p-3 text-left">Medicine ID</th>
                  <th className="p-3 text-left">Expiry</th>
                  <th className="p-3 text-left">Qty</th>
                </tr>
              </thead>

              <tbody>
                {expiredQuery.data?.map((item) => (
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

                {expiredQuery.data?.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center">
                      No expired batches
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
