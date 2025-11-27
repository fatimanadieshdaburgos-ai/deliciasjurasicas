import apiClient from './client';
import { User } from '@/types';

export interface UpdateProfileDto {
    firstName?: string;
    lastName?: string;
    phone?: string;
    password?: string;
}

export const usersApi = {
    updateProfile: async (data: UpdateProfileDto): Promise<User> => {
        const { data: response } = await apiClient.patch<User>('/users/profile', data);
        return response;
    },
};
