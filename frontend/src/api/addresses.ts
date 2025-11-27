import apiClient from './client';

export interface Address {
    id: string;
    recipientName: string;
    phone: string;
    street: string;
    number: string;
    apartment?: string;
    neighborhood?: string;
    city: string;
    state: string;
    zipCode?: string;
    label?: string;
    isDefault: boolean;
}

export interface CreateAddressDto {
    recipientName: string;
    phone: string;
    street: string;
    number: string;
    apartment?: string;
    neighborhood?: string;
    city: string;
    state: string;
    zipCode?: string;
    label?: string;
    isDefault?: boolean;
}

export const addressesApi = {
    getAll: async (): Promise<Address[]> => {
        const { data } = await apiClient.get<Address[]>('/addresses');
        return data;
    },

    create: async (data: CreateAddressDto): Promise<Address> => {
        const { data: response } = await apiClient.post<Address>('/addresses', data);
        return response;
    },

    update: async (id: string, data: Partial<CreateAddressDto>): Promise<Address> => {
        const { data: response } = await apiClient.patch<Address>(`/addresses/${id}`, data);
        return response;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/addresses/${id}`);
    },
};
