import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { productionApi } from '@/api/production';
import { Play, CheckCircle, XCircle, Plus } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ProductionOrderFormModal from '@/components/dashboard/ProductionOrderFormModal';

export default function Production() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { data: orders, isLoading, refetch } = useQuery({
        queryKey: ['production-orders'],
        queryFn: () => productionApi.getAll(),
    });

    const startMutation = useMutation({
        mutationFn: (id: string) => productionApi.start(id),
        onSuccess: () => {
            alert('Producción iniciada');
            refetch();
        },
    });

    const completeMutation = useMutation({
        mutationFn: (id: string) => productionApi.complete(id),
        onSuccess: () => {
            alert('✅ Producción completada! Los insumos han sido descontados y el producto se agregó al inventario.');
            refetch();
        },
        onError: (error: any) => {
            alert(`Error: ${error.response?.data?.message || 'No se pudo completar la producción'}`);
        },
    });

    const cancelMutation = useMutation({
        mutationFn: (id: string) => productionApi.cancel(id),
        onSuccess: () => {
            alert('Producción cancelada');
            refetch();
        },
    });

    const getStatusBadge = (status: string) => {
        const statusMap: Record<string, string> = {
            'PENDIENTE': 'badge-warning',
            'EN_PROCESO': 'badge-info',
            'COMPLETADO': 'badge-success',
            'CANCELADO': 'badge-danger',
        };
        return statusMap[status] || 'badge-secondary';
    };

    if (isLoading) return <LoadingSpinner />;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Producción</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="btn btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Nueva Orden de Producción
                </button>
            </div>

            <div className="card overflow-x-auto">
                <table className="table">
                    <thead>
                        <tr>
                            <th># Orden</th>
                            <th>Producto</th>
                            <th>Cantidad</th>
                            <th>Asignado a</th>
                            <th>Estado</th>
                            <th>Fecha Creación</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders?.map((order: any) => (
                            <tr key={order.id}>
                                <td className="font-mono text-sm">{order.orderNumber}</td>
                                <td className="font-semibold">{order.product?.name || 'N/A'}</td>
                                <td>{order.quantity}</td>
                                <td>{order.assignedTo?.firstName || 'Sin asignar'}</td>
                                <td>
                                    <span className={`badge ${getStatusBadge(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="text-sm text-gray-600">
                                    {new Date(order.createdAt).toLocaleDateString()}
                                </td>
                                <td>
                                    <div className="flex gap-2">
                                        {order.status === 'PENDIENTE' && (
                                            <button
                                                onClick={() => startMutation.mutate(order.id)}
                                                className="btn btn-outline text-blue-600 hover:bg-blue-50 flex items-center gap-1 text-sm px-2 py-1"
                                                title="Iniciar"
                                            >
                                                <Play className="w-4 h-4" />
                                            </button>
                                        )}

                                        {order.status === 'EN_PROCESO' && (
                                            <button
                                                onClick={() => {
                                                    if (confirm('¿Completar producción? Esto descontará los insumos del inventario.')) {
                                                        completeMutation.mutate(order.id);
                                                    }
                                                }}
                                                className="btn btn-success text-sm px-2 py-1 flex items-center gap-1"
                                                title="Completar"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                Completar
                                            </button>
                                        )}

                                        {(order.status === 'PENDIENTE' || order.status === 'EN_PROCESO') && (
                                            <button
                                                onClick={() => {
                                                    if (confirm('¿Cancelar esta orden de producción?')) {
                                                        cancelMutation.mutate(order.id);
                                                    }
                                                }}
                                                className="btn btn-outline text-red-600 hover:bg-red-50 flex items-center gap-1 text-sm px-2 py-1"
                                                title="Cancelar"
                                            >
                                                <XCircle className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {(!orders || orders.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                        No hay órdenes de producción registradas
                    </div>
                )}
            </div>

            <div className="mt-6 card bg-blue-50 border-blue-200 p-4">
                <h3 className="font-semibold mb-2 text-blue-900">💡 Cómo funciona:</h3>
                <ol className="text-sm text-blue-800 space-y-1">
                    <li className="flex gap-2">
                        <span>1.</span>
                        <span>Crea una orden de producción seleccionando el producto terminado y la cantidad</span>
                    </li>
                    <li className="flex gap-2">
                        <span>2.</span>
                        <span>El sistema verifica que haya suficientes insumos según la receta</span>
                    </li>
                    <li className="flex gap-2">
                        <span>3.</span>
                        <span>Inicia la producción cuando empiece el proceso</span>
                    </li>
                    <li className="flex gap-2">
                        <span>4.</span>
                        <span>Al completar, los insumos se descontarán automáticamente y el producto terminado se agregará al inventario</span>
                    </li>
                </ol>
            </div>

            <ProductionOrderFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}
