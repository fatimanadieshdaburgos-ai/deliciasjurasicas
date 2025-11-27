# 🏗️ ARQUITECTURA NESTJS - DELICIAS JURÁSICAS

## 📦 Módulos Principales

### 1. **CoreModule** (Transversal)
- `PrismaService`: Conexión PostgreSQL
- `ConfigModule`: Variables de entorno
- `LoggerService`: Sistema de logs
- Exception filters y validation pipes globales

### 2. **AuthModule** (Seguridad)
- `AuthService`: Login/logout, JWT
- `JwtStrategy`: Validación de tokens
- `RolesGuard`: Control de acceso RBAC
- `AuditInterceptor`: Registro automático en AuditLog

**Endpoints**:
- `POST /auth/register`
- `POST /auth/login`
- `GET /auth/me`

### 3. **UsersModule**
- CRUD de usuarios
- Gestión de roles y perfiles

### 4. **ProductsModule** (Catálogo)
- `ProductsService`: CRUD productos/insumos
- `CategoriesService`: Gestión de categorías
- `FileUploadService`: Subida de imágenes

**Endpoints**:
- `GET /products` - Listar (filtros: categoría, activos)
- `POST /products` - Crear
- `POST /products/:id/images` - Subir imagen

### 5. **RecipesModule** (BOM)
Gestión de recetas (Bill of Materials).

**Validación crítica**:
```typescript
// Solo permitir ingredientes de tipo INSUMO
async createRecipe(data: CreateRecipeDto) {
  const ingredients = await this.prisma.product.findMany({
    where: { 
      id: { in: data.ingredients.map(i => i.ingredientId) },
      type: 'INSUMO'
    }
  });
  
  if (ingredients.length !== data.ingredients.length) {
    throw new BadRequestException('Ingredientes inválidos');
  }
  // ...crear receta
}
```

### 6. **ProductionModule** (Manufactura)
Órdenes de producción con descuento automático de insumos.

**Lógica de completar orden**:
```typescript
async completeProductionOrder(orderId: string) {
  return this.prisma.$transaction(async (tx) => {
    // 1. Descontar insumos según receta
    for (const ingredient of recipe.ingredients) {
      const qty = ingredient.quantity * order.quantity;
      await tx.product.update({
        where: { id: ingredient.ingredientId },
        data: { currentStock: { decrement: qty } }
      });
      
      // Registrar movimiento PRODUCCION_SALIDA
      await tx.stockMovement.create({ /* ... */ });
    }
    
    // 2. Incrementar producto terminado
    await tx.product.update({
      where: { id: order.productId },
      data: { currentStock: { increment: order.quantity } }
    });
    
    // 3. Marcar orden como completada
    await tx.productionOrder.update({
      where: { id: orderId },
      data: { status: 'COMPLETADO', completedAt: new Date() }
    });
  });
}
```

### 7. **InventoryModule**
- Control de stock y alertas
- Historial de movimientos
- Ajustes manuales

**Endpoints**:
- `GET /inventory/stock` - Estado actual
- `GET /inventory/low-stock` - Alertas
- `GET /inventory/movements` - Historial

### 8. **PromotionsModule**
Sistema flexible de promociones (%, 2x1, cupones).

**Validación de cupón**:
```typescript
async validatePromotion(code: string, orderTotal: number) {
  const promo = await this.findActiveByCode(code);
  
  // Validar fechas
  const now = new Date();
  if (now < promo.startDate || now > promo.endDate) {
    throw new BadRequestException('Cupón expirado');
  }
  
  // Validar montos
  if (promo.minPurchase && orderTotal < promo.minPurchase) {
    throw new BadRequestException(`Mínimo: $${promo.minPurchase}`);
  }
  
  // Calcular descuento
  let discount = promo.type === 'PERCENTAGE' 
    ? orderTotal * (promo.discountValue / 100)
    : promo.discountValue;
    
  if (promo.maxDiscount) discount = Math.min(discount, promo.maxDiscount);
  
  return { discount, promotion: promo };
}
```

### 9. **OrdersModule** (Ventas)
Procesamiento de pedidos online y POS.

**Estados del pedido**:
```
PENDING → PAID → IN_PRODUCTION → READY → IN_TRANSIT → DELIVERED → COMPLETED
```

**Endpoints**:
- `POST /orders` - Crear
- `PATCH /orders/:id/status` - Cambiar estado
- `POST /orders/:id/pay` - Registrar pago

### 10. **CartModule**
Carrito persistente para e-commerce.

**Endpoints**:
- `POST /cart/items` - Agregar producto
- `POST /cart/checkout` - Convertir a orden

### 11. **DeliveryModule**
- Asignación de repartidores
- Tracking de entregas
- Evidencia fotográfica

### 12. **CashBoxModule** (Tesorería)
Control de arqueo de caja.

**Lógica de cierre**:
```typescript
async closeCashBox(cashBoxId: string, actualAmount: number) {
  const cashBox = await this.findWithRelations(cashBoxId);
  
  // Calcular esperado
  const salesTotal = sum(cashBox.orders, 'total');
  const transactionsTotal = sum(cashBox.transactions, 'amount');
  const expectedAmount = cashBox.openingAmount + salesTotal + transactionsTotal;
  
  return this.prisma.cashBox.update({
    where: { id: cashBoxId },
    data: {
      status: 'CLOSED',
      actualAmount,
      expectedAmount,
      difference: actualAmount - expectedAmount,
      closedAt: new Date()
    }
  });
}
```

### 13. **ReportsModule** (Analytics)
- Ventas por período
- Productos más vendidos
- Utilidad bruta (ventas - costo insumos)
- Mermas y desperdicios

**Reporte de top products**:
```typescript
async getTopProducts(startDate: Date, endDate: Date) {
  return this.prisma.orderItem.groupBy({
    by: ['productId'],
    where: {
      order: {
        createdAt: { gte: startDate, lte: endDate },
        status: { in: ['COMPLETED', 'DELIVERED'] }
      }
    },
    _sum: { quantity: true, total: true },
    orderBy: { _sum: { total: 'desc' } },
    take: 10
  });
}
```

### 14. **SettingsModule** (CMS)
- Configuración dinámica
- Banners promocionales
- Variables del sistema (tax_rate, free_shipping_threshold)

---

## 🔐 Seguridad y Guards

### RolesGuard
```typescript
@Post('products')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN, UserRole.PANADERO)
async createProduct(@Body() data: CreateProductDto) {
  return this.productsService.create(data);
}
```

### AuditInterceptor
Registra automáticamente todas las acciones en `AuditLog`:
- Usuario
- Acción (CREATE, UPDATE, DELETE)
- Tabla afectada
- Datos anteriores/nuevos (JSON)
- IP y User-Agent

---

## 📂 Estructura de Carpetas

```
delicias-jurasicas/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── core/
│   ├── auth/
│   ├── users/
│   ├── products/
│   ├── recipes/
│   ├── production/
│   ├── inventory/
│   ├── promotions/
│   ├── orders/
│   ├── cart/
│   ├── delivery/
│   ├── cash-box/
│   ├── reports/
│   ├── settings/
│   ├── file-storage/
│   └── notifications/
├── prisma/
│   └── schema.prisma
├── uploads/
└── .env
```

---

## 🔧 Variables de Entorno

```env
DATABASE_URL="postgresql://user:password@localhost:5432/delicias_jurasicas"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
STORAGE_TYPE="local"
SMTP_HOST="smtp.gmail.com"
REDIS_HOST="localhost"
```
