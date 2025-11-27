import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addressesApi, CreateAddressDto, Address } from '@/api/addresses';
import { MapPin, Plus, Trash2, Edit2, X } from 'lucide-react';

export default function AddressList() {
    const queryClient = useQueryClient();
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<CreateAddressDto>({
        label: '',
        recipientName: '',
        phone: '',
        street: '',
        number: '',
        apartment: '',
        neighborhood: '',
        city: '',
        state: '',
        zipCode: '',
        isDefault: false,
    });

    const { data: addresses = [] } = useQuery({
        queryKey: ['addresses'],
        queryFn: addressesApi.getAll,
    });

    const createMutation = useMutation({
        mutationFn: addressesApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
            resetForm();
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreateAddressDto> }) =>
            addressesApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
            resetForm();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: addressesApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['addresses'] });
        },
    });

    const resetForm = () => {
        setIsEditing(false);
        setEditingId(null);
        setFormData({
            label: '',
            recipientName: '',
            phone: '',
            street: '',
            number: '',
            apartment: '',
            neighborhood: '',
            city: '',
            state: '',
            zipCode: '',
            isDefault: false,
        });
    };

    const handleEdit = (address: Address) => {
        setFormData({
            label: address.label || '',
            recipientName: address.recipientName,
            phone: address.phone,
            street: address.street,
            number: address.number,
            apartment: address.apartment || '',
            neighborhood: address.neighborhood || '',
            city: address.city,
            state: address.state,
            zipCode: address.zipCode || '',
            isDefault: address.isDefault,
        });
        setEditingId(address.id);
        setIsEditing(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            updateMutation.mutate({ id: editingId, data: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Mis Direcciones
                </h2>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="btn btn-sm btn-outline flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Nueva Dirección
                    </button>
                )}
            </div>

            {isEditing ? (
                <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-gray-700">
                            {editingId ? 'Editar Dirección' : 'Nueva Dirección'}
                        </h3>
                        <button type="button" onClick={resetForm} className="text-gray-500 hover:text-gray-700">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Etiqueta (Ej: Casa, Trabajo)</label>
                            <input
                                type="text"
                                className="input w-full"
                                value={formData.label}
                                onChange={e => setFormData({ ...formData, label: e.target.value })}
                                placeholder="Opcional"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de quien recibe</label>
                            <input
                                type="text"
                                className="input w-full"
                                value={formData.recipientName}
                                onChange={e => setFormData({ ...formData, recipientName: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                            <input
                                type="tel"
                                className="input w-full"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Calle</label>
                            <input
                                type="text"
                                className="input w-full"
                                value={formData.street}
                                onChange={e => setFormData({ ...formData, street: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                                <input
                                    type="text"
                                    className="input w-full"
                                    value={formData.number}
                                    onChange={e => setFormData({ ...formData, number: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Apto/Int</label>
                                <input
                                    type="text"
                                    className="input w-full"
                                    value={formData.apartment}
                                    onChange={e => setFormData({ ...formData, apartment: e.target.value })}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Colonia/Barrio</label>
                            <input
                                type="text"
                                className="input w-full"
                                value={formData.neighborhood}
                                onChange={e => setFormData({ ...formData, neighborhood: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                            <input
                                type="text"
                                className="input w-full"
                                value={formData.city}
                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Estado/Provincia</label>
                            <input
                                type="text"
                                className="input w-full"
                                value={formData.state}
                                onChange={e => setFormData({ ...formData, state: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="isDefault"
                            checked={formData.isDefault}
                            onChange={e => setFormData({ ...formData, isDefault: e.target.checked })}
                            className="rounded text-primary focus:ring-primary"
                        />
                        <label htmlFor="isDefault" className="text-sm text-gray-700">Establecer como predeterminada</label>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button type="button" onClick={resetForm} className="btn btn-ghost">Cancelar</button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={createMutation.isPending || updateMutation.isPending}
                        >
                            {createMutation.isPending || updateMutation.isPending ? 'Guardando...' : 'Guardar Dirección'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.length === 0 ? (
                        <p className="text-gray-500 col-span-2 text-center py-8">No tienes direcciones guardadas.</p>
                    ) : (
                        addresses.map(address => (
                            <div key={address.id} className="border rounded-lg p-4 relative group hover:border-primary transition-colors">
                                {address.isDefault && (
                                    <span className="absolute top-2 right-2 bg-primary/10 text-primary text-xs px-2 py-1 rounded-full font-medium">
                                        Predeterminada
                                    </span>
                                )}
                                <div className="pr-8">
                                    <h4 className="font-semibold text-gray-800 mb-1">{address.label || 'Dirección'}</h4>
                                    <p className="text-sm text-gray-600">{address.street} #{address.number} {address.apartment}</p>
                                    <p className="text-sm text-gray-600">{address.neighborhood}, {address.city}</p>
                                    <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                                        <span className="font-medium">Recibe:</span> {address.recipientName}
                                    </p>
                                </div>

                                <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEdit(address)}
                                        className="btn btn-xs btn-outline flex items-center gap-1"
                                    >
                                        <Edit2 className="w-3 h-3" /> Editar
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm('¿Eliminar dirección?')) deleteMutation.mutate(address.id);
                                        }}
                                        className="btn btn-xs btn-outline text-red-500 hover:bg-red-50 hover:border-red-200 flex items-center gap-1"
                                    >
                                        <Trash2 className="w-3 h-3" /> Eliminar
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
