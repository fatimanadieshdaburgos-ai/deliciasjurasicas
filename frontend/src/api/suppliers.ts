import apiClient from './client';
import { PaginatedResponse } from '@/types';

export interface Supplier {
    id: string;
    name: string;
    contactName?: string;
    email?: string;
    phone?: string;
    address?: string;
    taxId?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    _count?: {
        products: number;
    };
}

export interface CreateSupplierDto {
    name: string;
    contactName?: string;
    email?: string;
    phone?: string;
    address?: string;
    taxId?: string;
    isActive?: boolean;
}

export interface UpdateSupplierDto extends Partial<CreateSupplierDto> { }

export const suppliersApi = {
    getAll: async (page = 1, limit = 20, search = ''): Promise<PaginatedResponse<Supplier>> => {
        const { data } = await apiClient.get<PaginatedResponse<Supplier>>('/suppliers', {
            params: { page, limit, search },
        });
        return data;
    },

    getById: async (id: string): Promise<Supplier> => {
        const { data } = await apiClient.get<Supplier>(`/suppliers/${id}`);
        return data;
    },

    create: async (supplierData: CreateSupplierDto): Promise<Supplier> => {
        const { data } = await apiClient.post<Supplier>('/suppliers', supplierData);
        return data;
    },

    update: async (id: string, supplierData: UpdateSupplierDto): Promise<Supplier> => {
        const { data } = await apiClient.patch<Supplier>(`/suppliers/${id}`, supplierData);
        return data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/suppliers/${id}`);
    },
};
