import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/api/products';
import { ProductType } from '@/types';
import ProductCard from '@/components/shop/ProductCard';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Search, Filter } from 'lucide-react';

export default function Shop() {
    const [search, setSearch] = useState('');
    const { data, isLoading } = useQuery({
        queryKey: ['products', { search, page }],
        queryFn: () => productsApi.getAll({
            search: search || undefined,
            type: ProductType.PRODUCTO_TERMINADO,
            isActive: true,
            page,
            limit: 12,
        }),
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Nuestra Tienda
            </h1>

            {/* Filters */}
            <div className="card mb-8">
                <div className="grid grid-cols-1 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Buscar pasteles, galletas..."
                            className="form-input pl-10"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            {isLoading ? (
                <LoadingSpinner />
            ) : data?.data && data.data.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {data.data.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {data.meta.totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="btn btn-outline"
                            >
                                Anterior
                            </button>
                            <span className="px-4 py-2 text-gray-700">
                                Página {page} de {data.meta.totalPages}
                            </span>
                            <button
                                onClick={() => setPage(p => Math.min(data.meta.totalPages, p + 1))}
                                disabled={page === data.meta.totalPages}
                                className="btn btn-outline"
                            >
                                Siguiente
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">
                        No se encontraron productos
                    </p>
                </div>
            )}
        </div>
    );
}
