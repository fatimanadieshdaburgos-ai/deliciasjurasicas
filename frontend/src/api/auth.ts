import apiClient from './client';
import { LoginCredentials, RegisterData, AuthResponse, User } from '@/types';

export const authApi = {
    // Login
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const { data } = await apiClient.post<AuthResponse>('/auth/login', credentials);
        return data;
    },

    // Register
    register: async (userData: RegisterData): Promise<AuthResponse> => {
        const { data } = await apiClient.post<AuthResponse>('/auth/register', userData);
        return data;
    },

    // Get current user profile
    getProfile: async (): Promise<User> => {
        const { data } = await apiClient.get<User>('/auth/me');
        return data;
    },

    // Logout (client-side)
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
};
