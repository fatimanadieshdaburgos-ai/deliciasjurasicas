import { Injectable } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { startOfDay, endOfDay, subDays, format } from 'date-fns';

@Injectable()
export class ReportsService {
    constructor(private prisma: PrismaService) { }

    async getDashboardStats() {
        const today = new Date();
        const start = startOfDay(today);
        const end = endOfDay(today);

        const [
            todaySales,
            totalOrders,
            lowStockCount,
            activeProducts
        ] = await Promise.all([
            this.prisma.order.aggregate({
                where: {
                    createdAt: { gte: start, lte: end },
                    status: { not: 'CANCELLED' }
                },
                _sum: { total: true }
            }),
            this.prisma.order.count({
                where: { createdAt: { gte: start, lte: end } }
            }),
            this.prisma.product.count({
                where: {
                    isActive: true,
                    currentStock: { lte: 10 } // Simplified low stock check
                }
            }),
            this.prisma.product.count({ where: { isActive: true } })
        ]);

        return {
            todaySales: todaySales._sum.total || 0,
            totalOrders,
            lowStockCount,
            activeProducts
        };
    }

    async getSalesReport(startDate?: string, endDate?: string) {
        const start = startDate ? new Date(startDate) : subDays(new Date(), 30);
        const end = endDate ? new Date(endDate) : new Date();

        const sales = await this.prisma.order.findMany({
            where: {
                createdAt: { gte: start, lte: end },
                status: { not: 'CANCELLED' }
            },
            include: {
                items: {
                    include: { product: true }
                }
            },
            orderBy: { createdAt: 'asc' }
        });

        // Aggregate by day
        const salesByDay = sales.reduce((acc, order) => {
            const date = format(order.createdAt, 'yyyy-MM-dd');
            acc[date] = (acc[date] || 0) + Number(order.total);
            return acc;
        }, {} as Record<string, number>);

        // Aggregate by product
        const salesByProduct = sales.reduce((acc, order) => {
            order.items.forEach(item => {
                const productName = item.product?.name || 'Unknown';
                acc[productName] = (acc[productName] || 0) + item.quantity;
            });
            return acc;
        }, {} as Record<string, number>);

        return {
            totalSales: sales.reduce((sum, order) => sum + Number(order.total), 0),
            count: sales.length,
            salesByDay: Object.entries(salesByDay).map(([date, total]) => ({ date, total })),
            salesByProduct: Object.entries(salesByProduct)
                .map(([name, quantity]) => ({ name, quantity }))
                .sort((a, b) => b.quantity - a.quantity)
                .slice(0, 10)
        };
    }

    async getInventoryReport() {
        const products = await this.prisma.product.findMany({
            where: { isActive: true },
            include: { category: true }
        });

        const totalValue = products.reduce((sum, p) => sum + (Number(p.salePrice || 0) * p.currentStock), 0);
        const lowStock = products.filter(p => p.currentStock <= (p.minStock || 5));

        const stockByCategory = products.reduce((acc, p) => {
            const catName = p.category?.name || 'Sin Categoría';
            acc[catName] = (acc[catName] || 0) + p.currentStock;
            return acc;
        }, {} as Record<string, number>);

        return {
            totalProducts: products.length,
            totalValue,
            lowStockCount: lowStock.length,
            lowStockItems: lowStock.map(p => ({
                id: p.id,
                name: p.name,
                stock: p.currentStock,
                minStock: p.minStock
            })),
            stockByCategory: Object.entries(stockByCategory).map(([name, count]) => ({ name, count }))
        };
    }
}
