# 🚀 COMANDOS DE INICIO RÁPIDO

## ⚡ Instalación Rápida (Ejecutar en orden)

### 1. Verificar Node.js
```powershell
node --version
# Debe ser v18 o superior
```

Si no está instalado: https://nodejs.org/

### 2. Instalar todas las dependencias
```powershell
cd c:\Users\edwin\Desktop\DJ
npm install
```

Esto puede tardar varios minutos la primera vez.

### 3. Configurar base de datos

**Opción A - Docker (Más fácil):**
```powershell
docker run --name delicias-db `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_DB=delicias_jurasicas `
  -p 5432:5432 `
  -d postgres:15
```

**Opción B - PostgreSQL Local:**
1. Install PostgreSQL 15+
2. Crear base de datos:
```sql
CREATE DATABASE delicias_jurasicas;
```

### 4. Crear archivo .env
```powershell
copy .env.example .env
```

Editar `.env` y verificar:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/delicias_jurasicas"
JWT_SECRET="cambiar-este-secreto-en-produccion"
```

### 5. Generar Prisma Client
```powershell
npx prisma generate
```

### 6. Ejecutar migraciones (crear tablas)
```powershell
npx prisma migrate dev --name init
```

### 7. Poblar base de datos con datos iniciales
```powershell
npx prisma db seed
```

### 8. Iniciar servidor de desarrollo
```powershell
npm run start:dev
```

### ✅ Verificar que funciona

Abrir navegador en:
- **Swagger Docs**: http://localhost:3000/api/docs
- **API Base**: http://localhost:3000/api/v1

---

## 🧪 Probar la API

### Método 1: Swagger UI (Recomendado)

1. Ir a: http://localhost:3000/api/docs
2. Probar endpoint GET `/products/featured`
3. Hacer login:
   - Expandir `POST /auth/login`
   - Click "Try it out"
   - Body:
   ```json
   {
     "email": "admin@delicious urasicas.com",
     "password": "Admin123!"
   }
   ```
   - Click "Execute"
   - Copiar el `accessToken`
   - Click "Authorize" (candado arriba a la derecha)
   - Pegar: `Bearer [tu-token]`

### Método 2: PowerShell

```powershell
# Test simple
curl http://localhost:3000/api/v1/products/featured

# Login
$body = @{
    email = "admin@deliciasjurasicas.com"
    password = "Admin123!"
} | ConvertTo-Json

$response = Invoke-RestMethod `
    -Uri "http://localhost:3000/api/v1/auth/login" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"

# Ver token
$response.accessToken

# Guardar token
$token = $response.accessToken

# Hacer request autenticado
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-RestMethod `
    -Uri "http://localhost:3000/api/v1/users" `
    -Method GET `
    -Headers $headers
```

### Método 3: Prisma Studio (Ver base de datos)

```powershell
npx prisma studio
```

Abre en: http://localhost:5555

---

## 📊 Usuarios de Prueba

| Rol | Email | Password |
|-----|-------|----------|
| Admin | admin@deliciasjurasicas.com | Admin123! |
| Panadero | panadero@deliciasjurasicas.com | Panadero123! |
| Vendedor | vendedor@deliciasjurasicas.com | Vendedor123! |
| Cliente | cliente@example.com | Cliente123! |

---

## 🔧 Comandos Útiles

### Desarrollo
```powershell
# Iniciar con hot-reload
npm run start:dev

# Ver logs de compilación
npm run build

# Formatear código
npm run format
```

### Prisma
```powershell
# Ver datos en interfaz visual
npx prisma studio

# Crear nueva migración
npx prisma migrate dev

# Ver estado de migraciones
npx prisma migrate status

# Resetear BD (⚠️ BORRA TODO)
npx prisma migrate reset

# Re-ejecutar seed
npx prisma db seed
```

### Testing
```powershell
# Tests unitarios
npm run test

# Tests con coverage
npm run test:cov

# Tests E2E
npm run test:e2e
```

### Producción
```powershell
# Compilar
npm run build

# Ejecutar compilado
npm run start:prod
```

