import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function Cart() {
    const navigate = useNavigate();
    const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();

    const handleCheckout = () => {
        if (items.length === 0) {
            alert('El carrito está vacío');
            return;
        }
        // TODO: Navigate to checkout page
        alert('Funcionalidad de checkout en desarrollo. Total: $' + getTotal().toFixed(2));
    };

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-12">
                <div className="text-center">
                    <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                        Tu carrito está vacío
                    </h2>
                    <p className="text-gray-500 mb-6">
                        Agrega algunos productos deliciosos a tu carrito
                    </p>
                    <button
                        onClick={() => navigate('/shop')}
                        className="btn btn-primary"
                    >
                        Ir a la Tienda
                    </button>
                </div>
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
                Seguir Comprando
            </button>

            <h1 className="text-3xl font-bold text-gray-900 mb-8">
                Carrito de Compras
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="card">
                            <div className="flex gap-4">
                                {/* Product Image */}
                                <div className="w-24 h-24 flex-shrink-0">
                                    {item.product.images && item.product.images.length > 0 ? (
                                        <img
                                            src={item.product.images[0].url}
                                            alt={item.product.name}
                                            className="w-full h-full object-cover rounded"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                                            <span className="text-3xl">🦖</span>
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 mb-1">
                                        {item.product.name}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        SKU: {item.product.sku}
                                    </p>
                                    <p className="text-lg font-bold text-primary">
                                        ${item.product.salePrice?.toFixed(2)}
                                    </p>
                                </div>

                                {/* Quantity Controls */}
                                <div className="flex flex-col items-end gap-2">
                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className="btn btn-outline px-2 py-1 text-sm"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center font-semibold">
                                            {item.quantity}
                                        </span>
                                        <button
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className="btn btn-outline px-2 py-1 text-sm"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <p className="text-sm text-gray-600">
                                        Subtotal: ${((item.product.salePrice || 0) * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={clearCart}
                        className="btn btn-outline text-red-600 hover:bg-red-50"
                    >
                        Vaciar Carrito
                    </button>
                </div>

                {/* Order Summary */}
                <div>
                    <div className="card sticky top-4">
                        <h2 className="text-xl font-semibold mb-4">Resumen del Pedido</h2>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal:</span>
                                <span>${getTotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Envío:</span>
                                <span>Gratis</span>
                            </div>
                            <div className="border-t pt-3 flex justify-between text-lg font-bold">
                                <span>Total:</span>
                                <span className="text-primary">${getTotal().toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            className="btn btn-primary w-full text-lg py-3"
                        >
                            Proceder al Pago
                        </button>

                        <p className="text-xs text-gray-500 text-center mt-4">
                            Envío gratis en compras mayores a $500
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
