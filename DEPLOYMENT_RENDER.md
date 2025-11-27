# 🚀 GUÍA DE DEPLOYMENT EN RENDER.COM

## 📋 Tabla de Contenidos
1. [Preparación del Código](#1-preparación-del-código)
2. [Crear Cuenta en Render](#2-crear-cuenta-en-render)
3. [Crear Base de Datos PostgreSQL](#3-crear-base-de-datos-postgresql)
4. [Desplegar Backend (API)](#4-desplegar-backend-api)
5. [Configurar Variables de Entorno](#5-configurar-variables-de-entorno)
6. [Ejecutar Migraciones](#6-ejecutar-migraciones)
7. [Verificar Deployment](#7-verificar-deployment)
8. [Configurar Cloudinary](#8-configurar-cloudinary-opcional)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. Preparación del Código

### ✅ Verificar que tienes estos archivos:

- `render.yaml` ✓ (Ya creado)
- `.env.production.example` ✓ (Ya creado)
- `package.json` con scripts de build ✓
- `Dockerfile` (opcional, pero recomendado) ✓

### ✅ Subir código a GitHub

```bash
# Si aún no has inicializado Git:
git init
git add .
git commit -m "Initial commit - Delicias Jurásicas"

# Crear repositorio en GitHub y conectar:
git remote add origin https://github.com/TU-USUARIO/delicias-jurasicas.git
git branch -M main
git push -u origin main
```

### ✅ Verificar package.json

Asegúrate de que tienes estos scripts:

```json
{
  "scripts": {
    "build": "nest build",
    "start:prod": "node dist/main",
    "prisma:migrate:deploy": "prisma migrate deploy"
  }
}
```

---

## 2. Crear Cuenta en Render

### Paso 1: Registro

1. Ve a [render.com](https://render.com)
2. Click en **"Get Started"**
3. Registrarse con:
   - GitHub (Recomendado) ✓
   - GitLab
   - Email

> **💡 Consejo**: Usa GitHub para permitir deployments automáticos

### Paso 2: Autorizar Render en GitHub

1. Render te pedirá acceso a tus repositorios
2. Selecciona **"All repositories"** o solo el repo de Delicias Jurásicas
3. Click **"Install & Authorize"**

---

## 3. Crear Base de Datos PostgreSQL

### Método A: Usando Blueprint (Recomendado)

1. En Render Dashboard, click **"New +"** → **"Blueprint"**
2. Conecta tu repositorio de GitHub
3. Render detectará automáticamente `render.yaml`
4. Click **"Apply"**
5. ¡Listo! Render creará automáticamente:
   - Base de datos PostgreSQL
   - Web Service (Backend)

### Método B: Manual (Si prefieres hacerlo paso a paso)

#### 3.1. Crear Base de Datos

1. En Render Dashboard, click **"New +"** → **"PostgreSQL"**
2. Configura:
   - **Name**: `delicias-db`
   - **Database**: `delicias_jurasicas`
   - **User**: `delicias_user` (automático)
   - **Region**: Oregon (Free Tier disponible)
   - **Plan**: **Free**
3. Click **"Create Database"**

#### 3.2. Obtener Connection String

Una vez creada, Render te mostrará:

**Internal Database URL** (Usar esta para el backend):
```
postgresql://delicias_user:XXXXXXXXXXXX@dpg-xxxxx-xxx.oregon-postgres.render.com/delicias_jurasicas
```

**External Database URL** (Solo para conectarte desde tu PC con Prisma Studio):
```
postgresql://delicias_user:XXXXXXXXXXXX@dpg-xxxxx-xxx.oregon-postgres.render.com/delicias_jurasicas?ssl=true
```

> ⚠️ **IMPORTANTE**: Guarda estas URLs en un lugar seguro. Las necesitarás para configurar el backend.

---

## 4. Desplegar Backend (API)

### Paso 1: Crear Web Service

1. En Render Dashboard, click **"New +"** → **"Web Service"**
2. Conecta tu repositorio de GitHub
3. Selecciona el repo: `delicias-jurasicas`

### Paso 2: Configurar el Servicio

Completa el formulario con estos valores:

| Campo | Valor |
|-------|-------|
| **Name** | `delicias-jurasicas-api` |
| **Region** | Oregon |
| **Branch** | `main` |
| **Runtime** | Node |
| **Build Command** | `npm install && npx prisma generate && npm run build` |
| **Start Command** | `npm run start:prod` |
| **Plan** | Free |

### Paso 3: Variables de Entorno Avanzadas

Expande **"Advanced"** y agrega:

**Auto-Deploy**: ✓ Yes (para deployments automáticos en cada push)

**Health Check Path**: `/api/v1/products/featured`

---

## 5. Configurar Variables de Entorno

### Variables Obligatorias

En la sección **"Environment Variables"**, agrega estas variables:

#### 1. DATABASE_URL

- **Key**: `DATABASE_URL`
- **Value**: Pega la **Internal Database URL** que copiaste antes
  
Ejemplo:
```
postgresql://delicias_user:XXXXXXXXXXX@dpg-xxxxx.oregon-postgres.render.com/delicias_jurasicas
```

#### 2. JWT_SECRET

- **Key**: `JWT_SECRET`
- **Value**: Genera un secreto fuerte

**Generar JWT_SECRET seguro**:

```bash
# Opción 1: PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | % {[char]$_})

# Opción 2: Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Opción 3: Sitio web
# https://randomkeygen.com/ (CodeIgniter Encryption Keys)
```

Ejemplo de resultado:
```
a8f5f167f44f4964e6c998dee827110c03e9a89e7d5f8e1c5d5c8a6f9b3d4e2f1a7b8c9d0e1f2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8
```

#### 3. NODE_ENV

- **Key**: `NODE_ENV`
- **Value**: `production`

#### 4. JWT_EXPIRES_IN

- **Key**: `JWT_EXPIRES_IN`
- **Value**: `7d`

#### 5. PORT

- **Key**: `PORT`
- **Value**: `3000`

> **Nota**: Render usa automáticamente el PORT correcto, pero es bueno especificarlo.

### Variables Opcionales (Agregar después)

#### CORS / Frontend

- **Key**: `FRONTEND_URL`
- **Value**: `https://tu-app.vercel.app` (Obtendrás esta URL después de desplegar en Vercel)

#### Cloudinary (Para imágenes)

Si vas a usar Cloudinary, agregar:

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

Ver sección [8. Configurar Cloudinary](#8-configurar-cloudinary-opcional)

### Guardar y Desplegar

1. Click **"Create Web Service"**
2. Render comenzará el deployment automáticamente
3. Verás los logs en tiempo real

---

## 6. Ejecutar Migraciones

### Opción A: Desde el Shell de Render (Recomendado)

1. Ve a tu servicio en Render Dashboard
2. Click en la pestaña **"Shell"**
3. Ejecuta:

```bash
# Ejecutar migraciones
npx prisma migrate deploy

# Ejecutar seed (datos iniciales)
npx prisma db seed

# Verificar que funciona
npx prisma studio
```

### Opción B: Desde tu PC (Alternativa)

Si configuraste la **External Database URL**:

```bash
# En tu .env local, usa la External URL
DATABASE_URL="postgresql://delicias_user:XXX@dpg-xxxxx.oregon-postgres.render.com/delicias_jurasicas?ssl=true"

# Ejecutar migraciones
npx prisma migrate deploy

# Seed
npx prisma db seed
```

### Opción C: Build Hook (Automático)

Puedes agregar esto en el **Build Command** de Render:

```bash
npm install && npx prisma generate && npm run build && npx prisma migrate deploy
```

> ⚠️ **Cuidado**: Esto ejecutará migraciones en CADA deployment. Solo usar si estás seguro.

---

## 7. Verificar Deployment

### 7.1. Verificar que el Servicio Está Corriendo

1. En Render Dashboard, ve a tu servicio
2. Espera a que el status sea **"Live"** (verde)
3. Copia la URL de tu servicio:

```
https://delicias-jurasicas-api.onrender.com
```

### 7.2. Probar Endpoints

#### Opción 1: Navegador

Abre en tu navegador:

```
https://delicias-jurasicas-api.onrender.com/api/v1/products/featured
```

Deberías ver una respuesta JSON (aunque puede estar vacía si no ejecutaste el seed).

#### Opción 2: PowerShell

```powershell
# Test simple
curl https://delicias-jurasicas-api.onrender.com/api/v1/products/featured

# Test de login
$body = @{
    email = "admin@deliciasjurasicas.com"
    password = "Admin123!"
} | ConvertTo-Json

Invoke-RestMethod `
    -Uri "https://delicias-jurasicas-api.onrender.com/api/v1/auth/login" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"
```

#### Opción 3: Swagger Docs

```
https://delicias-jurasicas-api.onrender.com/api/docs
```

Si ves la documentación Swagger, ¡todo funciona! 🎉

---

## 8. Configurar Cloudinary (Opcional)

### 8.1. Crear Cuenta en Cloudinary

1. Ve a [cloudinary.com](https://cloudinary.com)
2. Click **"Sign Up Free"**
3. Completa el registro

### 8.2. Obtener Credenciales

1. Ve al [Dashboard de Cloudinary](https://cloudinary.com/console)
2. Copia:
   - **Cloud Name**: (ej: `dx5xxxx`)
   - **API Key**: (ej: `123456789012345`)
   - **API Secret**: Click en mostrar y copia

### 8.3. Agregar Variables en Render

Vuelve a Render → Tu servicio → **Environment**

Agregar:

```
STORAGE_TYPE=cloudinary
CLOUDINARY_CLOUD_NAME=tu-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=tu-api-secret
```

Click **"Save Changes"** → Render hará redeploy automático

---

## 9. Troubleshooting

### ❌ Error: "Cannot find module '@nestjs/core'"

**Causa**: Dependencias no instaladas correctamente

**Solución**:
1. Verifica que `package.json` tenga todas las dependencias
2. Asegúrate de que el Build Command incluya `npm install`
3. En Render, ve a **Settings** → **Clear build cache & deploy**

### ❌ Error: "Prisma Client not generated"

**Causa**: Prisma Client no se generó durante el build

**Solución**:
Actualiza Build Command a:
```bash
npm install && npx prisma generate && npm run build
```

### ❌ Error: "Can't reach database server"

**Causa**: DATABASE_URL incorrecta o base de datos no creada

**Solución**:
1. Verifica que DATABASE_URL es la **Internal** URL (no la External)
2. Verifica que la base de datos está en estado "Available"
3. Verifica que DATABASE_URL no tiene espacios ni caracteres extra

### ❌ Error: "Port already in use"

**Causa**: Render usa su propio PORT

**Solución**:
En `main.ts`, asegúrate de tener:
```typescript
const port = process.env.PORT || 3000;
```

### ❌ El servicio se queda "Building" por mucho tiempo

**Causa**: Build muy pesado o dependencias grandes

**Solución**:
1. Verifica los logs en tiempo real
2. El primer build puede tardar 5-10 minutos en Free Tier
3. Si tarda más de 15 min, cancela y vuelve a intentar

### ❌ "Application error" o 503

**Causa**: La aplicación crasheó al iniciar

**Solución**:
1. Ve a **Logs** en Render
2. Busca el error específico
3. Errores comunes:
   - Falta DATABASE_URL
   - JWT_SECRET no definido
   - Puerto configurado incorrectamente

### ❌ CORS Error desde Frontend

**Causa**: Frontend no está en la lista de orígenes permitidos

**Solución**:
1. Agrega variable de entorno: `FRONTEND_URL=https://tu-app.vercel.app`
2. Verifica que `main.ts` tenga la configuración CORS actualizada
3. Redeploy

---

## 📊 Checklist Final

- [ ] ✅ Código subido a GitHub
- [ ] ✅ Base de datos PostgreSQL creada en Render
- [ ] ✅ Web Service creado y configurado
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ DATABASE_URL conectada
- [ ] ✅ JWT_SECRET generado y configurado
- [ ] ✅ Migraciones ejecutadas
- [ ] ✅ Seed ejecutado (datos iniciales)
- [ ] ✅ Deployment exitoso (status "Live")
- [ ] ✅ Endpoint `/api/v1/products/featured` responde
- [ ] ✅ Swagger Docs accesible
- [ ] ✅ Login funciona correctamente
- [ ] ✅ Cloudinary configurado (opcional)
- [ ] ✅ FRONTEND_URL configurado (después de Vercel)

---

## 🎯 Siguientes Pasos

1. ✅ **Backend Deployado** ← Acabas de completar esto
2. ⬜ **Crear Frontend en React** con Vite
3. ⬜ **Desplegar Frontend en Vercel**
4. ⬜ **Conectar Frontend con Backend**
5. ⬜ **Probar flujo completo** (login, crear producto, orden de producción)

---

## 📞 Recursos Útiles

- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com
- **Prisma + Render**: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-render
- **NestJS Deployment**: https://docs.nestjs.com/deployment

---

## 💡 Tips de Free Tier

### Limitaciones del Free Tier de Render:

- ⏱️ **Auto-sleep**: El servicio se duerme después de 15 min de inactividad
- 🚀 **Cold Start**: Primera request después de dormir tarda ~30 segundos
- 💾 **RAM**: 512 MB (suficiente para este proyecto)
- 🗄️ **PostgreSQL**: 90 días de retención
- 📦 **Build**: Max 10 min

### Cómo Mantener el Servicio Activo:

**Opción 1: Cron Job Externo**
- Usar [cron-job.org](https://cron-job.org) (gratis)
- Configurar ping cada 14 minutos a tu API

**Opción 2: UptimeRobot**
- [uptimerobot.com](https://uptimerobot.com)
- Monitorear y hacer ping automático

**Opción 3: Upgrade a Paid Plan** ($7/mes)
- Sin auto-sleep
- Más RAM
- Respuestas más rápidas

---

**¡Tu backend está listo para producción! 🦖🍰**
