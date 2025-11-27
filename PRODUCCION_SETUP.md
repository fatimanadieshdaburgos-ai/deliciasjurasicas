# 📝 RESUMEN DE CONFIGURACIÓN PARA PRODUCCIÓN

## ✅ ARCHIVOS CREADOS/ACTUALIZADOS

### 1. `src/main.ts` ⭐ ACTUALIZADO
**Cambio: Configuración CORS para Producción**

```typescript
// Ahora permite:
- ✅ localhost (desarrollo)
- ✅ Cualquier dominio .vercel.app (tu frontend)
- ✅ URL específica en FRONTEND_URL (variable de entorno)
- ✅ Requests sin origin (Postman, apps móviles)
```

**En desarrollo**: Acepta cualquier origen
**En producción**: Solo orígenes autorizados

### 2. `.env.production.example` ⭐ NUEVO
Plantilla con todas las variables de entorno necesarias para Render.

**Variables obligatorias**:
- `DATABASE_URL` - Render te la da automáticamente
- `JWT_SECRET` - Generar uno seguro
- `NODE_ENV=production`
- `JWT_EXPIRES_IN=7d`

**Variables opcionales**:
- `FRONTEND_URL` - URL de Vercel (agregar después)
- `CLOUDINARY_*` - Credenciales para imágenes

### 3. `render.yaml` ⭐ NUEVO
**Blueprint para deployment automático**

Cuando conectes tu repo a Render, este archivo le dirá cómo construir y desplegar:
- Base de datos PostgreSQL (Free)
- Web Service de Node.js (Free)
- Variables de entorno automáticas

### 4. `DEPLOYMENT_RENDER.md` ⭐ NUEVO
**Guía completa paso a paso** con:
- Cómo crear cuenta en Render
- Cómo crear base de datos PostgreSQL
- Cómo desplegar el backend
- Variables de entorno a configurar
- Troubleshooting completo

---

## 🚀 PASOS PARA DESPLEGAR (RESUMEN)

### Paso 1: Preparar Código ✅ (Ya hecho)
```bash
git add .
git commit -m "Preparado para producción con Render"
git push origin main
```

### Paso 2: Crear Base de Datos en Render
1. Ir a [render.com](https://render.com) y registrarse
2. New + → PostgreSQL
3. Nombre: `delicias-db`
4. Plan: **Free**
5. Copiar **Internal Database URL**

### Paso 3: Desplegar Backend
1. New + → Web Service
2. Conectar repositorio GitHub
3. Build Command:
   ```
   npm install && npx prisma generate && npm run build
   ```
4. Start Command:
   ```
   npm run start:prod
   ```

### Paso 4: Configurar Variables de Entorno

**Obligatorias**:
```bash
DATABASE_URL=postgresql://delicias_user:XXXX@dpg-xxx.oregon-postgres.render.com/delicias_jurasicas
JWT_SECRET=<generar-uno-seguro>
NODE_ENV=production
JWT_EXPIRES_IN=7d
PORT=3000
```

**Generar JWT_SECRET seguro**:
```powershell
# PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | % {[char]$_})

# O en Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Paso 5: Ejecutar Migraciones
Desde el Shell de Render:
```bash
npx prisma migrate deploy
npx prisma db seed
```

### Paso 6: Verificar
```
https://tu-servicio.onrender.com/api/v1/products/featured
https://tu-servicio.onrender.com/api/docs
```

---

## 📋 CHECKLIST DE DEPLOYMENT

- [ ] Código subido a GitHub
- [ ] Base de datos PostgreSQL creada
- [ ] Internal Database URL copiada
- [ ] Web Service creado y configurado
- [ ] Variables de entorno configuradas:
  - [ ] DATABASE_URL
  - [ ] JWT_SECRET (generado seguro)
  - [ ] NODE_ENV=production
  - [ ] JWT_EXPIRES_IN=7d
- [ ] Build exitoso (ver logs)
- [ ] Deployment en estado "Live"
- [ ] Migraciones ejecutadas
- [ ] Seed ejecutado
- [ ] Health check passing

**Verificación**:
- [ ] `/api/v1/products/featured` responde
- [ ] `/api/docs` carga Swagger
- [ ] Login funciona

---

## 🔧 VARIABLES DE ENTORNO - REFERENCIA RÁPIDA

| Variable | Ejemplo | Obligatoria | Descripción |
|----------|---------|-------------|-------------|
| `DATABASE_URL` | `postgresql://user:pass@host/db` | ✅ Sí | Render la genera |
| `JWT_SECRET` | `abc123...xyz789` (64+ chars) | ✅ Sí | Generar seguro |
| `NODE_ENV` | `production` | ✅ Sí | Modo producción |
| `JWT_EXPIRES_IN` | `7d` | ✅ Sí | Expiración del token |
| `PORT` | `3000` | ✅ Sí | Puerto (Render lo usa) |
| `FRONTEND_URL` | `https://tu-app.vercel.app` | ⚠️ Después | Para CORS |
| `CLOUDINARY_*` | - | ❌ Opcional | Para imágenes |

---

## 🎯 SIGUIENTES PASOS

1. ✅ **Código preparado para producción** ← COMPLETADO
2. ⬜ **Subir a GitHub**
3. ⬜ **Crear cuenta en Render**
4. ⬜ **Crear PostgreSQL en Render**
5. ⬜ **Desplegar Backend**
6. ⬜ **Ejecutar migraciones**
7. ⬜ **Verificar que funciona**
8. ⬜ **Crear frontend (React + Vite)**
9. ⬜ **Desplegar en Vercel**
10. ⬜ **Conectar frontend con backend**

---

## 📚 DOCUMENTACIÓN

- **Guía Completa**: `DEPLOYMENT_RENDER.md`
- **Variables de Ejemplo**: `.env.production.example`
- **Blueprint de Render**: `render.yaml`

---

## ⚠️ IMPORTANTE

### Limitaciones del Free Tier:
- **Auto-sleep** después de 15 min de inactividad
- **Cold start** de ~30 segundos en la primera request
- **PostgreSQL** se elimina después de 90 días sin uso

### Solución:
- Usar [UptimeRobot](https://uptimerobot.com) para hacer ping cada 14 min
- O usar [cron-job.org](https://cron-job.org) gratis

---

## 🆘 AYUDA RÁPIDA

### Si el build falla:
```bash
# Verificar package.json tiene:
"scripts": {
  "build": "nest build",
  "start:prod": "node dist/main"
}
```

### Si no conecta a la BD:
- Verificar que DATABASE_URL es la **Internal** URL
- No usar la External URL para el backend

### Si hay error de CORS:
- Esperar a tener la URL de Vercel
- Agregar `FRONTEND_URL=https://tu-app.vercel.app`
- Redeploy

---

**¡Todo listo para deploy! 🚀**

Siguiente paso: Sube tu código a GitHub y sigue la guía de `DEPLOYMENT_RENDER.md`
