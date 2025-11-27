# 🚀 GUÍA PASO A PASO - DEPLOYMENT EN RENDER

## 📋 ANTES DE EMPEZAR

### ✅ Checklist Previo:
- [x] Código backend subido a GitHub
- [x] Archivo `render.yaml` en la raíz del proyecto
- [x] `package.json` con scripts correctos
- [ ] Cuenta en Render.com (vamos a crearla)

---

## PASO 1: CREAR CUENTA EN RENDER 🆕

### 1.1 Registrarse

1. Abre tu navegador y ve a: **https://render.com**
2. Click en **"Get Started for Free"**
3. Selecciona **"Sign up with GitHub"** (RECOMENDADO)
   - Esto permitirá deployments automáticos
   - También puedes usar email, pero GitHub es más fácil

### 1.2 Autorizar Render en GitHub

1. GitHub te pedirá autorizar Render
2. Selecciona:
   - ✅ **"All repositories"** (si confías en Render)
   - ✅ O solo el repositorio de Delicias Jurásicas
3. Click **"Install & Authorize"**
4. Te redirigirá al dashboard de Render

**✅ CHECKPOINT**: Deberías ver el dashboard de Render vacío

---

## PASO 2: CREAR BASE DE DATOS POSTGRESQL 🗄️

### 2.1 Iniciar Creación

1. En el dashboard de Render, click en el botón **"New +"** (arriba a la derecha)
2. Selecciona **"PostgreSQL"**

### 2.2 Configurar la Base de Datos

Completa el formulario con estos valores:

| Campo | Valor | Notas |
|-------|-------|-------|
| **Name** | `delicias-db` | Nombre interno, puedes cambiarlo |
| **Database** | `delicias_jurasicas` | Nombre de la BD |
| **User** | `delicias_user` | Se genera automáticamente |
| **Region** | **Oregon (US West)** | Importante: Tiene Free Tier |
| **PostgreSQL Version** | 16 (o la más reciente) | |
| **Datadog API Key** | (dejar vacío) | No necesario |
| **Plan** | **Free** | ⚠️ IMPORTANTE: Seleccionar Free |

### 2.3 Crear la Base de Datos

1. Scroll hacia abajo
2. Click **"Create Database"**
3. Render comenzará a crear la BD (tarda 1-2 minutos)

### 2.4 Copiar Connection Strings

Una vez creada, verás la información de conexión:

**📋 COPIAR ESTAS URLs** (las necesitarás después):

#### A. Internal Database URL (Para el backend)
```
postgresql://delicias_user:XXXXXXXXXX@dpg-XXXXX-a.oregon-postgres.render.com/delicias_jurasicas
```

#### B. External Database URL (Para conectarte desde tu PC)
```
postgresql://delicias_user:XXXXXXXXXX@dpg-XXXXX-a.oregon-postgres.render.com/delicias_jurasicas
```

> ⚠️ **IMPORTANTE**: 
> - Guárdalas en un lugar seguro (Notepad, etc.)
> - NO las compartas públicamente
> - Usarás la **Internal** para el backend

**✅ CHECKPOINT**: Deberías tener:
- Base de datos en estado "Available" (verde)
- Internal Database URL copiada

---

## PASO 3: CREAR WEB SERVICE (BACKEND) 🌐

### 3.1 Iniciar Creación del Servicio

1. En el dashboard, click **"New +"** nuevamente
2. Selecciona **"Web Service"**

### 3.2 Conectar Repositorio

1. Render mostrará tus repositorios de GitHub
2. Busca tu repositorio: **delicias-jurasicas**
3. Click **"Connect"**

> Si no ves tu repositorio:
> - Click "Configure account" para dar acceso a más repos
> - O verifica que autorizaste Render en GitHub

### 3.3 Configurar el Servicio

Completa el formulario:

