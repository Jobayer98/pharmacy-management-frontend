"use client";

import { useUserStore } from "@/store/useUserStore";

export default function DashboardPage() {
  const { role, setUser } = useUserStore();

  // Quick mock: if no role set, set a default for dev
  if (!role) {
    setUser({ token: "mock-token", role: "admin", name: "Dev Admin" });
  }

  return (
    <div>
      <h3 className="text-2xl font-bold mb-4">Dashboard</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-zinc-800 rounded shadow">
          Total Medicine: <strong>128</strong>
        </div>
        <div className="p-4 bg-white dark:bg-zinc-800 rounded shadow">
          Suppliers: <strong>12</strong>
        </div>
        <div className="p-4 bg-white dark:bg-zinc-800 rounded shadow">
          Low Stock: <strong>5</strong>
        </div>
      </div>
    </div>
  );
}
