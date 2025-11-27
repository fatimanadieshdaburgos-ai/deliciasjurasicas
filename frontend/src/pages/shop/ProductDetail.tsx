import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { productsApi } from '@/api/products';
import { useCartStore } from '@/store/cartStore';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { ShoppingCart, ArrowLeft, Package } from 'lucide-react';
import { useState } from 'react';

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addItem } = useCartStore();
    const [quantity, setQuantity] = useState(1);

    const { data: product, isLoading } = useQuery({
        queryKey: ['product', id],
        queryFn: () => productsApi.getById(id!),
        enabled: !!id,
    });

    const handleAddToCart = () => {
        if (product) {
            addItem(product, quantity);
            alert(`${quantity} ${product.name} agregado(s) al carrito!`);
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-12 text-center">
                <p className="text-gray-500">Producto no encontrado</p>
                <button onClick={() => navigate('/shop')} className="btn btn-primary mt-4">
                    Volver a la tienda
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <button
                onClick={() => navigate(-1)}
                className="btn btn-outline mb-6 flex items-center gap-2"
            >
                <ArrowLeft className="w-4 h-4" />
                Volver
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="card">
                    {product.images && product.images.length > 0 ? (
                        <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-full h-96 object-cover rounded-lg"
                        />
                    ) : (
                        <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-9xl">🦖</span>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        {product.name}
                    </h1>

                    {product.category && (
                        <span className="badge badge-secondary mb-4">
                            {product.category.name}
                        </span>
                    )}

                    <p className="text-gray-600 mb-6">
                        {product.description || 'Sin descripción disponible'}
                    </p>

                    <div className="card bg-gray-50 mb-6">
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">SKU:</span>
                                <span className="font-semibold">{product.sku}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Stock disponible:</span>
                                <span className="font-semibold flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    {product.currentStock} {product.measureUnit}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Precio:</span>
                                <span className="text-3xl font-bold text-primary">
                                    ${product.salePrice?.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Add to Cart */}
                    {product.currentStock > 0 ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <label className="font-semibold">Cantidad:</label>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="btn btn-outline px-3 py-1"
                                    >
                                        -
                                    </button>
                                    <span className="w-12 text-center font-semibold">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(Math.min(product.currentStock, quantity + 1))}
                                        className="btn btn-outline px-3 py-1"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                className="btn btn-primary w-full text-lg py-3 flex items-center justify-center gap-2"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Agregar al Carrito
                            </button>
                        </div>
                    ) : (
                        <div className="alert alert-warning">
                            Producto temporalmente agotado
                        </div>
                    )}
                </div>
            </div>

            {/* Recipe Info (if exists) */}
            {product.recipe && (
                <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-4">Receta e Ingredientes</h2>
                    <div className="card">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold mb-2">Información:</h3>
                                <ul className="space-y-2 text-sm">
                                    <li><strong>Rendimiento:</strong> {product.recipe.yieldQuantity} {product.recipe.yieldUnit}</li>
                                    <li><strong>Tiempo de preparación:</strong> {product.recipe.preparationTime} minutos</li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2">Ingredientes:</h3>
                                <ul className="space-y-1 text-sm">
                                    {product.recipe.ingredients?.map((ing: any) => (
                                        <li key={ing.id}>
                                            • {ing.quantity} {ing.unit} de {ing.ingredient.name}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
