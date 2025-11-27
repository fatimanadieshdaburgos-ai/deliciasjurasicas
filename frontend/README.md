# 🎨 FRONTEND REACT - GUÍA DE INSTALACIÓN

## 📦 PASO 1: Instalar Dependencias

```powershell
cd c:\Users\edwin\Desktop\DJ\frontend
npm install
```

## ⚙️ PASO 2: Configurar Variables de Entorno

```powershell
copy .env.example .env
```

Editar `.env`:

```env
# Para desarrollo local (apuntando a tu backend local)
VITE_API_URL=http://localhost:3000/api/v1

# Para producción (después de deployar en Render)
# VITE_API_URL=https://tu-backend.onrender.com/api/v1
```

## 🚀 PASO 3: Iniciar Servidor de Desarrollo

```powershell
npm run dev
```

La app estará en: **http://localhost:5173**

##📁 ESTRUCTURA DE CARPETAS CREADA

```
frontend/
├── src/
│   ├── main.tsx              ✅ Entry point
│   ├── App.tsx               ✅ Router principal
│   ├── index.css             ⬜ Estilos globales
│   │
│   ├── api/                  ⬜ Llamadas a la API
│   │   ├── client.ts        ⬜ Axios config
│   │   ├── auth.ts          ⬜ Auth endpoints
│   │   ├── products.ts      ⬜ Products endpoints
│   │   └── orders.ts        ⬜ Orders endpoints
│   │
│   ├── store/               ⬜ Zustand stores
│   │   ├── authStore.ts    ⬜ Auth state
│   │   ├── cartStore.ts    ⬜ Cart state
│   │   └── uiStore.ts      ⬜ UI state
│   │
│   ├── types/              ⬜ TypeScript types
│   │   └── index.ts        ⬜ Tipos compartidos
│   │
│   ├── layouts/            ⬜ Layout components
│   │   ├── PublicLayout.tsx
│   │   └── DashboardLayout.tsx
│   │
│   ├── components/         ⬜ Reusable components
│   │   ├── common/
│   │   ├── shop/
│   │   └── dashboard/
│   │
│   └── pages/              ⬜ Page components
│       ├── Home.tsx
│       ├── auth/
│       ├── shop/
│       └── dashboard/
```

## 📝 ARCHIVOS CREADOS HASTA AHORA

✅ `package.json` - Dependencias del proyecto
✅ `vite.config.ts` - Configuración de Vite
✅ `tsconfig.json` - TypeScript config
✅ `.env.example` - Variables de entorno
✅ `index.html` - HTML base
✅ `src/main.tsx` - Entry point con React Query
✅ `src/App.tsx` - Router con rutas

## 🔧 PRÓXIMOS ARCHIVOS A CREAR

Para tener un sistema completo, necesitamos crear:

### 1. **Configuración de API** (Alta prioridad)
- `src/api/client.ts` - Cliente Axios con interceptors
- `src/api/auth.ts` - Endpoints de autenticación
- `src/api/products.ts` - Endpoints de productos

### 2. **Gestión de Estado** (Alta prioridad)
- `src/store/authStore.ts` - Estado de autenticación
- `src/store/cartStore.ts` - Estado del carrito

### 3. **Tipos TypeScript** (Alta prioridad)
- `src/types/index.ts` - Interfaces de User, Product, Order, etc.

### 4. **Layouts** (Media prioridad)
- `src/layouts/PublicLayout.tsx` - Layout para pages públicas
- `src/layouts/DashboardLayout.tsx` - Layout para dashboard

### 5. **Componentes** (Media prioridad)
- `src/components/common/Navbar.tsx`
- `src/components/common/Footer.tsx`
- `src/components/shop/ProductCard.tsx`

### 6. **Páginas** (Media prioridad)
- `src/pages/Home.tsx` - Homepage
- `src/pages/auth/Login.tsx` - Login page
- `src/pages/shop/Shop.tsx` - Catálogo
- `src/pages/dashboard/Dashboard.tsx` - Dashboard principal

## 🎯 ¿QUIERES QUE CONTINÚE?

Tengo 3 opciones para ti:

### Opción A: **Crear Sistema Mínimo Funcional** (Recomendado)
Creo solo lo esencial para que funcione:
- Login/Register
- Catálogo de productos
- Carrito de compras
- Dashboard básico

**Tiempo estimado**: ~15 archivos más
**Ventaja**: Sistema funcional rápido

### Opción B: **Sistema Completo**
Creo TODO el sistema con todas las funcionalidades:
- Todo lo de Opción A
- Gestión de órdenes
- Panel de producción
- Control de inventario
- Reportes

**Tiempo estimado**: ~40+ archivos
**Ventaja**: Sistema completo pro

### Opción C: **Sólo Deployment**
Te doy instrucciones para:
- Deployar lo que tenemos en Vercel
- Conectar con el backend en Render
- Después tú agregas funcionalidades

**¿Cuál prefieres?**
