import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'


// Layouts
import PublicLayout from '@/layouts/PublicLayout'
import DashboardLayout from '@/layouts/DashboardLayout'

// Public Pages
import Home from '@/pages/Home'
import Login from '@/pages/auth/Login'
import Register from '@/pages/auth/Register'
import Shop from '@/pages/shop/Shop'
import ProductDetail from '@/pages/shop/ProductDetail'
import Cart from '@/pages/shop/Cart'

// Dashboard Pages
import Dashboard from '@/pages/dashboard/Dashboard'
import Products from '@/pages/dashboard/Products'
import Orders from '@/pages/dashboard/Orders'
import Production from '@/pages/dashboard/Production'
import Inventory from '@/pages/dashboard/Inventory'
import CashBox from '@/pages/dashboard/CashBox'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/shop/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                </Route>

                {/* Protected Dashboard Routes */}
                <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/dashboard/products" element={<Products />} />
                    <Route path="/dashboard/orders" element={<Orders />} />
                    <Route path="/dashboard/production" element={<Production />} />
                    <Route path="/dashboard/inventory" element={<Inventory />} />
                    <Route path="/dashboard/cash-box" element={<CashBox />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
