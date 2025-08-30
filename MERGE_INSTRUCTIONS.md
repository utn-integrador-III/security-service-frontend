# 🔄 INSTRUCCIONES PARA MERGE DE RAMAS

## ⚠️ IMPORTANTE - ORDEN DE MERGE OBLIGATORIO

**Seguir este orden exacto para evitar conflictos:**

---

## 📋 ORDEN DE RAMAS A MERGEAR

```bash
1. US-F22  ← Mergear PRIMERO
2. US-F26
3. US-F28
4. US-F29
5. US-F30
6. US-F31
7. US-F32
8. US-F33
9. US-F34
10. US-F35
11. US-F27 ← ⭐ MERGEAR AL FINAL (MAS IMPORTANTE) ⭐
```

---

## 🚨 REGLA CRÍTICA: PRIORIDAD US-F27

### ❗ EN CASO DE CONFLICTOS:

- **SIEMPRE respetar los cambios de US-F27**
- **NO sobrescribir código de US-F27**
- **US-F27 tiene PRIORIDAD ABSOLUTA**

### 🔥 CAMBIOS CRÍTICOS EN US-F27:

1. **✅ Tailwind CSS v3.4.16** - Configuración fija
2. **✅ UserRegistration** - Rework completo con glassmorphism
3. **✅ Navigation** - Rutas corregidas
4. **✅ PostCSS** - Configuración bloqueada
5. **✅ package.json** - Versiones exactas sin ^
6. **✅ Scripts** - install-safe y verify-tailwind

---

## 🛠️ PASOS PARA MERGE

### Para cada rama (US-F22 → US-F35):

```bash
# 1. Cambiar a dev
git checkout dev
git pull origin dev

# 2. Mergear rama
git merge origin/US-F22  # (ejemplo con US-F22)

# 3. Resolver conflictos SI HAY
# 4. Commit y push
git push origin dev
```

### Para US-F27 (FINAL):

```bash
# 1. Cambiar a dev
git checkout dev
git pull origin dev

# 2. ⚠️ Mergear US-F27 (PRIORIDAD ABSOLUTA)
git merge origin/US-F27

# 3. ❗ EN CONFLICTOS: SIEMPRE ACEPTAR US-F27
#    - Accept incoming (US-F27)
#    - NO sobrescribir cambios de US-F27

# 4. Push final
git push origin dev
```

---

## 🎯 VALIDACIÓN FINAL

Después del merge de US-F27, verificar:

```bash
# 1. Instalar dependencias
npm run install-safe

# 2. Verificar Tailwind
npm run verify-tailwind

# 3. Probar aplicación
npm run dev
```

---

## 📞 CONTACTO

**Si hay problemas con el merge de US-F27, contactar inmediatamente al desarrollador responsable.**

**⭐ US-F27 es la rama más importante del proyecto ⭐**
