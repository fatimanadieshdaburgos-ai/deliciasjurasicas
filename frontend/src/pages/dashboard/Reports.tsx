import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '@/api/reports';
import { BarChart3, Package, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { format, subDays } from 'date-fns';

export default function Reports() {
    const [activeTab, setActiveTab] = useState<'sales' | 'inventory'>('sales');
    const [dateRange, setDateRange] = useState({
        start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
        end: format(new Date(), 'yyyy-MM-dd'),
    });

    const { data: stats, isLoading: statsLoading } = useQuery({
        queryKey: ['dashboard-stats'],
        queryFn: reportsApi.getDashboardStats,
    });

    const { data: salesReport, isLoading: salesLoading } = useQuery({
        queryKey: ['sales-report', dateRange],
        queryFn: () => reportsApi.getSalesReport(dateRange.start, dateRange.end),
        enabled: activeTab === 'sales',
    });

    const { data: inventoryReport, isLoading: inventoryLoading } = useQuery({
        queryKey: ['inventory-report'],
        queryFn: reportsApi.getInventoryReport,
        enabled: activeTab === 'inventory',
    });

    if (statsLoading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="w-8 h-8 text-primary" />
                Reportes y Estadísticas
            </h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                            <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Ventas Hoy</p>
                            <p className="text-2xl font-bold text-gray-900">${stats?.todaySales.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Pedidos Hoy</p>
                            <p className="text-2xl font-bold text-gray-900">{stats?.totalOrders}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Productos Activos</p>
                            <p className="text-2xl font-bold text-gray-900">{stats?.activeProducts}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-100 text-red-600 rounded-lg">
                            <Package className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Stock Bajo</p>
                            <p className="text-2xl font-bold text-gray-900">{stats?.lowStockCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex gap-6">
                    <button
                        onClick={() => setActiveTab('sales')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'sales'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Reporte de Ventas
                    </button>
                    <button
                        onClick={() => setActiveTab('inventory')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'inventory'
                                ? 'border-primary text-primary'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Reporte de Inventario
                    </button>
                </nav>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {activeTab === 'sales' && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <input
                                    type="date"
                                    className="input py-1"
                                    value={dateRange.start}
                                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                                />
                                <span className="text-gray-400">a</span>
                                <input
                                    type="date"
                                    className="input py-1"
                                    value={dateRange.end}
                                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                                />
                            </div>
                        </div>

                        {salesLoading ? <LoadingSpinner /> : (
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-lg font-bold mb-4">Ventas por Día</h3>
                                    <div className="overflow-x-auto">
                                        <table className="table w-full">
                                            <thead>
                                                <tr>
                                                    <th className="text-left">Fecha</th>
                                                    <th className="text-right">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {salesReport?.salesByDay.map((item) => (
                                                    <tr key={item.date}>
                                                        <td>{item.date}</td>
                                                        <td className="text-right font-mono">${item.total.toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                                {salesReport?.salesByDay.length === 0 && (
                                                    <tr><td colSpan={2} className="text-center py-4 text-gray-500">No hay datos</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold mb-4">Top Productos Vendidos</h3>
                                    <div className="overflow-x-auto">
                                        <table className="table w-full">
                                            <thead>
                                                <tr>
                                                    <th className="text-left">Producto</th>
                                                    <th className="text-right">Cantidad</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {salesReport?.salesByProduct.map((item) => (
                                                    <tr key={item.name}>
                                                        <td>{item.name}</td>
                                                        <td className="text-right font-mono">{item.quantity}</td>
                                                    </tr>
                                                ))}
                                                {salesReport?.salesByProduct.length === 0 && (
                                                    <tr><td colSpan={2} className="text-center py-4 text-gray-500">No hay datos</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'inventory' && (
                    <div className="space-y-6">
                        {inventoryLoading ? <LoadingSpinner /> : (
                            <div className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-500">Valor Total Inventario</p>
                                        <p className="text-2xl font-bold text-gray-900">${inventoryReport?.totalValue.toFixed(2)}</p>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-500">Total Productos</p>
                                        <p className="text-2xl font-bold text-gray-900">{inventoryReport?.totalProducts}</p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <h3 className="text-lg font-bold mb-4">Stock por Categoría</h3>
                                        <table className="table w-full">
                                            <thead>
                                                <tr>
                                                    <th className="text-left">Categoría</th>
                                                    <th className="text-right">Stock Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {inventoryReport?.stockByCategory.map((item) => (
                                                    <tr key={item.name}>
                                                        <td>{item.name}</td>
                                                        <td className="text-right font-mono">{item.count}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold mb-4 text-red-600">Productos con Stock Bajo</h3>
                                        <table className="table w-full">
                                            <thead>
                                                <tr>
                                                    <th className="text-left">Producto</th>
                                                    <th className="text-right">Stock</th>
                                                    <th className="text-right">Mínimo</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {inventoryReport?.lowStockItems.map((item) => (
                                                    <tr key={item.id}>
                                                        <td>{item.name}</td>
                                                        <td className="text-right font-mono font-bold text-red-600">{item.stock}</td>
                                                        <td className="text-right font-mono text-gray-500">{item.minStock}</td>
                                                    </tr>
                                                ))}
                                                {inventoryReport?.lowStockItems.length === 0 && (
                                                    <tr><td colSpan={3} className="text-center py-4 text-gray-500">Todo en orden</td></tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
