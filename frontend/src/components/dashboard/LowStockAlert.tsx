import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/api/products';
import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LowStockAlert() {
    const { data: products = [], isLoading } = useQuery({
        queryKey: ['low-stock'],
        queryFn: productsApi.getLowStock,
    });

    if (isLoading) return <div className="animate-pulse h-48 bg-gray-100 rounded-lg"></div>;

    if (products.length === 0) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <span className="text-2xl">✅</span>
                </div>
                <h3 className="font-semibold text-gray-800">Inventario Saludable</h3>
                <p className="text-sm text-gray-500 mt-1">No hay productos con stock bajo.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    Alertas de Stock
                    <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                        {products.length}
                    </span>
                </h3>
                <Link to="/dashboard/inventory" className="text-sm text-primary hover:underline flex items-center gap-1">
                    Ver todo <ArrowRight className="w-3 h-3" />
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-3 max-h-[300px]">
                {products.map(product => (
                    <div key={product.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
                        <div>
                            <p className="font-medium text-gray-800 text-sm">{product.name}</p>
                            <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold text-amber-700">{product.currentStock} {product.measureUnit}</p>
                            <p className="text-xs text-amber-600">Min: {product.minStock}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
