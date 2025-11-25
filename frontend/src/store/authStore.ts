import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { authApi } from '@/api/auth';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (userData: any) => Promise<void>;
    logout: () => void;
    setUser: (user: User | null) => void;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,

            login: async (email: string, password: string) => {
                set({ isLoading: true });
                try {
                    const response = await authApi.login({ email, password });
                    localStorage.setItem('token', response.accessToken);
                    localStorage.setItem('user', JSON.stringify(response.user));
                    set({
                        user: response.user,
                        token: response.accessToken,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            register: async (userData: any) => {
                set({ isLoading: true });
                try {
                    const response = await authApi.register(userData);
                    localStorage.setItem('token', response.accessToken);
                    localStorage.setItem('user', JSON.stringify(response.user));
                    set({
                        user: response.user,
                        token: response.accessToken,
                        isAuthenticated: true,
                        isLoading: false,
                    });
                } catch (error) {
                    set({ isLoading: false });
                    throw error;
                }
            },

            logout: () => {
                authApi.logout();
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                });
            },

            setUser: (user: User | null) => {
                set({
                    user,
                    isAuthenticated: !!user,
                });
            },

            checkAuth: async () => {
                const token = localStorage.getItem('token');
                if (!token) {
                    set({ user: null, token: null, isAuthenticated: false });
                    return;
                }

                try {
                    const user = await authApi.getProfile();
                    set({
                        user,
                        token,
                        isAuthenticated: true,
                    });
                } catch (error) {
                    // Token invalid or expired
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    set({
                        user: null,
                        token: null,
                        isAuthenticated: false,
                    });
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
