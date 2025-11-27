# ⚡ COMANDOS RÁPIDOS - DEPLOYMENT

## 📤 SUBIR A GITHUB

```powershell
# Inicializar Git (si no lo has hecho)
git init

# Agregar todos los archivos
git add .

# Commit
git commit -m "feat: Preparado para producción con Render.com"

# Crear repositorio en GitHub y conectar
git remote add origin https://github.com/TU-USUARIO/delicias-jurasicas.git

# Subir
git branch -M main
git push -u origin main
```

---

## 🔐 GENERAR JWT_SECRET SEGURO

### Opción 1: PowerShell
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | % {[char]$_})
```

### Opción 2: Node.js
```powershell
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Opción 3: Online
https://randomkeygen.com/ (Usar "CodeIgniter Encryption Keys")

---

## 🗄️ COMANDOS DE PRISMA EN RENDER

### Desde el Shell de Render:

```bash
# Ver migraciones pendientes
npx prisma migrate status

# Ejecutar migraciones
npx prisma migrate deploy

# Ejecutar seed
npx prisma db seed

# Abrir Prisma Studio (para explorar datos)
npx prisma studio

# Generar Prisma Client (si es necesario)
npx prisma generate
```

---

## 🧪 PROBAR LA API DEPLOYADA

### Desde PowerShell:

```powershell
# Reemplaza TU-SERVICIO por el nombre de tu servicio en Render
$API_URL = "https://TU-SERVICIO.onrender.com"

# Test simple
curl "$API_URL/api/v1/products/featured"

# Test de login
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

# Guardar token para requests autenticados
$token = $response.accessToken

# Request autenticado
$headers = @{
    "Authorization" = "Bearer $token"
}

Invoke-RestMethod `
    -Uri "$API_URL/api/v1/users" `
    -Method GET `
    -Headers $headers
```

---

## 🔄 REDEPLOY

### Automático (Push a GitHub):
```bash
git add .
git commit -m "feat: nueva funcionalidad"
git push
# Render redeploy automáticamente
```

### Manual (Desde Render Dashboard):
1. Ir a tu servicio
2. Click "Manual Deploy" → "Deploy latest commit"

---

## 📊 MONITOREAR SERVICIO

### Ver Logs en Tiempo Real:
1. Ir a Render Dashboard
2. Seleccionar tu servicio
3. Tab "Logs"

### Shell Interactivo:
1. Tab "Shell"
2. Ejecutar comandos directamente

---

## 🐛 TROUBLESHOOTING RÁPIDO

### Build falla:
```bash
# Limpiar cache y redeploy
# Desde Dashboard: Settings → "Clear build cache & deploy"
```

### No conecta a BD:
```powershell
# Verificar desde tu PC con External DB URL
$env:DATABASE_URL="postgresql://user:pass@host/db?ssl=true"
npx prisma studio
```

### CORS Error:
```powershell
# Agregar variable en Render:
# FRONTEND_URL=https://tu-app.vercel.app
# Luego redeploy
```

---

## 📝 VARIABLES DE ENTORNO EN RENDER

### Agregar Variable:
1. Dashboard → Tu servicio → "Environment"
2. Add Environment Variable
3. Key: `NOMBRE_VARIABLE`
4. Value: `valor`
5. Save Changes (auto-redeploy)

### Editar Variable:
1. Click en el lápiz
2. Modificar valor
3. Save (auto-redeploy)

---

## 🚀 CONECTAR CON FRONTEND (Después)

Una vez deployado el frontend en Vercel:

### 1. Obtener URL de Vercel:
```
https://tu-app.vercel.app
```

### 2. Agregar en Render:
```
FRONTEND_URL=https://tu-app.vercel.app
```

### 3. Verificar CORS:
El código en `main.ts` ya está configurado para aceptar `.vercel.app`

---

## 📦 CLOUDINARY (Opcional)

### Configurar:
1. Crear cuenta en [cloudinary.com](https://cloudinary.com)
2. Dashboard → Copiar credenciales
3. Agregar en Render:
   ```
   STORAGE_TYPE=cloudinary
   CLOUDINARY_CLOUD_NAME=tu-cloud-name
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=tu-secret
   ```

---

## ⏱️ MANTENER SERVICIO ACTIVO (Evitar Auto-Sleep)

### Opción 1: UptimeRobot
1. Ir a [uptimerobot.com](https://uptimerobot.com)
2. Crear cuenta gratuita
3. Add New Monitor:
   - Monitor Type: HTTP(s)
   - URL: `https://tu-servicio.onrender.com/api/v1/products/featured`
   - Monitoring Interval: 5 minutes
4. Save

### Opción 2: Cron-Job.org
1. Ir a [cron-job.org](https://cron-job.org)
2. Crear cuenta
3. Create cronjob:
   - URL: `https://tu-servicio.onrender.com/api/v1/products/featured`
   - Every: 14 minutes

---

## 🔍 VERIFICAR HEALTH CHECK

```powershell
curl https://tu-servicio.onrender.com/api/v1/products/featured
```

Debería retornar:
- Status 200
- JSON con productos (o array vacío si no hay seed)

---

## 📈 NEXT STEPS

```
1. ✅ Código preparado
2. ⬜ Push a GitHub
3. ⬜ Crear DB en Render
4. ⬜ Deploy backend
5. ⬜ Ejecutar migraciones
6. ⬜ Verificar API funciona
7. ⬜ Crear frontend React
8. ⬜ Deploy en Vercel
9. ⬜ Conectar frontend-backend
```

---

**¡Todo listo para producción! 🦖🍰**
