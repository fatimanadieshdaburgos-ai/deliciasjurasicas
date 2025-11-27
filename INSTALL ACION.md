# 🚀 GUÍA DE INSTALACIÓN - DELICIAS JURÁSICAS

## ⚠️ IMPORTANTE: Node.js Requerido

Este proyecto requiere **Node.js 18+** y **npm**. 

### Verificar si Node.js está instalado

Abrir PowerShell y ejecutar:
```powershell
node --version
npm --version
```

Si no están instalados, descargar Node.js desde: https://nodejs.org/

---

## 📋 Pasos de Instalación

### 1️⃣ Instalar Dependencias

```powershell
cd c:\Users\edwin\Desktop\DJ
npm install
```

Esto instalará todas las dependencias del proyecto definidas en `package.json`.

### 2️⃣ Configurar Base de Datos

**Opción A: PostgreSQL Local**

1. Instalar PostgreSQL 15+ desde: https://www.postgresql.org/download/windows/
2. Crear base de datos:
   ```sql
   CREATE DATABASE delicias_jurasicas;
   ```
3. Copiar `.env.example` a `.env`:
   ```powershell
   copy .env.example .env
   ```
4. Editar `.env` y configurar:
   ```
   DATABASE_URL="postgresql://postgres:TuPassword@localhost:5432/delicias_jurasicas"
   ```

**Opción B: Docker (Recomendado)**

```powershell
# Crear contenedor PostgreSQL
docker run --name delicias-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=delicias_jurasicas -p 5432:5432 -d postgres:15

# En .env usar:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/delicias_jurasicas"
```

### 3️⃣ Generar Prisma Client

```powershell
npx prisma generate
```

### 4️⃣ Ejecutar Migraciones

```powershell
npx prisma migrate dev --name init
```

Este comando:
- Crea las tablas en la base de datos
- Aplica el schema de Prisma
- Genera los tipos TypeScript

### 5️⃣ Poblar Base de Datos (Seed)

```powershell
npx prisma db seed
```

Esto creará:
- ✅ 4 usuarios de prueba
- ✅ 2 categorías
- ✅ 4 insumos
- ✅ 2 productos terminados
- ✅ 1 receta completa
- ✅ 2 promociones
- ✅ Configuraciones iniciales

### 6️⃣ Iniciar Servidor

```powershell
npm run start:dev
```

El servidor iniciará en: **http://localhost:3000**

---

## ✅ Verificar Instalación

### Método 1: Navegador
1. Abrir: http://localhost:3000/api/docs
2. Deberías ver la documentación Swagger

### Método 2: PowerShell
```powershell
curl http://localhost:3000/api/v1/products/featured
```

### Método 3: Prisma Studio
```powershell
npx prisma studio
```
- Abre en: http://localhost:5555
- Interfaz visual para ver los datos

---

## 🔑 Probar Login

### Con PowerShell:
```powershell
$body = @{
    email = "admin@deliciasjurasicas.com"
    password = "Admin123!"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/login" -Method POST -Body $body -ContentType "application/json"

$response
```

### Con Swagger Docs:
1. Ir a: http://localhost:3000/api/docs
2. Expandir `Auth` → `POST /auth/login`
3. Click en "Try it out"
4. Usar credenciales:
   ```json
   {
     "email": "admin@deliciasjurasicas.com",
     "password": "Admin123!"
   }
   ```
5. Copiar el `accessToken` de la respuesta
6. Click en "Authorize" (arriba a la derecha)
7. Pegar token: `Bearer <tu-token>`

---

## 🐛 Solución de Problemas

### Error: "Cannot find module '@nestjs/core'"
```powershell
npm install
```

### Error: "Prisma Client not generated"
```powershell
npx prisma generate
```

### Error: "Can't reach database server"
- Verificar que PostgreSQL esté corriendo
- Verificar DATABASE_URL en .env
- Verificar que el puerto 5432 no esté bloqueado

### Error: "Port 3000 is already in use"
Cambiar puerto en `.env`:
```
PORT=3001
```

### Error de compilación TypeScript
```powershell
npm run build
```

---

## 📊 Comandos Útiles

```powershell
# Ver logs de desarrollo
npm run start:dev

# Compilar para producción
npm run build

# Iniciar en producción
npm run start:prod

# Ver estructura de BD
npx prisma studio

# Resetear BD (⚠️ BORRA TODO)
npx prisma migrate reset

# Ver estado de migraciones
npx prisma migrate status

# Formatear código
npm run format

# Ejecutar tests
npm run test
```

---

## 🎯 Siguientes Pasos

1. ✅ Explorar Swagger Docs: http://localhost:3000/api/docs
2. ✅ Revisar Prisma Studio: `npx prisma studio`
3. ✅ Probar endpoints de autenticación
4. ✅ Crear un producto nuevo
5. ✅ Crear una receta
6. ✅ Iniciar una orden de producción
7. ✅ Completar producción (ver cómo descuenta insumos)

---

## 📞 Soporte

Si encuentras problemas:
1. Revisar logs en la consola
2. Verificar DATABASE_URL
3. Verificar que todas las dependencias estén instaladas
4. Revisar la documentación en `/api/docs`

---

**¡Feliz codificación! 🦖🍰**
