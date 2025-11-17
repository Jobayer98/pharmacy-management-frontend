"use client";
import React from "react";
import Link from "next/link";
import { RenderIcon } from "./icons";
import { useUserStore } from "@/store/useUserStore";

type NavItem = {
  key: string;
  label: string;
  href: string;
  icon: Parameters<typeof RenderIcon>[0]["name"];
  roles?: Array<"admin" | "manager" | "sales">; // optional: allowed roles
};

const NAV_ITEMS: NavItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: "Home",
    roles: ["admin", "manager", "sales"],
  },
  {
    key: "medicine",
    label: "Medicine",
    href: "/medicine",
    icon: "Box",
    roles: ["admin", "manager"],
  },
  {
    key: "supplier",
    label: "Supplier",
    href: "/supplier",
    icon: "Users",
    roles: ["admin", "manager"],
  },
  {
    key: "purchase",
    label: "Purchase",
    href: "/purchase",
    icon: "ShoppingCart",
    roles: ["admin", "manager"],
  },
  {
    key: "inventory",
    label: "Inventory",
    href: "/inventory",
    icon: "FileText",
    roles: ["admin", "manager"],
  },
  {
    key: "sales",
    label: "Sales",
    href: "/sales",
    icon: "FileText",
    roles: ["admin", "sales"],
  },
  {
    key: "settings",
    label: "Settings",
    href: "/settings",
    icon: "Settings",
    roles: ["admin"],
  },
];

export const Sidebar: React.FC = () => {
  const { role, name, logout } = useUserStore();

  return (
    <aside className="w-72 min-h-screen bg-white dark:bg-zinc-900 border-r dark:border-zinc-800 p-4">
      <div className="mb-6">
        <h1 className="text-xl font-semibold">Pharmacy</h1>
        <p className="text-sm text-muted-foreground">Management</p>
      </div>

      <nav className="space-y-1">
        {NAV_ITEMS.filter(
          (item) => !item.roles || item.roles.includes(role as any)
        ).map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <RenderIcon name={item.icon} />
            <span className="text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-8 pt-6 border-t dark:border-zinc-800">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{name ?? "Guest"}</p>
            <p className="text-xs text-muted-foreground">{role ?? "No role"}</p>
          </div>

          <button
            onClick={logout}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <RenderIcon name="LogOut" />
          </button>
        </div>
      </div>
    </aside>
  );
};
