import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useMutation } from '@tanstack/react-query';
import { usersApi, UpdateProfileDto } from '@/api/users';
import { User, Lock, Save } from 'lucide-react';

export default function ProfileInfo() {
    const { user, setUser } = useAuthStore();
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        phone: user?.phone || '',
        password: '',
    });

    const updateProfileMutation = useMutation({
        mutationFn: usersApi.updateProfile,
        onSuccess: (updatedUser) => {
            setUser({ ...user!, ...updatedUser });
            setFormData(prev => ({ ...prev, password: '' }));
            alert('Perfil actualizado correctamente');
        },
        onError: () => {
            alert('Error al actualizar perfil');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data: UpdateProfileDto = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
        };
        if (formData.password) {
            data.password = formData.password;
        }
        updateProfileMutation.mutate(data);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Mis Datos Personales
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input
                            type="text"
                            className="input w-full"
                            value={formData.firstName}
                            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                        <input
                            type="text"
                            className="input w-full"
                            value={formData.lastName}
                            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                            required
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                        type="email"
                        className="input w-full bg-gray-50 text-gray-500"
                        value={user?.email}
                        disabled
                    />
                    <p className="text-xs text-gray-400 mt-1">El email no se puede cambiar</p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                    <input
                        type="tel"
                        className="input w-full"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>

                <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Cambiar Contraseña
                    </h3>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nueva Contraseña</label>
                        <input
                            type="password"
                            className="input w-full"
                            placeholder="Dejar en blanco para mantener la actual"
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            minLength={6}
                        />
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="btn btn-primary flex items-center gap-2"
                        disabled={updateProfileMutation.isPending}
                    >
                        <Save className="w-4 h-4" />
                        {updateProfileMutation.isPending ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
}
