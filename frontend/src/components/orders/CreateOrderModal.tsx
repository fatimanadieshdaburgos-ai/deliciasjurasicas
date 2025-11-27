import { useState, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { productsApi } from '@/api/products';
import { ordersApi } from '@/api/orders';
import { Product, PaymentMethod, OrderType, OrderStatus } from '@/types';
import { X, Plus, Trash2, ShoppingCart, CreditCard, Banknote, User, Phone, Mail, Package } from 'lucide-react';

interface CreateOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface CartItem {
    product: Product;
    quantity: number;
}

export default function CreateOrderModal({ isOpen, onClose, onSuccess }: CreateOrderModalProps) {
    // Form State
    const [customerName, setCustomerName] = useState('');
    const [customerEmail, setCustomerEmail] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CASH);
    const [cart, setCart] = useState<CartItem[]>([]);

    // Product Selection State
    const [selectedProductId, setSelectedProductId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch Products
    const { data: productsData } = useQuery({
        queryKey: ['products-list'],
        queryFn: () => productsApi.getAll({ limit: 100, isActive: true }),
        enabled: isOpen,
    });

    const products = productsData?.data || [];

    // Mutations
    const createOrderMutation = useMutation({
        mutationFn: ordersApi.create,
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
            ordersApi.updateStatus(id, status),
    });

    const resetForm = () => {
        setCustomerName('');
        setCustomerEmail('');
        setCustomerPhone('');
        setPaymentMethod(PaymentMethod.CASH);
        setCart([]);
        setSelectedProductId('');
        setQuantity(1);
        setIsSubmitting(false);
    };

    const handleAddItem = () => {
        if (!selectedProductId) return;
        const product = products.find(p => p.id === selectedProductId);
        if (!product) return;

        setCart(prev => {
            const existing = prev.find(item => item.product.id === selectedProductId);
            if (existing) {
                return prev.map(item =>
                    item.product.id === selectedProductId
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { product, quantity }];
        });

        setSelectedProductId('');
        setQuantity(1);
    };

    const handleRemoveItem = (productId: string) => {
        setCart(prev => prev.filter(item => item.product.id !== productId));
    };

    const total = useMemo(() => {
        return cart.reduce((sum, item) => {
            const price = Number(item.product.salePrice) || 0;
            return sum + (price * item.quantity);
        }, 0);
    }, [cart]);

    const handleSubmit = async (deliverImmediately: boolean) => {
        if (cart.length === 0) {
            alert('Agrega productos a la orden');
            return;
        }

        if (!customerName) {
            alert('Ingresa el nombre del cliente');
            return;
        }

        setIsSubmitting(true);

        try {
            const orderData = {
                type: OrderType.POS,
                customerName,
                customerEmail,
                customerPhone,
                items: cart.map(item => ({
                    productId: item.product.id,
                    quantity: item.quantity,
                    unitPrice: Number(item.product.salePrice) || 0
                })),
                paymentMethod,
                deliveryAddress: 'Venta en Local / POS',
                subtotal: total,
                total: total
            };

            const newOrder = await createOrderMutation.mutateAsync(orderData);

            if (deliverImmediately) {
                await updateStatusMutation.mutateAsync({
                    id: newOrder.id,
                    status: OrderStatus.DELIVERED
                });
                alert('Orden creada y entregada exitosamente');
            } else {
                alert('Orden creada exitosamente');
            }

            onSuccess();
            onClose();
            resetForm();
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || 'Error al procesar la orden');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <ShoppingCart className="w-6 h-6 text-primary" />
                            Nueva Orden (POS)
                        </h2>
                        <p className="text-sm text-gray-500">Registra una venta rápida en local</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                    {/* Left Column: Input Forms */}
                    <div className="w-full md:w-5/12 p-6 overflow-y-auto border-r border-gray-100 bg-white">
                        <div className="space-y-8">
                            {/* Customer Section */}
                            <section>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Datos del Cliente
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo *</label>
                                        <input
                                            type="text"
                                            className="input w-full bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                            value={customerName}
                                            onChange={e => setCustomerName(e.target.value)}
                                            placeholder="Ej: Juan Pérez"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <div className="relative">
                                                <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                                <input
                                                    type="email"
                                                    className="input w-full pl-9 bg-gray-50 border-gray-200 focus:bg-white"
                                                    value={customerEmail}
                                                    onChange={e => setCustomerEmail(e.target.value)}
                                                    placeholder="Opcional"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                                            <div className="relative">
                                                <Phone className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                                                <input
                                                    type="tel"
                                                    className="input w-full pl-9 bg-gray-50 border-gray-200 focus:bg-white"
                                                    value={customerPhone}
                                                    onChange={e => setCustomerPhone(e.target.value)}
                                                    placeholder="Opcional"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Product Selection Section */}
                            <section>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Package className="w-4 h-4" />
                                    Agregar Productos
                                </h3>
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
                                        <select
                                            className="form-select w-full bg-white"
                                            value={selectedProductId}
                                            onChange={e => setSelectedProductId(e.target.value)}
                                        >
                                            <option value="">Seleccionar producto...</option>
                                            {products.map(p => (
                                                <option key={p.id} value={p.id}>
                                                    {p.name} - ${Number(p.salePrice).toFixed(2)} (Stock: {p.currentStock})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex gap-4 items-end">
                                        <div className="w-24">
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
                                            <input
                                                type="number"
                                                className="input w-full text-center"
                                                min="1"
                                                value={quantity}
                                                onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                                            />
                                        </div>
                                        <button
                                            className="btn btn-secondary flex-1 flex justify-center items-center gap-2"
                                            onClick={handleAddItem}
                                            disabled={!selectedProductId}
                                        >
                                            <Plus className="w-5 h-5" />
                                            Agregar
                                        </button>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>

                    {/* Right Column: Cart & Summary */}
                    <div className="w-full md:w-7/12 flex flex-col bg-gray-50">
                        <div className="flex-1 p-6 overflow-hidden flex flex-col">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Resumen del Pedido</h3>

                            {/* Cart List */}
                            <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow-sm border border-gray-200 mb-4">
                                {cart.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8">
                                        <ShoppingCart className="w-12 h-12 mb-2 opacity-20" />
                                        <p>El carrito está vacío</p>
                                    </div>
                                ) : (
                                    <table className="w-full text-sm">
                                        <thead className="bg-gray-50 text-gray-500 border-b">
                                            <tr>
                                                <th className="px-4 py-3 text-left font-medium">Producto</th>
                                                <th className="px-4 py-3 text-center font-medium">Cant.</th>
                                                <th className="px-4 py-3 text-right font-medium">Precio</th>
                                                <th className="px-4 py-3 text-right font-medium">Total</th>
                                                <th className="px-4 py-3 w-10"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {cart.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 font-medium text-gray-900">{item.product.name}</td>
                                                    <td className="px-4 py-3 text-center text-gray-600">{item.quantity}</td>
                                                    <td className="px-4 py-3 text-right text-gray-600">${Number(item.product.salePrice).toFixed(2)}</td>
                                                    <td className="px-4 py-3 text-right font-bold text-gray-900">
                                                        ${(Number(item.product.salePrice) * item.quantity).toFixed(2)}
                                                    </td>
                                                    <td className="px-4 py-3 text-center">
                                                        <button
                                                            onClick={() => handleRemoveItem(item.product.id)}
                                                            className="text-red-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>

                            {/* Totals & Actions */}
                            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-6">
                                <div className="flex justify-between items-center pb-4 border-b border-dashed">
                                    <span className="text-gray-500 font-medium">Total a Pagar</span>
                                    <span className="text-3xl font-bold text-primary">${total.toFixed(2)}</span>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Método de Pago</label>
                                    <div className="grid grid-cols-3 gap-3">
                                        <button
                                            className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${paymentMethod === PaymentMethod.CASH
                                                    ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                                }`}
                                            onClick={() => setPaymentMethod(PaymentMethod.CASH)}
                                        >
                                            <Banknote className="w-5 h-5" />
                                            <span className="text-xs font-medium">Efectivo</span>
                                        </button>
                                        <button
                                            className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${paymentMethod === PaymentMethod.CARD
                                                    ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                                }`}
                                            onClick={() => setPaymentMethod(PaymentMethod.CARD)}
                                        >
                                            <CreditCard className="w-5 h-5" />
                                            <span className="text-xs font-medium">Tarjeta</span>
                                        </button>
                                        <button
                                            className={`p-3 rounded-lg border flex flex-col items-center gap-2 transition-all ${paymentMethod === PaymentMethod.TRANSFER
                                                    ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                                }`}
                                            onClick={() => setPaymentMethod(PaymentMethod.TRANSFER)}
                                        >
                                            <Package className="w-5 h-5" />
                                            <span className="text-xs font-medium">Transferencia</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        className="btn btn-outline py-3"
                                        onClick={() => handleSubmit(false)}
                                        disabled={isSubmitting}
                                    >
                                        Solo Crear (Pendiente)
                                    </button>
                                    <button
                                        className="btn btn-primary py-3 shadow-lg shadow-primary/30"
                                        onClick={() => handleSubmit(true)}
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Procesando...' : 'Cobrar y Entregar'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
