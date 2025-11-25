import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '@/api/inventory';
import { AlertTriangle, Package, TrendingDown, Layers, Wheat, Cookie } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { ProductType } from '@/types';

export default function Inventory() {
    const [showLowStock, setShowLowStock] = useState(false);
    const [activeTab, setActiveTab] = useState<'ALL' | 'INSUMO' | 'PRODUCTO_TERMINADO'>('ALL');

    const { data: stock, isLoading } = useQuery({
        queryKey: ['inventory-stock'],
        queryFn: () => inventoryApi.getStock(),
    });

    const { data: lowStock } = useQuery({
        queryKey: ['inventory-low-stock'],
        queryFn: () => inventoryApi.getLowStock(),
    });

    const { data: movements } = useQuery({
        queryKey: ['inventory-movements'],
        queryFn: () => inventoryApi.getMovements(),
    });

    if (isLoading) return <LoadingSpinner />;

    let displayStock = showLowStock ? lowStock : stock;

    // Filter by tab
    if (activeTab !== 'ALL' && displayStock) {
        displayStock = displayStock.filter((item: any) => item.type === activeTab);
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Inventario</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowLowStock(!showLowStock)}
                        className={`btn ${showLowStock ? 'btn-warning' : 'btn-outline'} flex items-center gap-2`}
                    >
                        <AlertTriangle className="w-5 h-5" />
                        Stock Bajo ({lowStock?.length || 0})
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                <button
                    onClick={() => setActiveTab('ALL')}
                    className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${activeTab === 'ALL'
                            ? 'bg-gray-900 text-white shadow-lg'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    <Layers className="w-4 h-4" />
                    Todo
                </button>
                <button
                    onClick={() => setActiveTab('INSUMO')}
                    className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${activeTab === 'INSUMO'
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    <Wheat className="w-4 h-4" />
                    Materia Prima
                </button>
                <button
                    onClick={() => setActiveTab('PRODUCTO_TERMINADO')}
                    className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${activeTab === 'PRODUCTO_TERMINADO'
                            ? 'bg-primary-600 text-white shadow-lg'
                            : 'bg-white text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    <Cookie className="w-4 h-4" />
                    Productos Terminados
                </button>
            </div>

            {/* Stock Table */}
            <div className="card overflow-x-auto mb-6">
                <table className="table">
                    <thead>
                        <tr>
                            <th>SKU</th>
                            <th>Producto</th>
                            <th>Tipo</th>
                            <th>Stock Actual</th>
                            <th>Stock Mínimo</th>
                            <th>Stock Máximo</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayStock?.map((item: any) => {
                            const isLow = item.currentStock <= (item.minStock || 0);
                            const isCritical = item.currentStock === 0;

                            return (
                                <tr key={item.id} className={isCritical ? 'bg-red-50' : isLow ? 'bg-yellow-50' : ''}>
                                    <td className="font-mono text-sm">{item.sku}</td>
                                    <td className="font-semibold">{item.name}</td>
                                    <td>
                                        <span className="badge badge-secondary">{item.type}</span>
                                    </td>
                                    <td>
                                        <span className={`font-bold ${isCritical ? 'text-danger' :
                                            isLow ? 'text-warning' :
                                                'text-success'
                                            }`}>
                                            {item.currentStock} {item.measureUnit}
                                        </span>
                                    </td>
                                    <td className="text-gray-600">
                                        {item.minStock} {item.measureUnit}
                                    </td>
                                    <td className="text-gray-600">
                                        {item.maxStock || 'N/A'} {item.maxStock ? item.measureUnit : ''}
                                    </td>
                                    <td>
                                        {isCritical ? (
                                            <span className="badge badge-danger flex items-center gap-1">
                                                <AlertTriangle className="w-3 h-3" />
                                                AGOTADO
                                            </span>
                                        ) : isLow ? (
                                            <span className="badge badge-warning flex items-center gap-1">
                                                <TrendingDown className="w-3 h-3" />
                                                BAJO
                                            </span>
                                        ) : (
                                            <span className="badge badge-success flex items-center gap-1">
                                                <Package className="w-3 h-3" />
                                                OK
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {(!displayStock || displayStock.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                        {showLowStock ? 'No hay productos con stock bajo' : 'No hay productos en el inventario'}
                    </div>
                )}
            </div>

            {/* Recent Movements */}
            <div className="card">
                <h2 className="text-xl font-semibold mb-4">Últimos Movimientos</h2>
                <div className="overflow-x-auto">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Producto</th>
                                <th>Tipo de Movimiento</th>
                                <th>Cantidad</th>
                                <th>Stock Anterior</th>
                                <th>Stock Nuevo</th>
                                <th>Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {movements?.slice(0, 10).map((movement: any) => (
                                <tr key={movement.id}>
                                    <td className="font-semibold">{movement.product?.name}</td>
                                    <td>
                                        <span className="badge badge-info">{movement.type}</span>
                                    </td>
                                    <td className={movement.quantity > 0 ? 'text-success' : 'text-danger'}>
                                        {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                                    </td>
                                    <td>{movement.previousStock}</td>
                                    <td className="font-semibold">{movement.newStock}</td>
                                    <td className="text-sm text-gray-600">
                                        {new Date(movement.createdAt).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {(!movements || movements.length === 0) && (
                        <div className="text-center py-4 text-gray-500">
                            No hay movimientos registrados
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
