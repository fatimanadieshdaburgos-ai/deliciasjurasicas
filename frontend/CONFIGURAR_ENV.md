# 🚀 GUÍA RÁPIDA - VER EN LOCAL

## ✅ PASOS COMPLETADOS

1. ✅ **Backend corregido** - tsconfig.json excluye carpeta frontend
2. ✅ **Backend corriendo** - http://localhost:3000
3. ≈ **Frontend necesita configuración**

---

## 📝 CONFIGURAR ARCHIVO `.env` DEL FRONTEND

El archivo `.env` está protegido por gitignore, así que necesitas crearlo manualmente:

### Opción A: Desde PowerShell (Recomendado)

```powershell
# Desde la carpeta frontend
cd c:\Users\edwin\Desktop\DJ\frontend

# Crear archivo .env
echo "VITE_API_URL=http://localhost:3000/api/v1" > .env
```

### Opción B: Desde VS Code

1. Abre VS Code en la carpeta `frontend/`
2. Crea un nuevo archivo llamado `.env`
3. Pega este contenido:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

4. Guarda el archivo

---

## 🎯 DESPUÉS DE CREAR EL `.env`

### 1. Reinicia el servidor de desarrollo del frontend

```powershell
# Presiona Ctrl+C para detener el servidor actual
# Luego ejecuta:
npm run dev
```

### 2. Abre tu navegador en:

**http://localhost:5173**

---

## ✨ CÓMO PROBAR QUE FUNCIONA

### Opción 1: Ver productos
1. Ve a http://localhost:5173
2. Click en "Tienda" en el menú
3. Deberías ver productos (si ejecutaste el seed)

### Opción 2: Hacer login
1. Ve a http://localhost:5173/login
2. Usa estas credenciales de prueba:
   - **Email**: `admin@deliciasjurasicas.com`
   - **Password**: `Admin123!`
3. Te llevará al dashboard

### Opción 3: Ver API directamente
- Swagger: http://localhost:3000/api/docs
- Productos: http://localhost:3000/api/v1/products/featured

---

## ⚠️ SI AÚN NO EJECUT ASTE EL SEED

Si el backend no tiene datos de prueba, ejecuta:

```powershell
cd c:\Users\edwin\Desktop\DJ

# Ejecutar seed
npx prisma db seed
```

---

## 📊 CHECKLIST FINAL

- [x] Backend corriendo (puerto 3000)
- [x] Frontend instalado (npm install)
- [ ] Archivo `.env` creado en `frontend/`
- [ ] Frontend reiniciado después de crear `.env`
- [ ] Navegador abierto en http://localhost:5173

**Una vez que crees el `.env`, todo debería funcionar perfectamente!** 🎉
