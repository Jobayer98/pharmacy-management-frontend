"use client";

import React from "react";
import { RenderIcon, IconKey } from "./icons";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: IconKey;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="p-5 rounded-xl bg-white dark:bg-zinc-900 shadow border border-gray-100 dark:border-zinc-800 flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
      <div className="p-3 rounded-lg bg-gray-100 dark:bg-zinc-800">
        <RenderIcon name={icon} className="w-6 h-6" />
      </div>
    </div>
  );
};
