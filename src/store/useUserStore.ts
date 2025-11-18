import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Role = "admin" | "manager" | "sales" | string | null;

interface UserState {
    token: string | null;
    role: Role;
    name: string | null;
    email: string | null;
    userId: number | null;

    setUser: (payload: {
        token: string;
        role: Role;
        name: string;
        email: string;
        userId: number;
    }) => void;

    logout: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            token: null,
            role: null,
            name: null,
            email: null,
            userId: null,

            setUser: ({ token, role, name, email, userId }) =>
                set(() => ({ token, role, name, email, userId })),

            logout: () => {
                set(() => ({
                    token: null,
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
        }),
        {
            name: "user-storage", // name of the item in localStorage
            storage: createJSONStorage(() => localStorage),
        }
    )
);
