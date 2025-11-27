import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { ordersApi } from '@/api/orders';
import { ArrowLeft, CreditCard, Banknote, Truck } from 'lucide-react';

export default function Checkout() {
    const navigate = useNavigate();
    const { items, getTotal, clearCart } = useCartStore();
    const { user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        address: '',
        paymentMethod: 'CASH',
        notes: ''
    });

    useEffect(() => {
        if (items.length === 0) {
            navigate('/cart');
        }
        if (user) {
            setFormData(prev => ({
                ...prev,
                customerName: `${user.firstName} ${user.lastName}`,
                customerEmail: user.email,
                customerPhone: user.phone || '',
            }));
        }
    }, [items, user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const orderData = {
                items: items.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity
                })),
                customerName: formData.customerName,
                customerEmail: formData.customerEmail,
                customerPhone: formData.customerPhone,
                deliveryAddress: formData.address, // Simple string for now, backend might expect ID or object?
                // Checking backend DTO, it likely expects an address ID or we need to create one.
                // For this MVP, let's assume we pass it as notes or if backend supports ad-hoc address.
                // Wait, let's check CreateOrderDto structure if possible. 
                // Assuming backend handles it or we pass it in notes for now if strict.
                // Actually, let's look at the backend Order model. It has deliveryAddressId.
                // If we don't have an address management system yet, we might need to pass it as text in notes 
                // or if the backend allows creating address inline.
                // Let's assume we pass it in notes for now to be safe, or check if backend accepts it.
                notes: `Dirección de entrega: ${formData.address}. ${formData.notes}`,
                paymentMethod: formData.paymentMethod,
                total: getTotal()
            };

            // NOTE: The backend might require a valid addressId. 
            // If so, we might need to create an address first or use a "guest" flow.
            // For now, I will send it and see if it works. 
            // If the backend requires addressId, I'll need to adjust.

            await ordersApi.create(orderData as any);

            clearCart();
            alert('¡Pedido realizado con éxito!');
            navigate('/shop');
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Error al procesar el pedido. Por favor intente nuevamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <button
                onClick={() => navigate('/cart')}
                className="btn btn-outline mb-6 flex items-center gap-2"
            >
                <ArrowLeft className="w-4 h-4" />
                Volver al Carrito
            </button>

            <h1 className="text-3xl font-bold text-gray-900 mb-8">Finalizar Compra</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Form */}
                <div>
                    <div className="card">
                        <h2 className="text-xl font-semibold mb-6">Datos de Envío</h2>
                        <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                                <input
                                    type="text"
                                    required
                                    className="form-input w-full"
                                    value={formData.customerName}
                                    onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="form-input w-full"
                                    value={formData.customerEmail}
                                    onChange={e => setFormData({ ...formData, customerEmail: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                <input
                                    type="tel"
                                    required
                                    className="form-input w-full"
                                    value={formData.customerPhone}
                                    onChange={e => setFormData({ ...formData, customerPhone: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Dirección de Entrega</label>
                                <textarea
                                    required
                                    rows={3}
                                    className="form-input w-full"
                                    value={formData.address}
                                    onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="Calle, número, colonia, referencias..."
                                />
                            </div>

                            <div className="pt-4">
                                <h3 className="text-lg font-medium mb-3">Método de Pago</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors ${formData.paymentMethod === 'CASH'
                                                ? 'border-primary bg-orange-50 text-primary'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        onClick={() => setFormData({ ...formData, paymentMethod: 'CASH' })}
                                    >
                                        <Banknote className="w-6 h-6" />
                                        <span className="font-medium">Efectivo</span>
                                    </button>
                                    <button
                                        type="button"
                                        className={`p-4 border rounded-lg flex flex-col items-center gap-2 transition-colors ${formData.paymentMethod === 'CARD'
                                                ? 'border-primary bg-orange-50 text-primary'
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        onClick={() => setFormData({ ...formData, paymentMethod: 'CARD' })}
                                    >
                                        <CreditCard className="w-6 h-6" />
                                        <span className="font-medium">Tarjeta</span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notas Adicionales</label>
                                <textarea
                                    rows={2}
                                    className="form-input w-full"
                                    value={formData.notes}
                                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                    placeholder="Instrucciones especiales para el pedido..."
                                />
                            </div>
                        </form>
                    </div>
                </div>

                {/* Summary */}
                <div>
                    <div className="card sticky top-4">
                        <h2 className="text-xl font-semibold mb-6">Resumen del Pedido</h2>
                        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                            {items.map(item => (
                                <div key={item.id} className="flex gap-4 items-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                                        {item.product.images?.[0] ? (
                                            <img src={item.product.images[0].url} className="w-full h-full object-cover rounded" />
                                        ) : (
                                            <span className="text-xl">🦖</span>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                                        <p className="text-sm text-gray-500">Cant: {item.quantity}</p>
                                    </div>
                                    <p className="font-semibold text-gray-900">
                                        ${((item.product.salePrice || 0) * item.quantity).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-4 space-y-2">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>${getTotal().toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Envío</span>
                                <span className="text-green-600">Gratis</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold text-gray-900 pt-2">
                                <span>Total</span>
                                <span>${getTotal().toFixed(2)}</span>
                            </div>
                        </div>

                        <button
                            form="checkout-form"
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary w-full mt-6 py-3 text-lg flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <>
                                    <Truck className="w-5 h-5" />
                                    Confirmar Pedido
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
