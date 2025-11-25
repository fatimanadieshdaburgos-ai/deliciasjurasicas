import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Factory,
    Archive,
    DollarSign,
    LogOut,
    ChevronRight
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function DashboardSidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const allMenuItems = [
        { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['ADMIN', 'VENDEDOR', 'PANADERO', 'REPARTIDOR'] },
        { path: '/dashboard/products', icon: Package, label: 'Productos', roles: ['ADMIN', 'PANADERO'] },
        { path: '/dashboard/orders', icon: ShoppingBag, label: 'Pedidos', roles: ['ADMIN', 'VENDEDOR', 'REPARTIDOR'] },
        { path: '/dashboard/production', icon: Factory, label: 'Producción', roles: ['ADMIN', 'PANADERO'] },
        { path: '/dashboard/inventory', icon: Archive, label: 'Inventario', roles: ['ADMIN', 'PANADERO'] },
        { path: '/dashboard/cash-box', icon: DollarSign, label: 'Caja', roles: ['ADMIN', 'VENDEDOR'] },
    ];

    const menuItems = allMenuItems.filter(item =>
        user?.role && item.roles.includes(user.role)
    );

    return (
        <aside className="w-72 bg-gray-900 text-white flex flex-col h-screen sticky top-0 border-r border-gray-800">
            <div className="p-6 border-b border-gray-800">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="bg-primary-500 rounded-xl p-2 group-hover:bg-primary-400 transition-colors">
                        <span className="text-2xl">🦖</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold leading-none">DJ Admin</h2>
                        <span className="text-xs text-gray-400">Panel de Control</span>
                    </div>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                <p className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">Menu Principal</p>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}`} />
                                <span className="font-medium">{item.label}</span>
                            </div>
                            {isActive && <ChevronRight className="w-4 h-4" />}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-800 bg-gray-900/50">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200 group"
                >
                    <LogOut className="w-5 h-5 group-hover:text-red-400" />
                    <span className="font-medium">Cerrar Sesión</span>
                </button>
            </div>
        </aside>
    );
}
