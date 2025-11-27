# 🦖 Delicias Jurásicas - Sistema Integral de Gestión

## 🎯 Descripción del Proyecto

**Delicias Jurásicas** es una plataforma integral de gestión para pastelería que combina:
- 🛒 **E-commerce** para ventas online con carrito persistente y checkout completo
- 🏪 **POS (Punto de Venta)** para ventas en mostrador
- 🏭 **Sistema de Producción** con órdenes de manufactura y recetas (BOM)
- 📦 **Control de Inventario** con seguimiento de movimientos en tiempo real
- 💰 **Gestión de Caja** con apertura, cierre y registro de transacciones
- 👥 **Gestión de Usuarios** con sistema RBAC (Control de Acceso Basado en Roles)
- 📊 **Reportes y Análisis** de ventas, inventario y caja
- 🚚 **Gestión de Entregas** con asignación de repartidores

---

## 🚀 Stack Tecnológico

### Backend
- **Framework:** NestJS 10.x (TypeScript)
- **ORM:** Prisma 5.x
- **Base de Datos:** PostgreSQL 15+
- **Autenticación:** JWT + Bcrypt
- **Validación:** class-validator, class-transformer
- **Documentación:** Swagger/OpenAPI
- **Arquitectura:** Domain-Driven Design + Capas

### Frontend
- **Framework:** React 18 (TypeScript)
- **Build Tool:** Vite 5.x
- **Routing:** React Router DOM v6
- **Estado Global:** Zustand
- **Data Fetching:** TanStack Query (React Query)
- **Estilos:** Tailwind CSS 3.x
- **Iconos:** Lucide React
- **Formularios:** React Hook Form
- **Fechas:** date-fns

### DevOps
- **Deployment Backend:** Render (Node.js + PostgreSQL)
- **Deployment Frontend:** Vercel
- **Control de Versiones:** Git

---

## 📁 Estructura del Proyecto

```
delicias-jurasicas/
├── backend/  (raíz del proyecto)
│   ├── src/
│   │   ├── core/              # Módulo base (Prisma, configuración)
│   │   ├── auth/              # Autenticación y autorización
│   │   ├── users/             # Gestión de usuarios
│   │   ├── products/          # Catálogo de productos
│   │   ├── categories/        # Categorías de productos
│   │   ├── recipes/           # Recetas (Bill of Materials)
│   │   ├── production/        # Órdenes de producción
│   │   ├── inventory/         # Control de inventario
│   │   ├── promotions/        # Promociones y descuentos
│   │   ├── cart/              # Carrito de compras
│   │   ├── orders/            # Gestión de pedidos
│   │   ├── addresses/         # Direcciones de entrega
│   │   ├── cash-box/          # Control de caja
│   │   ├── delivery/          # Entregas y repartidores
│   │   ├── suppliers/         # Gestión de proveedores
│   │   ├── reports/           # Reportes y estadísticas
│   │   └── settings/          # Configuraciones del sistema
│   ├── prisma/
│   │   ├── schema.prisma      # Esquema de base de datos
│   │   └── migrations/        # Migraciones
│   ├── .env                   # Variables de entorno
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/               # Servicios API
    │   ├── components/        # Componentes React
    │   │   ├── common/        # Componentes reutilizables
    │   │   ├── shop/          # Componentes de tienda
    │   │   ├── dashboard/     # Componentes de admin
    │   │   ├── orders/        # Componentes de pedidos
    │   │   └── profile/       # Componentes de perfil
    │   ├── layouts/           # Layouts de página
    │   ├── pages/             # Páginas principales
    │   │   ├── shop/          # Páginas de e-commerce
    │   │   └── dashboard/     # Páginas de administración
    │   ├── store/             # Stores de Zustand
    │   ├── types/             # Definiciones TypeScript
    │   ├── App.tsx            # Configuración de rutas
    │   └── main.tsx           # Punto de entrada
    ├── public/                # Assets públicos
    ├── index.html
    ├── tailwind.config.js     # Configuración de Tailwind
    └── package.json
```

