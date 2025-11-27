import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '@/api/orders';
import { OrderStatus } from '@/types';
import { Package, Calendar, ShoppingBag } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const getStatusColor = (status: OrderStatus) => {
    switch (status) {
        case OrderStatus.PENDING: return 'bg-yellow-100 text-yellow-800';
        case OrderStatus.PAID: return 'bg-blue-100 text-blue-800';
        case OrderStatus.IN_PRODUCTION: return 'bg-purple-100 text-purple-800';
        case OrderStatus.READY: return 'bg-indigo-100 text-indigo-800';
        case OrderStatus.IN_TRANSIT: return 'bg-orange-100 text-orange-800';
        case OrderStatus.DELIVERED: return 'bg-green-100 text-green-800';
        case OrderStatus.COMPLETED: return 'bg-green-100 text-green-800';
        case OrderStatus.CANCELLED: return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

const getStatusLabel = (status: OrderStatus) => {
    switch (status) {
        case OrderStatus.PENDING: return 'Pendiente de Pago';
        case OrderStatus.PAID: return 'Pagado';
        case OrderStatus.IN_PRODUCTION: return 'En Producción';
        case OrderStatus.READY: return 'Listo para Entrega';
        case OrderStatus.IN_TRANSIT: return 'En Camino';
        case OrderStatus.DELIVERED: return 'Entregado';
        case OrderStatus.COMPLETED: return 'Completado';
        case OrderStatus.CANCELLED: return 'Cancelado';
        default: return status;
    }
};

export default function OrderHistory() {
    const { data, isLoading } = useQuery({
        queryKey: ['my-orders'],
        queryFn: () => ordersApi.getAll(1, 50), // Fetch last 50 orders
    });

    const orders = data?.data || [];

    if (isLoading) return <div className="p-8 text-center text-gray-500">Cargando historial...</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-primary" />
                Historial de Pedidos
            </h2>

            {orders.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">Aún no has realizado ningún pedido.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="font-mono font-bold text-gray-700">#{order.orderNumber.slice(-6)}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                            {getStatusLabel(order.status)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Calendar className="w-4 h-4" />
                                        {format(new Date(order.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-500">Total</p>
                                    <p className="text-xl font-bold text-primary">${Number(order.total).toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded p-3 text-sm space-y-2">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center">
                                        <span className="text-gray-700">
                                            <span className="font-medium">{item.quantity}x</span> {item.product.name}
                                        </span>
                                        <span className="text-gray-600">${Number(item.subtotal).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
