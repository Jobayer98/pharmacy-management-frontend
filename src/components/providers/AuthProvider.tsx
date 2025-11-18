"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const token = useUserStore((state) => state.token);

  useEffect(() => {
    // Public routes that don't require authentication
    const publicRoutes = ["/login", "/register"];
    const isPublicRoute = publicRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // If not on a public route and no token, redirect to login
    if (!isPublicRoute && !token) {
      router.push("/login");
    }

    // If on login page and has token, redirect to dashboard
    if (pathname === "/login" && token) {
      router.push("/dashboard");
    }
  }, [token, pathname, router]);

  return <>{children}</>;
}
