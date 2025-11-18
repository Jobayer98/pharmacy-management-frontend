import {
  Home,
  Box,
  Users,
  ShoppingCart,
  FileText,
  Settings,
  LogOut,
  Sun,
  Moon,
  Pill,
  TrendingUp,
  PackageSearch,
  Warehouse,
  Receipt,
  LayoutDashboard,
} from "lucide-react";

export const Icons = {
  Home,
  Box,
  Users,
  ShoppingCart,
  FileText,
  Settings,
  LogOut,
  Sun,
  Moon,
  Pill,
  TrendingUp,
  PackageSearch,
  Warehouse,
  Receipt,
  LayoutDashboard,
} as const;

export type IconKey = keyof typeof Icons;

export function RenderIcon({
  name,
  className = "h-5 w-5",
}: {
  name: IconKey;
  className?: string;
}) {
  const Icon = Icons[name];
  return <Icon className={className} />;
}
