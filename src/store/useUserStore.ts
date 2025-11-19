import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { isJWTExpired } from "@/lib/utils/jwt";

export type Role = "admin" | "manager" | "sales" | string | null;

interface UserState {
    token: string | null;
    refreshToken: string | null;
    expiresAt: number | null;
    role: Role;
    name: string | null;
    email: string | null;
    userId: number | null;
    _hasHydrated: boolean;

    setUser: (payload: {
        token: string;
        refreshToken: string;
        expiresIn: number;
        role: Role;
        name: string;
        email: string;
        userId: number;
    }) => void;

    logout: () => void;
    isTokenExpired: () => boolean;
    setHasHydrated: (state: boolean) => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            token: null,
            refreshToken: null,
            expiresAt: null,
            role: null,
            name: null,
            email: null,
            userId: null,
            _hasHydrated: false,

            setUser: ({ token, refreshToken, expiresIn, role, name, email, userId }) => {
                const expiresAt = Date.now() + expiresIn * 1000;
                set(() => ({ token, refreshToken, expiresAt, role, name, email, userId }));
            },

            logout: () => {
                set(() => ({
                    token: null,
                    refreshToken: null,
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
