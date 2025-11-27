import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productionApi } from '@/api/production';
import { productsApi } from '@/api/products';
import { X, Save, Loader2 } from 'lucide-react';
import { ProductType } from '@/types';

interface ProductionOrderFormModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ProductionOrderFormModal({ isOpen, onClose }: ProductionOrderFormModalProps) {
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    // Fetch products for the dropdown (only finished or semi-finished)
    const { data: products } = useQuery({
        queryKey: ['products-for-production'],
        queryFn: () => productsApi.getAll({ page: 1, limit: 100 }), // Fetch enough products
    });

    // Filter relevant products
    const productionProducts = products?.data?.filter(p =>
        p.type === ProductType.PRODUCTO_TERMINADO || p.type === ProductType.SEMI_ELABORADO
    );

    useEffect(() => {
        if (isOpen) {
            reset();
        }
    }, [isOpen, reset]);

    const mutation = useMutation({
        mutationFn: (data: any) => {
            return productionApi.create({
                productId: data.productId,
                quantity: parseFloat(data.quantity),
                notes: data.notes,
                scheduledDate: data.scheduledDate ? new Date(data.scheduledDate).toISOString() : undefined
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['production-orders'] });
            onClose();
            reset();
            alert('Orden de producción creada exitosamente');
        },
        onError: (error: any) => {
            alert(`Error: ${error.response?.data?.message || 'No se pudo crear la orden'}`);
        },
    });

    const onSubmit = (data: any) => {
        mutation.mutate(data);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                        Nueva Orden de Producción
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    {/* Producto */}
                    <div>
                        <label className="form-label">Producto a Producir</label>
                        <select
                            {...register('productId', { required: 'Selecciona un producto' })}
                            className="form-select"
                        >
                            <option value="">Seleccionar producto...</option>
                            {productionProducts?.map(product => (
                                <option key={product.id} value={product.id}>
                                    {product.name} ({product.measureUnit})
                                </option>
                            ))}
                        </select>
                        {errors.productId && <span className="form-error">{errors.productId.message as string}</span>}
                    </div>

                    {/* Cantidad */}
                    <div>
                        <label className="form-label">Cantidad</label>
                        <input
                            type="number"
                            step="any"
                            {...register('quantity', { required: 'La cantidad es requerida', min: 0.1 })}
                            className="form-input"
                            placeholder="0.00"
                        />
                        {errors.quantity && <span className="form-error">{errors.quantity.message as string}</span>}
                    </div>

                    {/* Fecha Programada */}
                    <div>
                        <label className="form-label">Fecha Programada (Opcional)</label>
                        <input
                            type="date"
                            {...register('scheduledDate')}
                            className="form-input"
                        />
                    </div>

                    {/* Notas */}
                    <div>
                        <label className="form-label">Notas</label>
                        <textarea
                            {...register('notes')}
                            className="form-textarea"
                            rows={3}
                            placeholder="Instrucciones especiales..."
                        ></textarea>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-secondary"
                            disabled={mutation.isPending}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary flex items-center gap-2"
                            disabled={mutation.isPending}
                        >
                            {mutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            Crear Orden
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
