"use client";
import React from "react";
import { ThemeToggle } from "./ThemeToggle";

export const Topbar: React.FC = () => {
  return (
    <header className="w-full h-14 flex items-center justify-between px-4 border-b dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/60">
      <div className="flex items-center gap-4">
        <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800">
          ☰
        </button>
        <h2 className="text-lg font-semibold">Dashboard</h2>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        {/* future: notifications, profile dropdown */}
      </div>
    </header>
  );
};
