import apiClient from './client';
import { CartItem, Cart } from '@/types';

export const cartApi = {
    // Get current cart
    get: async (): Promise<Cart> => {
        const { data } = await apiClient.get<Cart>('/cart');
        return data;
    },

    // Add item to cart
    addItem: async (productId: string, quantity: number): Promise<CartItem> => {
        const { data } = await apiClient.post<CartItem>('/cart/items', {
            productId,
            quantity,
        });
        return data;
    },

    // Remove item from cart
    removeItem: async (itemId: string): Promise<void> => {
        await apiClient.delete(`/cart/items/${itemId}`);
    },

    // Clear cart
    clear: async (): Promise<void> => {
        await apiClient.delete('/cart');
    },
};
