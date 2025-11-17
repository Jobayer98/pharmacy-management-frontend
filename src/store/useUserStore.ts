import { create } from "zustand";

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

export const useUserStore = create<UserState>((set) => ({
    token: null,
    role: null,
    name: null,
    email: null,
    userId: null,

    setUser: ({ token, role, name, email, userId }) =>
        set(() => ({ token, role, name, email, userId })),

    logout: () =>
        set(() => ({
            token: null,
            role: null,
            name: null,
            email: null,
            userId: null,
        })),
}));
