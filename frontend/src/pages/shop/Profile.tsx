import { useState } from 'react';
import { User, MapPin, ShoppingBag, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import ProfileInfo from '@/components/profile/ProfileInfo';
import AddressList from '@/components/profile/AddressList';
import OrderHistory from '@/components/profile/OrderHistory';

type Tab = 'info' | 'addresses' | 'orders';

export default function Profile() {
    const [activeTab, setActiveTab] = useState<Tab>('info');
    const { logout, user } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <div className="w-full md:w-64 flex-shrink-0">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 bg-primary/5">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3 text-primary mx-auto">
                                    <User className="w-8 h-8" />
                                </div>
                                <h2 className="text-center font-bold text-gray-800 truncate">
                                    {user?.firstName} {user?.lastName}
                                </h2>
                                <p className="text-center text-sm text-gray-500 truncate">{user?.email}</p>
                            </div>
                            <nav className="p-2 space-y-1">
                                <button
                                    onClick={() => setActiveTab('info')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'info'
                                            ? 'bg-primary text-white shadow-md'
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <User className="w-4 h-4" />
                                    Mis Datos
                                </button>
                                <button
                                    onClick={() => setActiveTab('addresses')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'addresses'
                                            ? 'bg-primary text-white shadow-md'
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <MapPin className="w-4 h-4" />
                                    Direcciones
                                </button>
                                <button
                                    onClick={() => setActiveTab('orders')}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${activeTab === 'orders'
                                            ? 'bg-primary text-white shadow-md'
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <ShoppingBag className="w-4 h-4" />
                                    Mis Pedidos
                                </button>
                                <div className="pt-2 mt-2 border-t border-gray-100">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Cerrar Sesión
                                    </button>
                                </div>
                            </nav>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        {activeTab === 'info' && <ProfileInfo />}
                        {activeTab === 'addresses' && <AddressList />}
                        {activeTab === 'orders' && <OrderHistory />}
                    </div>
                </div>
            </div>
        </div>
    );
}