| Campo | Valor EXACTO | Explicación |
|-------|--------------|-------------|
| **Name** | `delicias-jurasicas-api` | URL será: `delicias-jurasicas-api.onrender.com` |
| **Region** | **Oregon (US West)** | Misma región que la BD |
| **Branch** | `main` | O `master` si usas ese nombre |
| **Root Directory** | (dejar vacío) | Solo si tu código está en subcarpeta |
| **Runtime** | **Node** | Render lo detecta automáticamente |
| **Build Command** | Ver abajo ⬇️ | Crítico |
| **Start Command** | Ver abajo ⬇️ | Crítico |

#### 🔧 Build Command (Copiar exactamente):
```bash
npm install && npx prisma generate && npm run build
```

**¿Qué hace?**
1. `npm install` - Instala dependencias
2. `npx prisma generate` - Genera Prisma Client
3. `npm run build` - Compila TypeScript a JavaScript

#### 🔧 Start Command (Copiar exactamente):
```bash
npm run start:prod
```

**¿Qué hace?**
- Ejecuta `node dist/main` (tu app compilada)

### 3.4 Seleccionar Plan

| Campo | Valor |
|-------|-------|
| **Instance Type** | **Free** |

> ⚠️ Free Tier incluye:
> - 512 MB RAM
> - Shared CPU
> - Auto-sleep después de 15 min sin uso
> - Apto para desarrollo/portafolio

### 3.5 Opciones Avanzadas

Click en **"Advanced"** para expandir:

#### Auto-Deploy
- ✅ **Yes** - Deploy automático cuando hagas push a GitHub

#### Health Check Path (Opcional pero recomendado)
```
/api/v1/products/featured
```

Esto permite a Render verificar que tu app está funcionando.

### 3.6 NO CREAR TODAVÍA

⚠️ **IMPORTANTE**: NO hagas click en "Create Web Service" aún.

Primero vamos a configurar las **`variables de entorno** (siguiente paso).

---

## PASO 4: CONFIGURAR VARIABLES DE ENTORNO 🔐

### 4.1 Expandir Sección de Environment

En la misma página de configuración, scroll hacia abajo hasta **"Environment Variables"**.

### 4.2 Agregar Variables Obligatorias

Click en **"Add Environment Variable"** para cada una:

#### Variable 1: DATABASE_URL

| Key | Value |
|-----|-------|
| `DATABASE_URL` | Pega aquí la **Internal Database URL** que copiaste en el Paso 2 |

Ejemplo:
```
postgresql://delicias_user:XXX@dpg-XXX.oregon-postgres.render.com/delicias_jurasicas
```

#### Variable 2: JWT_SECRET

Necesitas generar un secreto fuerte y único.

**Opción A - PowerShell**:
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | % {[char]$_})
```

**Opción B - Node.js**:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Opción C - Online**:
https://randomkeygen.com/ → Copiar "CodeIgniter Encryption Keys"

Resultado (ejemplo):
```
a8f5f167f44f4964e6c998dee827110c03e9a89e7d5f8e1c5d5c8a6f9b3d4e2f
```

| Key | Value |
|-----|-------|
| `JWT_SECRET` | Pega aquí el secreto generado |

⚠️ **CRÍTICO**: 
- Debe ser **diferente** al de desarrollo
- Mínimo 32 caracteres
- Nunca compartirlo

#### Variable 3: NODE_ENV

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |

#### Variable 4: JWT_EXPIRES_IN

| Key | Value |
|-----|-------|
| `JWT_EXPIRES_IN` | `7d` |

#### Variable 5: PORT

| Key | Value |
|-----|-------|
| `PORT` | `3000` |

> Nota: Render usa su propio puerto internamente, pero es bueno especificarlo.

### 4.3 Variables Opcionales (Agregar después)

Estas las agregarás cuando tengas el frontend deployado:

| Key | Value | ¿Cuándo? |
|-----|-------|----------|
| `FRONTEND_URL` | `https://tu-app.vercel.app` | Después de deploy en Vercel |
| `CLOUDINARY_*` | Credenciales | Si usas Cloudinary para imágenes |

