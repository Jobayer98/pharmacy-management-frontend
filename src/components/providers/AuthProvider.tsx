"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { refreshTokenApi } from "@/lib/api/auth";
import { toast } from "sonner";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    token,
    _hasHydrated,
    isTokenExpired,
    shouldRefreshToken,
    updateToken,
    logout,
  } = useUserStore();
  const isRefreshing = useRef(false);

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

  // Auto token refresh - check every 30 seconds
  useEffect(() => {
    if (!token) return;

    const handleTokenRefresh = async () => {
      // Prevent multiple simultaneous refresh attempts
      if (isRefreshing.current) return;

      if (shouldRefreshToken()) {
        isRefreshing.current = true;
        try {
          // No payload needed - refresh token is in HttpOnly cookie
          const response = await refreshTokenApi();
          updateToken(response.access_token, response.expires_in);
          console.log("Token refreshed successfully");
        } catch (error: any) {
          console.error("Token refresh failed:", error);
          // If refresh fails, logout user
          if (
            error?.response?.status === 401 ||
            error?.response?.status === 400
          ) {
            toast.error("Session expired. Please login again.");
            logout();
          }
        } finally {
          isRefreshing.current = false;
        }
      }
    };

    // Check immediately
    handleTokenRefresh();

    // Then check every 30 seconds
    const interval = setInterval(handleTokenRefresh, 30000);

    return () => clearInterval(interval);
  }, [token, shouldRefreshToken, updateToken, logout]);

  // Auto logout check if token is expired
  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      if (isTokenExpired()) {
        toast.error("Session expired. Please login again.");
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
