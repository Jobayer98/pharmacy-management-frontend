"use client";

import React, { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { StatCard } from "@/components/StatCard";

export default function DashboardPage() {
  const { role, setUser } = useUserStore();

  useEffect(() => {
    if (!role) {
      setUser({
        token: "mock-token",
        role: "admin",
        name: "Dev Admin",
      });
    }
  }, [role, setUser]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Medicines" value={128} icon="Box" />
        <StatCard title="Suppliers" value={12} icon="Users" />
        <StatCard title="Today Sales" value={"৳ 5,200"} icon="ShoppingCart" />
        <StatCard title="Low Stock Items" value={5} icon="FileText" />
      </div>

      <div className="mt-8 p-6 rounded-xl bg-white dark:bg-zinc-900 shadow border dark:border-zinc-800">
        <h2 className="text-xl font-semibold mb-4">Quick Overview</h2>
        <p className="text-sm text-muted-foreground">
          Charts and graphs will be added later when data is connected.
        </p>
      </div>
    </div>
  );
}
