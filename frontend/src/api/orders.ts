import apiClient from './client';
import { Order, CreateOrderDto, PaginatedResponse } from '@/types';

export const ordersApi = {
    // Get all orders (filtered by user role)
    getAll: async (page = 1, limit = 20): Promise<PaginatedResponse<Order>> => {
        const { data } = await apiClient.get<PaginatedResponse<Order>>('/orders', {
            params: { page, limit },
        });
        return data;
    },

    // Get single order
    getById: async (id: string): Promise<Order> => {
        const { data } = await apiClient.get<Order>(`/orders/${id}`);
        return data;
    },

    // Create order
    create: async (orderData: CreateOrderDto): Promise<Order> => {
        const { data } = await apiClient.post<Order>('/orders', orderData);
        return data;
    },

    // Update order status
    updateStatus: async (id: string, status: string): Promise<Order> => {
        const { data } = await apiClient.patch<Order>(`/orders/${id}/status`, { status });
        return data;
    },
};