### Docker
```powershell
# Levantar todo (BD + API + Prisma Studio)
docker-compose up -d

# Ver logs
docker-compose logs -f api

# Detener todo
docker-compose down

# Detener y borrar volúmenes
docker-compose down -v
```

---

## ⚠️ Solución de Problemas

### "Cannot find module '@nestjs/core'"
```powershell
rm -r node_modules
rm package-lock.json
npm install
```

### "Prisma Client not generated"
```powershell
npx prisma generate
```

### "Can't reach database server"
1. Verificar que PostgreSQL esté corriendo:
```powershell
# Si usas Docker:
docker ps | findstr delicias-db

# Si no aparece, iniciar:
docker start delicias-db
```

2. Verificar DATABASE_URL en `.env`

### "Port 3000 already in use"
Cambiar puerto en `.env`:
```
PORT=3001
```

### Error de compilación
```powershell
# Limpiar y recompilar
rm -r dist
npm run build
```

---

## 📁 Estructura de Archivos Creados

```
c:/Users/edwin/Desktop/DJ/
├── 📄 Documentación
│   ├── README_PROYECTO.md
│   ├── INSTALACION.md
│   ├── ARQUITECTURA_NESTJS.md
│   ├── FLUJO_VENTA_ONLINE.md
│   ├── RELACIONES_SCHEMA.md
│   └── PROYECTO_COMPLETADO.md
│
├── ⚙️ Configuración
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   ├── .env
│   ├── .gitignore
│   ├── docker-compose.yml
│   └── Dockerfile
│
├── 🗄️ Prisma
│   ├── schema.prisma     (25 modelos)
│   └── seed.ts           (datos iniciales)
│
└── 💻 Código (src/)
    ├── main.ts
    ├── app.module.ts
    ├── core/             (Prisma)
    ├── auth/             (JWT, RBAC, Auditoría)
    ├── users/
    ├── products/
    ├── categories/
    ├── recipes/          (BOM)
    ├── production/       (Manufactura)
    ├── inventory/
    ├── promotions/
    ├── cart/
    ├── orders/
    ├── delivery/
    ├── cash-box/
    ├── reports/
    └── settings/
```

---

## 🎯 Flujo de Prueba Completo

### 1. Login como Admin
```
POST /auth/login
{
  "email": "admin@deliciasjurasicas.com",
  "password": "Admin123!"
}
```

### 2. Ver productos
```
GET /products
```

### 3. Ver receta del Pastel T-Rex
```
GET /recipes
```

### 4. Crear orden de producción
```
POST /production/orders
{
  "productId": "[id-del-pastel-trex]",
  "quantity": 2,
  "scheduledDate": "2025-11-24T10:00:00Z"
}
```

### 5. Completar producción (descontará insumos)
```
PATCH /production/orders/[id]/complete
```

### 6. Verificar movimientos de inventario
```
GET /inventory/movements
```

### 7. Ver stock actualizado
```
GET /inventory/stock
```

---

## ✅ Checklist de Verificación

- [ ] Node.js instalado (v18+)
- [ ] PostgreSQL corriendo (Docker o local)
- [ ] Dependencias instaladas (`npm install`)
- [ ] Archivo `.env` configurado
- [ ] Prisma Client generado
- [ ] Migraciones ejecutadas
- [ ] Seed ejecutado
- [ ] Servidor iniciado sin errores
- [ ] Swagger accesible en http://localhost:3000/api/docs
- [ ] Login funciona
- [ ] Endpoints protegidos requieren token
- [ ] Prisma Studio funciona

---

## 🎓 Próximos Pasos

1. ✅ Familiarizarse con Swagger Docs
2. ✅ Explorar Prisma Studio
3. ✅ Probar flujo de producción
4. ✅ Revisar código generado
5. ⬜ Crear frontend (React/Vue/Angular)
6. ⬜ Implementar upload de imágenes
7. ⬜ Integrar pasarela de pagos
8. ⬜ Deploy en producción

---

**¡El proyecto está listo para usar! 🦖🍰**
