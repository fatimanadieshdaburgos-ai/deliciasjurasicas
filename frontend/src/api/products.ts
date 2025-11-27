import apiClient from './client';
import { Product, ProductFilter, PaginatedResponse } from '@/types';

export const productsApi = {
    // Get all products with filters
    getAll: async (filters?: ProductFilter): Promise<PaginatedResponse<Product>> => {
        const { data } = await apiClient.get<PaginatedResponse<Product>>('/products', {
            params: filters,
        });
        return data;
    },

    // Get featured products
    getFeatured: async (): Promise<Product[]> => {
        const { data } = await apiClient.get<Product[]>('/products/featured');
        return data;
    },

    // Get low stock products
    getLowStock: async (): Promise<Product[]> => {
        const { data } = await apiClient.get<Product[]>('/products/low-stock');
        return data;
    },

    // Get single product
    getById: async (id: string): Promise<Product> => {
        const { data } = await apiClient.get<Product>(`/products/${id}`);
        return data;
    },

    // Create product (Admin/Panadero only)
    create: async (productData: Partial<Product>): Promise<Product> => {
        const { data } = await apiClient.post<Product>('/products', productData);
        return data;
    },

    // Update product
    update: async (id: string, productData: Partial<Product>): Promise<Product> => {
        const { data } = await apiClient.patch<Product>(`/products/${id}`, productData);
        return data;
    },

    // Delete product
    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/products/${id}`);
    },
};
