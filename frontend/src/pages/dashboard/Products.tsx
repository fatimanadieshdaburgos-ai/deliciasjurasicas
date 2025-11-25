import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/api/products';
import { Plus, Edit, Trash2, Search, Package } from 'lucide-react';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ProductFormModal from '@/components/dashboard/ProductFormModal';

export default function Products() {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [productToEdit, setProductToEdit] = useState<any>(null);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['admin-products', { search, page }],
        queryFn: () => productsApi.getAll({
            search: search || undefined,
            page,
            limit: 20,
        }),
    });

    const handleCreate = () => {
        setProductToEdit(null);
        setIsModalOpen(true);
    };

    const handleEdit = (product: any) => {
        setProductToEdit(product);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string, name: string) => {
        if (confirm(`¿Estás seguro de eliminar "${name}"?`)) {
            try {
                await productsApi.delete(id);
                alert('Producto eliminado');
                refetch();
            } catch (error) {
                alert('Error al eliminar producto');
            }
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Productos</h1>
                    <p className="text-gray-500 mt-1">Gestiona el catálogo de productos e insumos</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="btn btn-primary flex items-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Nuevo Producto
                </button>
            </div>

            {/* Search */}
            <div className="card mb-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o SKU..."
                        className="form-input pl-12 w-full py-3 text-lg"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {/* Products Table */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <LoadingSpinner />
                </div>
            ) : (
                <div className="card overflow-hidden shadow-md border border-gray-100">
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-200">
                                    <th className="py-4 px-6 font-semibold text-gray-600">SKU</th>
                                    <th className="py-4 px-6 font-semibold text-gray-600">Nombre</th>
                                    <th className="py-4 px-6 font-semibold text-gray-600">Tipo</th>
                                    <th className="py-4 px-6 font-semibold text-gray-600">Precio</th>
                                    <th className="py-4 px-6 font-semibold text-gray-600">Stock</th>
                                    <th className="py-4 px-6 font-semibold text-gray-600">Estado</th>
                                    <th className="py-4 px-6 font-semibold text-gray-600 text-right">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data?.data?.map((product: any) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6 font-mono text-sm text-gray-500">{product.sku}</td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                                    {product.images?.[0] ? (
                                                        <img src={product.images[0].url} alt="" className="w-full h-full object-cover rounded-lg" />
                                                    ) : (
                                                        <Package className="w-5 h-5" />
                                                    )}
                                                </div>
                                                <span className="font-semibold text-gray-900">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`badge ${product.type === 'PRODUCTO_TERMINADO' ? 'badge-info' :
                                                    product.type === 'INSUMO' ? 'badge-warning' : 'badge-secondary'
                                                }`}>
                                                {product.type.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 font-medium">
                                            {product.salePrice ? `$${product.salePrice.toFixed(2)}` : '-'}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                <span className={`font-semibold ${product.currentStock <= (product.minStock || 0) ? 'text-red-600' : 'text-gray-700'
                                                    }`}>
                                                    {product.currentStock}
                                                </span>
                                                <span className="text-xs text-gray-500">{product.measureUnit}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {product.isActive ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleEdit(product)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(product.id, product.name)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {(!data?.data || data.data.length === 0) && (
                            <div className="text-center py-12">
                                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900">No hay productos</h3>
                                <p className="text-gray-500">Comienza creando tu primer producto.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {data?.meta && data.meta.totalPages > 1 && (
                        <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-200">
                            <span className="text-sm text-gray-500">
                                Mostrando página {page} de {data.meta.totalPages}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="btn btn-outline btn-sm bg-white"
                                >
                                    Anterior
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.min(data.meta.totalPages, p + 1))}
                                    disabled={page === data.meta.totalPages}
                                    className="btn btn-outline btn-sm bg-white"
                                >
                                    Siguiente
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <ProductFormModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                productToEdit={productToEdit}
            />
        </div>
    );
}
