import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '@/api/orders';
import { OrderStatus } from '@/types';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { format } from 'date-fns';

export default function Orders() {
    const { data, isLoading, refetch } = useQuery({
        queryKey: ['dashboard-orders'],
        queryFn: () => ordersApi.getAll(1, 50),
    });

    const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
        try {
            await ordersApi.updateStatus(orderId, newStatus);
            alert('Estado actualizado');
            refetch();
        } catch (error) {
            alert('Error al actualizar el estado');
        }
    };

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, string> = {
            'PENDING': 'badge-warning',
            'PAID': 'badge-info',
            'IN_PRODUCTION': 'badge-info',
            'READY': 'badge-success',
            'IN_TRANSIT': 'badge-info',
            'DELIVERED': 'badge-success',
            'COMPLETED': 'badge-success',
            'CANCELLED': 'badge-danger',
        };
        return statusMap[status] || 'badge-secondary';
    };

    if (isLoading) return <LoadingSpinner />;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Pedidos</h1>

            <div className="card overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th># Pedido</th>
                            <th>Cliente</th>
                            <th>Tipo</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Fecha</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.data?.map((order: any) => (
                            <tr key={order.id}>
                                <td className="font-mono text-sm">{order.orderNumber}</td>
                                <td>
                                    <div>
                                        <p className="font-semibold">{order.customerName}</p>
                                        <p className="text-xs text-gray-500">{order.customerEmail}</p>
                                    </div>
                                </td>
                                <td>
                                    <span className="badge badge-secondary">{order.type}</span>
                                </td>
                                <td>{order.items?.length || 0}</td>
                                <td className="font-semibold">${order.total.toFixed(2)}</td>
                                <td>
                                    <span className={`badge ${getStatusBadge(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="text-sm text-gray-600">
                                    {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
                                </td>
                                <td>
                                    <select
                                        className="form-select text-sm"
                                        value={order.status}
                                        onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                                    >
                                        <option value="PENDING">Pendiente</option>
                                        <option value="PAID">Pagado</option>
                                        <option value="IN_PRODUCTION">En Producción</option>
                                        <option value="READY">Listo</option>
                                        <option value="IN_TRANSIT">En Tránsito</option>
                                        <option value="DELIVERED">Entregado</option>
                                        <option value="COMPLETED">Completado</option>
                                        <option value="CANCELLED">Cancelado</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {(!data?.data || data.data.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                        No hay pedidos registrados
                    </div>
                )}
            </div>
        </div>
    );
}
