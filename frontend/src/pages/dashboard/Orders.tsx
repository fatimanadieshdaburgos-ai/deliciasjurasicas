import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ordersApi } from '@/api/orders';
import { OrderStatus } from '@/types';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { format } from 'date-fns';
import { Plus, Printer } from 'lucide-react';
import CreateOrderModal from '@/components/orders/CreateOrderModal';

export default function Orders() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

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

    const handlePrint = (order: any) => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const html = `
            <html>
            <head>
                <title>Recibo #${order.orderNumber}</title>
                <style>
                    body { font-family: monospace; padding: 20px; max-width: 300px; margin: 0 auto; }
                    .header { text-align: center; margin-bottom: 20px; border-bottom: 1px dashed #000; padding-bottom: 10px; }
                    .item { display: flex; justify-content: space-between; margin-bottom: 5px; }
                    .total { border-top: 1px dashed #000; margin-top: 10px; padding-top: 10px; font-weight: bold; text-align: right; }
                    .footer { margin-top: 20px; text-align: center; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h2>Delicias Jurásicas</h2>
                    <p>Recibo de Venta</p>
                    <p>#${order.orderNumber}</p>
                    <p>${format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}</p>
                </div>
                <div class="items">
                    ${order.items.map((item: any) => `
                        <div class="item">
                            <span>${item.quantity}x ${item.product.name}</span>
                            <span>$${Number(item.subtotal).toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="total">
                    Total: $${Number(order.total).toFixed(2)}
                </div>
                <div class="footer">
                    <p>Cliente: ${order.customerName}</p>
                    <p>¡Gracias por su compra!</p>
                </div>
                <script>
                    window.onload = function() { window.print(); window.close(); }
                </script>
            </body>
            </html>
        `;

        printWindow.document.write(html);
        printWindow.document.close();
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
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
                <button
                    className="btn btn-primary flex items-center gap-2"
                    onClick={() => setIsCreateModalOpen(true)}
                >
                    <Plus className="w-5 h-5" />
                    Nueva Orden
                </button>
            </div>

            <div className="card overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th># Pedido</th>
                            <th>Cliente</th>
                            <th>Productos</th>
                            <th>Tipo</th>
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
                                <td className="max-w-xs">
                                    <div className="space-y-1">
                                        {order.items?.map((item: any, index: number) => (
                                            <div key={index} className="text-sm">
                                                <span className="font-medium">{item.product?.name || 'Producto desconocido'}</span>
                                                <span className="text-gray-500 text-xs ml-1">x{item.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td>
                                    <span className="badge badge-secondary">{order.type}</span>
                                </td>
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
                                    <button
                                        onClick={() => handlePrint(order)}
                                        className="p-1 text-gray-500 hover:text-gray-700 ml-2"
                                        title="Imprimir Recibo"
                                    >
                                        <Printer className="w-4 h-4" />
                                    </button>
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

            <CreateOrderModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSuccess={refetch}
            />
        </div >
    );
}
