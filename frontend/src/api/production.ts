import apiClient from './client';
import { ProductionOrder, CreateProductionOrderDto } from '@/types';

export const productionApi = {
    // Get all production orders
    getAll: async (): Promise<ProductionOrder[]> => {
        const { data } = await apiClient.get<ProductionOrder[]>('/production/orders');
        return data;
    },

    // Get single production order
    getById: async (id: string): Promise<ProductionOrder> => {
        const { data } = await apiClient.get<ProductionOrder>(`/production/orders/${id}`);
        return data;
    },

    // Create production order
    create: async (orderData: CreateProductionOrderDto): Promise<ProductionOrder> => {
        const { data } = await apiClient.post<ProductionOrder>('/production/orders', orderData);
        return data;
    },

    // Start production
    start: async (id: string): Promise<ProductionOrder> => {
        const { data } = await apiClient.patch<ProductionOrder>(`/production/orders/${id}/start`);
        return data;
    },

    // Complete production (descuenta insumos)
    complete: async (id: string): Promise<ProductionOrder> => {
        const { data } = await apiClient.patch<ProductionOrder>(`/production/orders/${id}/complete`);
        return data;
    },

    // Cancel production
    cancel: async (id: string): Promise<ProductionOrder> => {
        const { data } = await apiClient.patch<ProductionOrder>(`/production/orders/${id}/cancel`);
        return data;
    },
};