### 4.4 Verificar Variables

Deberías tener configuradas:
- ✅ DATABASE_URL
- ✅ JWT_SECRET
- ✅ NODE_ENV
- ✅ JWT_EXPIRES_IN
- ✅ PORT

**✅ CHECKPOINT**: 5 variables de entorno configuradas

---

## PASO 5: CREAR EL SERVICIO 🎯

### 5.1 Revisar Configuración

Antes de crear, verifica:
- ✅ Build Command: `npm install && npx prisma generate && npm run build`
- ✅ Start Command: `npm run start:prod`
- ✅ Plan: Free
- ✅ 5 variables de entorno configuradas
- ✅ Auto-Deploy: Yes

### 5.2 Crear

1. Scroll hasta arriba
2. Click **"Create Web Service"**
3. Render comenzará el deployment automáticamente

### 5.3 Monitorear el Build

Serás redirigido a la página de tu servicio donde verás:

**Logs en Tiempo Real**:
```
==> Cloning from https://github.com/TU-USUARIO/delicias-jurasicas...
==> Downloading cache...
==> Running 'npm install && npx prisma generate && npm run build'
...
==> Build successful!
==> Starting service...
╔═══════════════════════════════════════════════════════╗
║     🦖 DELICIAS JURÁSICAS API 🍰                      ║
╚═══════════════════════════════════════════════════════╝
```

**Duración estimada**: 5-10 minutos (el primer build es más lento)

### 5.4 Esperar a "Live"

El status cambiará de:
- ⏳ "Building" → 🔨 "Deploying" → ✅ **"Live"** (verde)

Cuando veas **"Live"**, tu API está online! 🎉

**✅ CHECKPOINT**: Servicio en estado "Live" (verde)

---

## PASO 6: OBTENER URL DE TU API 🌍

### 6.1 Copiar URL

En la parte superior de la página del servicio verás:

```
https://delicias-jurasicas-api.onrender.com
```

📋 **COPIA ESTA URL** - Es la URL pública de tu API

### 6.2 Verificar que Funciona

Abre en tu navegador:

```
https://delicias-jurasicas-api.onrender.com/api/v1/products/featured
```

Deberías ver:
- **Si ejecutaste seed**: JSON con productos
- **Si NO ejecutaste seed**: `[]` (array vacío) o error de "no data"

Ambas respuestas son válidas - significa que tu API está funcionando!

### 6.3 Verificar Swagger

Abre:
```
https://delicias-jurasicas-api.onrender.com/api/docs
```

Deberías ver la documentación Swagger de tu API 📚

**✅ CHECKPOINT**: API responde correctamente

---

## PASO 7: EJECUTAR MIGRACIONES Y SEED 🛠️

### 7.1 Abrir Shell de Render

1. En la página de tu servicio en Render
2. Click en la pestaña **"Shell"** (al lado de "Logs")
3. Espera a que cargue la terminal interactiva

### 7.2 Ejecutar Migraciones

En el shell, escribe:

```bash
npx prisma migrate deploy
```

Presiona Enter. Deberías ver:
```
✓ Generated Prisma Client
✓ Applying migrations...
  ✓ 20231123_init (1 table created)
All migrations have been successfully applied.
```

### 7.3 Ejecutar Seed (Datos Iniciales)

```bash
npx prisma db seed
```

Deberías ver:
```
🌱 Iniciando seed...
👥 Creando usuarios...
✅ Usuarios creados
📂 Creando categorías...
✅ Categorías creadas
...
🎉 Seed completado exitosamente!
```

### 7.4 Verificar Datos

Ahora intenta nuevamente:

```
https://delicias-jurasicas-api.onrender.com/api/v1/products/featured
```

Deberías ver productos reales! 🍰

**✅ CHECKPOINT**: Base de datos poblada con datos iniciales

