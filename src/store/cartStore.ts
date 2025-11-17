import { create } from "zustand";

export interface CartItem {
    id: number;
    name: string;
    price: number;
    qty: number;
}

interface CartState {
    items: CartItem[];
    addToCart: (item: Omit<CartItem, "qty">) => void;
    increase: (id: number) => void;
    decrease: (id: number) => void;
    remove: (id: number) => void;
    clear: () => void;
}

export const useCartStore = create<CartState>((set) => ({
    items: [],

    addToCart: (item) =>
        set((state) => {
            const exists = state.items.find((i) => i.id === item.id);
            if (exists) {
                return {
                    items: state.items.map((i) =>
                        i.id === item.id ? { ...i, qty: i.qty + 1 } : i
                    ),
                };
            }
            return { items: [...state.items, { ...item, qty: 1 }] };
        }),

    increase: (id) =>
        set((state) => ({
            items: state.items.map((i) =>
                i.id === id ? { ...i, qty: i.qty + 1 } : i
            ),
        })),

    decrease: (id) =>
        set((state) => ({
            items: state.items
                .map((i) =>
                    i.id === id ? { ...i, qty: Math.max(1, i.qty - 1) } : i
                )
                .filter((i) => i.qty > 0),
        })),

    remove: (id) =>
        set((state) => ({
            items: state.items.filter((i) => i.id !== id),
        })),

    clear: () => set({ items: [] }),
}));
