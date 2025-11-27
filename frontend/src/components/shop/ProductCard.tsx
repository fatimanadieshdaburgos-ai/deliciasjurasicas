import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';

interface Props {
    product: Product;
}

export default function ProductCard({ product }: Props) {
    const { addItem } = useCartStore();

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        addItem(product, 1);
        alert('Producto agregado al carrito!');
    };

    return (
        <Link to={`/shop/${product.id}`} className="card hover:shadow-lg transition">
            {product.images && product.images.length > 0 ? (
                <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                />
            ) : (
                <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                    <span className="text-6xl">🦖</span>
                </div>
            )}

            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {product.description || 'Sin descripción'}
                </p>

                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-primary">
                        ${product.salePrice?.toFixed(2)}
                    </span>

                    <button
                        onClick={handleAddToCart}
                        className="btn btn-primary flex items-center gap-2"
                    >
                        <ShoppingCart className="w-4 h-4" />
                        Agregar
                    </button>
                </div>

                {product.currentStock < 5 && (
                    <p className="text-xs text-warning mt-2">
                        ¡Solo quedan {product.currentStock} disponibles!
                    </p>
                )}
            </div>
        </Link>
    );
}
