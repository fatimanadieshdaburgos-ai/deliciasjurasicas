import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, LogOut } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useState } from 'react';

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuthStore();
    const { getItemCount } = useCartStore();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary-500 rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
                            <div className="relative bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl p-2.5 text-white shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform duration-300">
                                <span className="text-2xl">🦖</span>
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-bold text-gray-900 leading-none tracking-tight group-hover:text-primary-600 transition-colors">
                                Delicias Jurásicas
                            </span>
                            <span className="text-xs font-medium text-gray-500 tracking-widest uppercase mt-0.5">
                                Pastelería & Café
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">
                        <NavLink to="/">Inicio</NavLink>
                        <NavLink to="/shop">Tienda</NavLink>
                        {isAuthenticated && user?.role !== 'CLIENTE' && (
                            <Link
                                to="/dashboard"
                                className="ml-2 px-4 py-2 bg-primary-50 text-primary-700 font-medium rounded-lg hover:bg-primary-100 transition-colors"
                            >
                                Panel Admin
                            </Link>
                        )}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        {/* Cart */}
                        <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors group">
                            <ShoppingCart className="w-6 h-6" />
                            {getItemCount() > 0 && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white shadow-sm transform group-hover:scale-110 transition-transform">
                                    {getItemCount()}
                                </span>
                            )}
                        </Link>

                        {/* User Menu */}
                        {isAuthenticated ? (
                            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                                <Link to="/profile" className="hidden md:flex flex-col items-end hover:opacity-80 transition-opacity">
                                    <span className="text-sm font-semibold text-gray-900">{user?.firstName}</span>
                                    <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full uppercase tracking-wide">
                                        {user?.role}
                                    </span>
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    title="Cerrar Sesión"
                                >
                                    <LogOut className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-primary-600 transition-colors">
                                    Iniciar Sesión
                                </Link>
                                <Link to="/register" className="btn btn-primary py-2.5 px-5 text-sm shadow-primary-500/20">
                                    Registrarse
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
    return (
        <Link
            to={to}
            className="px-4 py-2 text-gray-600 font-medium rounded-lg hover:bg-gray-50 hover:text-primary-600 transition-all"
        >
            {children}
        </Link>
    );
}
