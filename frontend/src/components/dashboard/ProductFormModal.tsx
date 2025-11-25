import { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productsApi } from '@/api/products';
import { X, Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { ProductType, MeasureUnit } from '@/types';

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    productToEdit?: any;
}

export default function ProductFormModal({ isOpen, onClose, productToEdit }: ProductFormModalProps) {
    const queryClient = useQueryClient();
    const { register, control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            sku: '',
            description: '',
            type: ProductType.PRODUCTO_TERMINADO,
            salePrice: 0,
            costPrice: 0,
            currentStock: 0,
            minStock: 0,
            measureUnit: MeasureUnit.UN,
            recipe: {
                ingredients: [] as { ingredientId: string; quantity: number; unit: string }[]
            }
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "recipe.ingredients"
    });

    const selectedType = watch('type');
    const showRecipe = selectedType === ProductType.PRODUCTO_TERMINADO || selectedType === ProductType.SEMI_ELABORADO;

    // Fetch ingredients (raw materials)
    const { data: ingredients } = useQuery({
        queryKey: ['ingredients-list'],
        queryFn: () => productsApi.getAll({ type: ProductType.INSUMO, limit: 100 }),
        enabled: isOpen && showRecipe
    });

    useEffect(() => {
        if (productToEdit) {
            setValue('name', productToEdit.name);
            setValue('sku', productToEdit.sku);
            setValue('description', productToEdit.description);
            setValue('type', productToEdit.type);
            setValue('salePrice', productToEdit.salePrice);
            setValue('costPrice', productToEdit.costPrice);
            setValue('currentStock', productToEdit.currentStock);
            setValue('minStock', productToEdit.minStock);
            setValue('measureUnit', productToEdit.measureUnit);

            // Load existing recipe if available
            if (productToEdit.recipe?.ingredients) {
                const formattedIngredients = productToEdit.recipe.ingredients.map((ri: any) => ({
                    ingredientId: ri.ingredient.id,
                    quantity: ri.quantity,
                    unit: ri.unit
                }));
                setValue('recipe.ingredients', formattedIngredients);
            } else {
                setValue('recipe.ingredients', []);
            }
        } else {
            reset();
            setValue('type', ProductType.PRODUCTO_TERMINADO);
            setValue('measureUnit', MeasureUnit.UN);
            setValue('recipe.ingredients', []);
        }
    }, [productToEdit, isOpen, setValue, reset]);

    const mutation = useMutation({
        mutationFn: (data: any) => {
            // Clean up data based on type
            if (!showRecipe) {
                delete data.recipe;
            }

            if (productToEdit) {
                return productsApi.update(productToEdit.id, data);
            } else {
                return productsApi.create(data);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-products'] });
            onClose();
            reset();
            alert(productToEdit ? 'Producto actualizado' : 'Producto creado');
        },
        onError: (error: any) => {
            alert(`Error: ${error.response?.data?.message || 'Algo salió mal'}`);
        },
    });

    const onSubmit = (data: any) => {
        // Convert numbers
        data.salePrice = parseFloat(data.salePrice as any);
        data.costPrice = parseFloat(data.costPrice as any);
        data.currentStock = parseFloat(data.currentStock as any);
        data.minStock = parseFloat(data.minStock as any);

        if (data.recipe?.ingredients) {
            data.recipe.ingredients = data.recipe.ingredients.map((i: any) => ({
                ...i,
                quantity: parseFloat(i.quantity)
            }));
        }

        mutation.mutate(data);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                        {productToEdit ? 'Editar Producto' : 'Nuevo Producto'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-8">
                    {/* Basic Info Section */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Información Básica</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="form-label">Nombre del Producto</label>
                                <input
                                    {...register('name', { required: 'El nombre es requerido' })}
                                    className="form-input"
                                    placeholder="Ej. Pastel de Chocolate T-Rex"
                                />
                                {errors.name && <span className="form-error">{errors.name.message as string}</span>}
                            </div>

                            <div>
                                <label className="form-label">SKU (Código)</label>
                                <input
                                    {...register('sku', { required: 'El SKU es requerido' })}
                                    className="form-input font-mono"
                                    placeholder="Ej. PAS-CHO-001"
                                />
                                {errors.sku && <span className="form-error">{errors.sku.message as string}</span>}
                            </div>

                            <div>
                                <label className="form-label">Tipo</label>
                                <select {...register('type')} className="form-select">
                                    <option value={ProductType.PRODUCTO_TERMINADO}>Producto Terminado</option>
                                    <option value={ProductType.INSUMO}>Insumo</option>
                                    <option value={ProductType.SEMI_ELABORADO}>Semi Elaborado</option>
                                </select>
                            </div>

                            <div>
                                <label className="form-label">Precio de Venta</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register('salePrice', { required: true, min: 0 })}
                                        className="form-input pl-8"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="form-label">Costo de Producción</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        {...register('costPrice', { required: true, min: 0 })}
                                        className="form-input pl-8"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="form-label">Stock Actual</label>
                                <input
                                    type="number"
                                    step="any"
                                    {...register('currentStock', { required: true, min: 0 })}
                                    className="form-input"
                                />
                            </div>

                            <div>
                                <label className="form-label">Stock Mínimo</label>
                                <input
                                    type="number"
                                    step="any"
                                    {...register('minStock', { required: true, min: 0 })}
                                    className="form-input"
                                />
                            </div>

                            <div>
                                <label className="form-label">Unidad de Medida</label>
                                <select {...register('measureUnit')} className="form-select">
                                    <option value={MeasureUnit.UN}>Unidad (UN)</option>
                                    <option value={MeasureUnit.KG}>Kilogramo (KG)</option>
                                    <option value={MeasureUnit.GR}>Gramo (GR)</option>
                                    <option value={MeasureUnit.LT}>Litro (LT)</option>
                                    <option value={MeasureUnit.ML}>Mililitro (ML)</option>
                                    <option value={MeasureUnit.DOC}>Docena (DOC)</option>
                                    <option value={MeasureUnit.PZA}>Pieza (PZA)</option>
                                </select>
                            </div>

                            <div className="col-span-2">
                                <label className="form-label">Descripción</label>
                                <textarea
                                    {...register('description')}
                                    className="form-textarea"
                                    rows={3}
                                    placeholder="Descripción detallada del producto..."
                                ></textarea>
                            </div>
                        </div>
                    </div>

                    {/* Recipe Section */}
                    {showRecipe && (
                        <div className="space-y-6 animate-fade-in">
                            <div className="flex items-center justify-between border-b pb-2">
                                <h3 className="text-lg font-semibold text-gray-800">Receta / Insumos</h3>
                                <button
                                    type="button"
                                    onClick={() => append({ ingredientId: '', quantity: 1, unit: MeasureUnit.GR })}
                                    className="btn btn-sm btn-outline text-primary-600 hover:bg-primary-50 flex items-center gap-1 text-sm py-1 px-3"
                                >
                                    <Plus className="w-4 h-4" />
                                    Agregar Insumo
                                </button>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                                {fields.length === 0 && (
                                    <p className="text-center text-gray-500 py-4 italic">
                                        No hay insumos agregados a la receta.
                                    </p>
                                )}

                                {fields.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-12 gap-3 items-end">
                                        <div className="col-span-5">
                                            <label className="text-xs font-semibold text-gray-500 mb-1 block">Insumo</label>
                                            <select
                                                {...register(`recipe.ingredients.${index}.ingredientId` as const, { required: true })}
                                                className="form-select text-sm"
                                            >
                                                <option value="">Seleccionar...</option>
                                                {ingredients?.data?.map((ing: any) => (
                                                    <option key={ing.id} value={ing.id}>
                                                        {ing.name} ({ing.measureUnit})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-span-3">
                                            <label className="text-xs font-semibold text-gray-500 mb-1 block">Cantidad</label>
                                            <input
                                                type="number"
                                                step="any"
                                                {...register(`recipe.ingredients.${index}.quantity` as const, { required: true, min: 0.001 })}
                                                className="form-input text-sm"
                                                placeholder="0.00"
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <label className="text-xs font-semibold text-gray-500 mb-1 block">Unidad</label>
                                            <select
                                                {...register(`recipe.ingredients.${index}.unit` as const)}
                                                className="form-select text-sm"
                                            >
                                                <option value={MeasureUnit.KG}>KG</option>
                                                <option value={MeasureUnit.GR}>GR</option>
                                                <option value={MeasureUnit.LT}>LT</option>
                                                <option value={MeasureUnit.ML}>ML</option>
                                                <option value={MeasureUnit.UN}>UN</option>
                                            </select>
                                        </div>
                                        <div className="col-span-1 flex justify-center pb-2">
                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded transition"
                                                title="Eliminar insumo"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

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
                            {productToEdit ? 'Guardar Cambios' : 'Crear Producto'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