---

## 🎨 Paleta de Colores

### Colores Principales
- **Beige (#F5E6A8)**: Cálido y acogedor - Fondos principales
- **Verde (#ACEB8D)**: Fresco y moderno - Color de marca
- **Amarillo (#DBD749)**: Energético - CTAs y botones importantes
- **Negro (#000000)**: Elegante - Texto y contraste
- **Gris (#D9D9D9)**: Neutral - Bordes y fondos secundarios
- **Blanco (#FFFFFF)**: Pureza - Fondo principal

### Colores Complementarios
- **Naranja (#F97316)**: Promociones y ofertas
- **Chocolate (#8B5E3C)**: Productos de chocolate

Más detalles en: [`color_palette.md`](./docs/color_palette.md)

---

## 🗄️ Modelo de Datos

### Modelos Principales

**Core:**
- `User` - Usuarios del sistema (clientes, admin, vendedores, panaderos, repartidores)
- `Address` - Direcciones de entrega de clientes

**Catálogo:**
- `Category` - Categorías de productos
- `Product` - Productos e insumos
- `ProductImage` - Imágenes de productos
- `Recipe` - Recetas de productos terminados
- `RecipeIngredient` - Ingredientes de recetas (BOM)

**Inventario:**
- `StockMovement` - Historial de movimientos de inventario
- `ProductionOrder` - Órdenes de producción

**Comercial:**
- `Promotion` - Promociones y descuentos
- `Cart` - Carritos de compra
- `CartItem` - Items en carritos
- `Order` - Pedidos
- `OrderItem` - Items de pedidos
- `Delivery` - Entregas asignadas a repartidores

**Finanzas:**
- `CashBox` - Registros de caja
- `CashTransaction` - Transacciones de efectivo

**Proveedores:**
- `Supplier` - Proveedores de insumos

**Sistema:**
- `Setting` - Configuraciones generales
- `AuditLog` - Registro de auditoría

Ver esquema completo en: [`prisma/schema.prisma`](./prisma/schema.prisma)

---

## 🔐 Roles y Permisos

### Sistema RBAC (Role-Based Access Control)

| Rol | Descripción | Acceso |
|-----|-------------|--------|
| **ADMIN** | Administrador total | Acceso completo a todo el sistema |
| **PANADERO** | Panadero/Productor | Producción, inventario, productos, proveedores |
| **VENDEDOR** | Vendedor POS | Pedidos, caja, ventas en mostrador |
| **REPARTIDOR** | Repartidor | Visualización de entregas asignadas |
| **CLIENTE** | Cliente online | Tienda, carrito, perfil, pedidos propios |

---

## ✨ Funcionalidades Principales

### 🛒 E-commerce (Cliente)
- [x] Catálogo de productos con búsqueda y filtros
- [x] Detalle de producto con imágenes y recetas
- [x] Carrito de compras persistente
- [x] Checkout con selección de dirección de entrega
- [x] Sistema de promociones y cupones
- [x] Perfil de usuario con gestión de:
  - Datos personales
  - Direcciones de entrega (CRUD)
  - Historial de pedidos
- [x] Seguimiento de pedidos en tiempo real

### 🏪 Dashboard Administrativo
- [x] **Dashboard Principal**: Estadísticas en tiempo real
- [x] **Productos**: CRUD completo con gestión de recetas
- [x] **Pedidos**: Visualización, actualización de estados, impresión de recibos
- [x] **Producción**: Órdenes de fabricación con descuento automático de insumos
- [x] **Inventario**: Control de stock con alertas de bajo inventario
- [x] **Caja**: Apertura, cierre y registro de movimientos
- [x] **Proveedores**: Gestión completa de proveedores
- [x] **Usuarios**: Administración de usuarios internos (CRUD + roles)
- [x] **Reportes**: Análisis de ventas, inventario y caja

### 🏭 Sistema de Producción
- [x] Órdenes de producción con validación de stock de insumos
- [x] **Descuento automático** de insumos al completar producción
- [x] **Incremento automático** de productos terminados
- [x] Registro completo de movimientos de inventario
- [x] Recetas (Bill of Materials) para productos

### 📦 Gestión de Inventario
- [x] Seguimiento de stock en tiempo real
- [x] Alertas de stock bajo
- [x] Historial completo de movimientos:
  - Ventas
  - Producción (entrada/salida)
  - Ajustes manuales
  - Devoluciones
- [x] Registro de stock anterior y stock nuevo en cada movimiento

### 💰 Control de Caja
- [x] Apertura de caja con monto inicial
- [x] Registro automático de ventas
- [x] Registro de gastos y retiros
- [x] Cierre de caja con cálculo de diferencias
- [x] Control de faltantes y sobrantes

### 🎨 Interfaz de Usuario
- [x] Diseño responsive (mobile-first)
- [x] Tema personalizado con paleta Delicias Jurásicas
- [x] Animaciones y transiciones suaves
- [x] Glassmorphism y efectos modernos
- [x] Navegación intuitiva
- [x] Sidebar dinámico por roles

---

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ y npm
- PostgreSQL 15+
- Git

### 1. Clonar el Repositorio
```bash
git clone <repository-url>
cd delicias-jurasicas
```

### 2. Configurar Backend

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env

# Editar .env con tus credenciales
DATABASE_URL="postgresql://user:password@localhost:5432/delicias_jurasicas"
JWT_SECRET="tu-secreto-jwt-super-seguro"
JWT_EXPIRES_IN="7d"
PORT=3000
FRONTEND_URL="http://localhost:5173"

# Generar Prisma Client
npx prisma generate

# Ejecutar migraciones
npx prisma migrate dev

# (Opcional) Seed de datos iniciales
npx prisma db seed

# Iniciar servidor de desarrollo
npm run start:dev
```

El backend estará disponible en `http://localhost:3000`
La documentación Swagger en `http://localhost:3000/api`

### 3. Configurar Frontend

```bash
# Navegar a la carpeta frontend
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
# Crear archivo .env
VITE_API_URL=http://localhost:3000

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará disponible en `http://localhost:5173`

---

## 📝 Uso del Sistema

### Usuario Administrador por Defecto
```
Email: admin@deliciasjurasicas.com
Password: Admin123!
```

### Flujo de Trabajo Típico

#### 1. Configuración Inicial (Admin)
1. Crear categorías de productos
2. Crear insumos (harina, azúcar, etc.)
3. Crear productos terminados con sus recetas
4. Configurar proveedores
5. Crear usuarios internos (vendedores, panaderos, repartidores)

#### 2. Operación Diaria

**Panadero:**
1. Ver órdenes de producción pendientes
2. Iniciar producción
3. Completar producción (descuenta insumos automáticamente)

**Vendedor:**
1. Abrir caja con monto inicial
2. Crear pedidos en POS
3. Procesar pagos
4. Actualizar estados de pedidos
5. Cerrar caja al final del día

**Cliente:**
1. Navegar catálogo
2. Agregar productos al carrito
3. Completar checkout
4. Rastrear pedido

**Repartidor:**
1. Ver entregas asignadas
2. Actualizar estado de entrega
3. Completar entrega

---

## 🧪 Testing

### Backend
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

### Frontend
```bash
cd frontend

# Build de producción (valida TypeScript)
npm run build

# Lint
npm run lint
```

---

## 🚢 Deployment

### Backend (Render)

1. Crear cuenta en [Render](https://render.com)
2. Crear PostgreSQL Database
3. Crear Web Service con:
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npm run start:prod`
4. Configurar variables de entorno
5. Deploy automático desde Git

Ver guía completa: [`DEPLOYMENT_RENDER.md`](./DEPLOYMENT_RENDER.md)

### Frontend (Vercel)

1. Crear cuenta en [Vercel](https://vercel.com)
2. Conectar repositorio de GitHub
3. Configurar:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Vite
4. Agregar variable de entorno: `VITE_API_URL`
5. Deploy

---

## 📊 API Documentation

### Swagger UI
Cuando el backend está corriendo, accede a:
```
http://localhost:3000/api
```

### Endpoints Principales

**Auth:**
- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Inicio de sesión
- `POST /auth/refresh` - Renovar token

**Products:**
- `GET /products` - Listar productos
- `GET /products/:id` - Obtener producto
- `POST /products` - Crear producto (Admin/Panadero)
- `PATCH /products/:id` - Actualizar producto
- `DELETE /products/:id` - Eliminar producto

**Orders:**
- `GET /orders` - Listar pedidos
- `POST /orders` - Crear pedido
- `PATCH /orders/:id/status` - Actualizar estado

**Production:**
- `GET /production-orders` - Listar órdenes
- `POST /production-orders` - Crear orden
- `POST /production-orders/:id/complete` - Completar producción

**Reports:**
- `GET /reports/dashboard` - Estadísticas generales
- `GET /reports/sales` - Reporte de ventas
- `GET /reports/inventory` - Reporte de inventario

---

## 🔧 Scripts Disponibles

### Backend
```bash
npm run start          # Producción
npm run start:dev      # Desarrollo con watch
npm run start:debug    # Debug mode
npm run build          # Build para producción
npm run test           # Tests
npm run lint           # Linter
npm run format         # Prettier
```

### Frontend
```bash
npm run dev            # Servidor de desarrollo
npm run build          # Build para producción
npm run preview        # Preview del build
npm run lint           # Linter
```

---

## 📚 Documentación Adicional

- [Paleta de Colores](./docs/color_palette.md)
- [Guía de Test de Inventario](./docs/inventory_fix_test.md)
- [Reporte de Requerimientos](./docs/requirements_report.md)
- [Walkthrough de Funcionalidades](./docs/walkthrough.md)

---

## 🐛 Troubleshooting

### El backend no inicia
```bash
# Verificar que PostgreSQL esté corriendo
# Verificar las credenciales en .env
# Regenerar Prisma Client
npx prisma generate
```

### Error de CORS en frontend
```bash
# Asegúrate de que FRONTEND_URL en backend .env coincida con tu URL de frontend
FRONTEND_URL="http://localhost:5173"
```

### Error "Module not found"
```bash
# Limpiar cache y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Prisma Client desactualizado
```bash
# Después de cambiar schema.prisma
npx prisma generate
npx prisma migrate dev
```

---

## 🛠️ Tecnologías y Librerías

### Backend Dependencies
- `@nestjs/common`, `@nestjs/core` - Framework base
- `@nestjs/jwt`, `@nestjs/passport` - Autenticación
- `@prisma/client` - ORM
- `bcrypt` - Hash de contraseñas
- `class-validator`, `class-transformer` - Validación
- `date-fns` - Manejo de fechas

### Frontend Dependencies
- `react`, `react-dom` - UI Framework
- `react-router-dom` - Routing
- `@tanstack/react-query` - Data fetching
- `zustand` - State management
- `axios` - HTTP client
- `lucide-react` - Iconos
- `tailwindcss` - Estilos
- `date-fns` - Manejo de fechas

---

## 👥 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: Amazing Feature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es privado y confidencial.

---

## 📞 Soporte

Para consultas o soporte:
- Revisar documentación en carpeta `docs/`
- Ver ejemplos de código en módulos existentes
- Consultar documentación de Swagger en `/api`

---

## 🎯 Roadmap

### Futuras Mejoras
- [ ] Notificaciones en tiempo real (WebSockets)
- [ ] Integración con pasarelas de pago (Stripe, MercadoPago)
- [ ] Sistema de lealtad y puntos
- [ ] App móvil con React Native
- [ ] Dashboard avanzado con gráficas (Chart.js, Recharts)
- [ ] Exportación de reportes a Excel/PDF
- [ ] Sistema de mensajería interna
- [ ] Multi-sucursales

---

**¡Delicias Jurásicas - Donde la tradición se encuentra con la tecnología! 🦖🍰**
