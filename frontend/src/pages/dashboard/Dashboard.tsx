import { useQuery } from '@tanstack/react-query';
import {
    Package,
    ShoppingBag,
    Factory,
    DollarSign,
    AlertTriangle,
} from 'lucide-react';
import { productsApi } from '@/api/products';
import { ordersApi } from '@/api/orders';
import LoadingSpinner from '@/components/common/LoadingSpinner';

export default function Dashboard() {
    const { data: products, isLoading: loadingProducts } = useQuery({
        queryKey: ['dashboard-products'],
        queryFn: () => productsApi.getAll({ limit: 5 }),
    });

    const { data: orders, isLoading: loadingOrders } = useQuery({
        queryKey: ['dashboard-orders'],
        queryFn: () => ordersApi.getAll(1, 10),
    });

    if (loadingProducts || loadingOrders) {
        return <LoadingSpinner />;
    }

    const stats = [
        {
            label: 'Total Productos',
            value: products?.meta?.total || 0,
            icon: Package,
            color: 'bg-blue-500',
        },
        {
            label: 'Pedidos Pendientes',
            value: orders?.data?.filter((o: any) => o.status === 'PENDING').length || 0,
            icon: ShoppingBag,
            color: 'bg-yellow-500',
        },
        {
            label: 'En Producción',
            value: 0,
            icon: Factory,
            color: 'bg-purple-500',
        },
        {
            label: 'Ventas Hoy',
            value: '$0.00',
            icon: DollarSign,
            color: 'bg-green-500',
        },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Dashboard
            </h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div key={index} className="card">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                                </div>
                                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="card">
                    <h2 className="text-xl font-semibold mb-4">Pedidos Recientes</h2>
                    <div className="space-y-3">
                        {orders?.data && orders.data.length > 0 ? (
                            orders.data.slice(0, 5).map((order: any) => (
                                <div key={order.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                                    <div>
                                        <p className="font-semibold text-sm">{order.customerName}</p>
                                        <p className="text-xs text-gray-500">{order.orderNumber}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold">${order.total.toFixed(2)}</p>
                                        <span className={`badge badge-${order.status === 'PENDING' ? 'warning' :
                                            order.status === 'COMPLETED' ? 'success' :
                                                'info'
                                            } text-xs`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">No hay pedidos recientes</p>
                        )}
                    </div>
                </div>

                {/* Low Stock Alert */}
                <div className="card">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-warning" />
                        Stock Bajo
                    </h2>
                    <div className="space-y-3">
                        {products?.data && products.data.filter((p: any) => p.currentStock <= (p.minStock || 0)).length > 0 ? (
                            products.data
                                .filter((p: any) => p.currentStock <= (p.minStock || 0))
                                .slice(0, 5)
                                .map((product: any) => (
                                    <div key={product.id} className="flex items-center justify-between py-2 border-b border-gray-100">
                                        <div>
                                            <p className="font-semibold text-sm">{product.name}</p>
                                            <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-danger">
                                                {product.currentStock} {product.measureUnit}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Min: {product.minStock}
                                            </p>
                                        </div>
                                    </div>
                                ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">
                                Todos los productos tienen stock suficiente
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