---

## PASO 8: PROBAR LA API 🧪

### 8.1 Test de Login

Desde PowerShell en tu PC:

```powershell
$API_URL = "https://delicias-jurasicas-api.onrender.com"

$body = @{
    email = "admin@deliciasjurasicas.com"
    password = "Admin123!"
} | ConvertTo-Json

$response = Invoke-RestMethod `
    -Uri "$API_URL/api/v1/auth/login" `
    -Method POST `
    -Body $body `
    -ContentType "application/json"

# Ver token
$response.accessToken
```

Deberías obtener un token JWT 🎟️

### 8.2 Test de Endpoint Protegido

```powershell
$token = $response.accessToken

$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-RestMethod `
    -Uri "$API_URL/api/v1/users" `
    -Method GET `
    -Headers $headers
```

Deberías ver la lista de usuarios 👥

**✅ CHECKPOINT**: Autenticación funcionando correctamente

---

## 🎉 ¡BACKEND DEPLOYADO EXITOSAMENTE!

### 📊 Resumen de lo que tienes:

- ✅ Base de datos PostgreSQL en Render
- ✅ Backend NestJS deployado
- ✅ API accesible públicamente
- ✅ Swagger Docs funcionando
- ✅ Autenticación JWT operativa
- ✅ Datos iniciales cargados

### 🌐 URLs Importantes

Guarda estas URLs:

| Servicio | URL |
|----------|-----|
| **API Base** | `https://tu-servicio.onrender.com/api/v1` |
| **Swagger Docs** | `https://tu-servicio.onrender.com/api/docs` |
| **Health Check** | `https://tu-servicio.onrender.com/api/v1/products/featured` |

---

## 🔄 DEPLOYMENTS AUTOMÁTICOS

De ahora en adelante, cada vez que hagas:

```bash
git push origin main
```

Render automáticamente:
1. Detectará el cambio
2. Hará build nuevo
3. Deployará la nueva versión
4. ¡Sin hacer nada más!

---

## ⏱️ NOTA IMPORTANTE: AUTO-SLEEP

El Free Tier de Render tiene una limitación:

- ⏰ Después de **15 minutos sin requests**, el servicio se "duerme"
- 🥶 La primera request después de dormir tarda **~30 segundos** (cold start)
- 🔥 Después de eso, funciona normal

**Soluciones**:

1. **UptimeRobot** (Gratis): Hace ping cada 5 minutos
   - https://uptimerobot.com
   - Crear monitor HTTP
   - URL: Tu health check endpoint

2. **Upgrade a Paid** ($7/mes):
   - Sin auto-sleep
   - Más RAM  
   - Más rápido

Para desarrollo/portafolio, el Free Tier está perfecto!

---

## 🐛 TROUBLESHOOTING

### Build Falla

**Error**: `Cannot find module '@nestjs/core'`

**Solución**:
1. Verifica que `package.json` tiene todas las dependencias
2. En Render: Settings → "Clear build cache & deploy"

### No Conecta a la Base de Datos

**Error**: `Can't reach database server`

**Solución**:
1. Verifica que DATABASE_URL es la **Internal** URL
2. Verifica que ambos (BD y servicio) están en la **misma región** (Oregon)

### CORS Error (más adelante con frontend)

**Solución**:
1. Agregar variable: `FRONTEND_URL=https://tu-app.vercel.app`
2. Redeploy

---

## 📈 SIGUIENTES PASOS

1. ✅ **Backend Deployado** ← ACABAS DE COMPLETAR ESTO!
2. ⬜ **Crear Frontend React + Vite**
3. ⬜ **Conectar Frontend con este Backend**
4. ⬜ **Desplegar Frontend en Vercel**
5. ⬜ **Configurar CORS para producción**
6. ⬜ **Probar flujo completo**

---

**¡Felicidades! Tu backend está en producción! 🦖🍰**

Ahora vamos a crear el frontend...
