import apiClient from './client';

export interface DashboardStats {
    todaySales: number;
    totalOrders: number;
    lowStockCount: number;
    activeProducts: number;
}

export interface SalesReport {
    totalSales: number;
    count: number;
    salesByDay: { date: string; total: number }[];
    salesByProduct: { name: string; quantity: number }[];
}

export interface InventoryReport {
    totalProducts: number;
    totalValue: number;
    lowStockCount: number;
    lowStockItems: { id: string; name: string; stock: number; minStock: number }[];
    stockByCategory: { name: string; count: number }[];
}

export const reportsApi = {
    getDashboardStats: async (): Promise<DashboardStats> => {
        const { data } = await apiClient.get<DashboardStats>('/reports/dashboard');
        return data;
    },

    getSalesReport: async (startDate?: string, endDate?: string): Promise<SalesReport> => {
        const { data } = await apiClient.get<SalesReport>('/reports/sales', {
            params: { startDate, endDate },
        });
        return data;
    },

    getInventoryReport: async (): Promise<InventoryReport> => {
        const { data } = await apiClient.get<InventoryReport>('/reports/inventory');
        return data;
    },
};
