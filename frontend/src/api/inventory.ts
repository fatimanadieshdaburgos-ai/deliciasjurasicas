import apiClient from './client';
import { StockItem, StockMovement } from '@/types';

export const inventoryApi = {
    // Get current stock
    getStock: async (): Promise<StockItem[]> => {
        const { data } = await apiClient.get<StockItem[]>('/inventory/stock');
        return data;
    },

    // Get low stock items
    getLowStock: async (): Promise<StockItem[]> => {
        const { data } = await apiClient.get<StockItem[]>('/inventory/low-stock');
        return data;
    },

    // Get stock movements
    getMovements: async (productId?: string): Promise<StockMovement[]> => {
        const { data } = await apiClient.get<StockMovement[]>('/inventory/movements', {
            params: productId ? { productId } : undefined,
        });
        return data;
    },

    // Adjust stock manually
    adjust: async (productId: string, quantity: number, notes?: string): Promise<void> => {
        await apiClient.post('/inventory/adjust', { productId, quantity, notes });
    },
};
