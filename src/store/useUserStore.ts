import { create } from "zustand";

export type Role = "admin" | "manager" | "sales" | null;

type UserState = {
    token: string | null;
    role: Role;
    name: string | null;
    setUser: (payload: { token: string | null; role: Role; name?: string | null }) => void;
    logout: () => void;
};

export const useUserStore = create<UserState>((set) => ({
    token: null,
    role: null,
    name: null,
    setUser: ({ token, role, name = null }) =>
        set(() => ({ token, role, name })),
    logout: () => set(() => ({ token: null, role: null, name: null })),
}));
