"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, _hasHydrated, isTokenExpired, logout } = useUserStore();

  // Handle route protection
  useEffect(() => {
    // Wait for store to hydrate from localStorage
    if (!_hasHydrated) return;

    // Check token expiration first
    if (token && isTokenExpired()) {
      logout();
      return;
    }

    // Public routes that don't require authentication
    const publicRoutes = ["/login", "/register"];
    const isPublicRoute = publicRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // Only perform redirects when necessary
    const shouldRedirect =
      (pathname === "/" && token) || // Root with token -> dashboard
      (pathname === "/" && !token) || // Root without token -> login
      (pathname === "/login" && token) || // Login page with token -> dashboard
      (!isPublicRoute && !token); // Protected route without token -> login

    if (!shouldRedirect) {
      // User is on a valid route for their auth state, don't redirect
      return;
    }

    // Perform the appropriate redirect
    if (pathname === "/" && token) {
      router.replace("/dashboard");
    } else if (pathname === "/" && !token) {
      router.replace("/login");
    } else if (pathname === "/login" && token) {
      router.replace("/dashboard");
    } else if (!isPublicRoute && !token) {
      router.replace("/login");
    }
  }, [_hasHydrated, token, pathname, router, isTokenExpired, logout]);

  // Auto logout check every minute
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      if (isTokenExpired()) {
        logout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [token, isTokenExpired, logout]);

  // Show loading while hydrating
  if (!_hasHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 dark:border-gray-100"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
