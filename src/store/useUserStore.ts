import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { isJWTExpired } from "@/lib/utils/jwt";

export type Role = "admin" | "manager" | "sales" | string | null;

interface UserState {
    token: string | null;
    expiresAt: number | null;
    role: Role;
    name: string | null;
    email: string | null;
    userId: number | null;
    _hasHydrated: boolean;

    setUser: (payload: {
        token: string;
        expiresIn: number;
        role: Role;
        name: string;
        email: string;
        userId: number;
    }) => void;

    updateToken: (token: string, expiresIn: number) => void;
    logout: () => void;
    isTokenExpired: () => boolean;
    shouldRefreshToken: () => boolean;
    setHasHydrated: (state: boolean) => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            token: null,
            expiresAt: null,
            role: null,
            name: null,
            email: null,
            userId: null,
            _hasHydrated: false,

            setUser: ({ token, expiresIn, role, name, email, userId }) => {
                const expiresAt = Date.now() + expiresIn * 1000;
                set(() => ({ token, expiresAt, role, name, email, userId }));
            },

            updateToken: (token: string, expiresIn: number) => {
                const expiresAt = Date.now() + expiresIn * 1000;
                set(() => ({ token, expiresAt }));
            },

            logout: () => {
                set(() => ({
                    token: null,
                    expiresAt: null,
                    role: null,
                    name: null,
                    email: null,
                    userId: null,
                }));
                // Clear localStorage
                localStorage.removeItem("user-storage");
                // Redirect to login
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
            },

            isTokenExpired: () => {
                const { token, expiresAt } = get();
                if (!token) return true;

                // First check JWT expiration from token itself
                if (isJWTExpired(token)) return true;

                // Fallback to stored expiration time
                if (!expiresAt) return true;
                return Date.now() >= expiresAt;
            },

            shouldRefreshToken: () => {
                const { token, expiresAt } = get();
                if (!token || !expiresAt) return false;

                // Refresh token 3 minutes (180 seconds) before expiration
                const refreshThreshold = 3 * 60 * 1000; // 3 minutes in milliseconds
                const timeUntilExpiry = expiresAt - Date.now();

                return timeUntilExpiry <= refreshThreshold && timeUntilExpiry > 0;
            },

            setHasHydrated: (state) => {
                set({ _hasHydrated: state });
            },
        }),
        {
            name: "user-storage",
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
);
