import { useAuthStore } from '@/store/authStore';
import { User } from 'lucide-react';

export default function DashboardHeader() {
    const { user } = useAuthStore();

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold text-gray-800">
                    Panel de Administración
                </h1>

                <div className="flex items-center gap-3">
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                            {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{user?.role}</p>
                    </div>
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                    </div>
                </div>
            </div>
        </header>
    );
}
