import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '@/types';

interface CartState {
    items: CartItem[];
    addItem: (product: Product, quantity: number) => void;
    removeItem: (itemId: string) => void;
    updateQuantity: (itemId: string, quantity: number) => void;
    clearCart: () => void;
    getTotal: () => number;
    getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product: Product, quantity: number) => {
                const items = get().items;
                const existingItem = items.find((item) => item.product.id === product.id);

                if (existingItem) {
                    // Update quantity if item already exists
                    set({
                        items: items.map((item) =>
                            item.product.id === product.id
                                ? { ...item, quantity: item.quantity + quantity }
                                : item
                        ),
                    });
                } else {
                    // Add new item
                    const newItem: CartItem = {
                        id: Math.random().toString(36).substr(2, 9),
                        cartId: 'local',
                        product,
                        quantity,
                        createdAt: new Date().toISOString(),
                    };
                    set({ items: [...items, newItem] });
                }
            },

            removeItem: (itemId: string) => {
                set({ items: get().items.filter((item) => item.id !== itemId) });
            },

            updateQuantity: (itemId: string, quantity: number) => {
                if (quantity <= 0) {
                    get().removeItem(itemId);
                    return;
                }

                set({
                    items: get().items.map((item) =>
                        item.id === itemId ? { ...item, quantity } : item
                    ),
                });
            },

            clearCart: () => {
                set({ items: [] });
            },

            getTotal: () => {
                return get().items.reduce(
                    (total, item) => total + (item.product.salePrice || 0) * item.quantity,
                    0
                );
            },

            getItemCount: () => {
                return get().items.reduce((count, item) => count + item.quantity, 0);
            },
        }),
        {
            name: 'cart-storage',
        }
    )
);
