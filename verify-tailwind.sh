#!/bin/bash
# SCRIPT DE VERIFICACIÓN TAILWIND CSS
# Ejecutar con: npm run verify-tailwind

echo "🔍 VERIFICANDO CONFIGURACIÓN TAILWIND CSS..."
echo "================================================"

# Verificar archivos críticos
echo "📁 Verificando archivos de configuración..."

if [ -f "tailwind.config.js" ]; then
    echo "✅ tailwind.config.js - ENCONTRADO"
else
    echo "❌ tailwind.config.js - FALTANTE"
    exit 1
fi

if [ -f "postcss.config.cjs" ]; then
    echo "✅ postcss.config.cjs - ENCONTRADO"
else
    echo "❌ postcss.config.cjs - FALTANTE"
    exit 1
fi

if [ -f "src/index.css" ]; then
    echo "✅ src/index.css - ENCONTRADO"
else
    echo "❌ src/index.css - FALTANTE"
    exit 1
fi

# Verificar imports de Tailwind en index.css
echo ""
echo "🎨 Verificando imports de Tailwind en index.css..."

if grep -q "@tailwind base" src/index.css; then
    echo "✅ @tailwind base - ENCONTRADO"
else
    echo "❌ @tailwind base - FALTANTE"
    exit 1
fi

if grep -q "@tailwind components" src/index.css; then
    echo "✅ @tailwind components - ENCONTRADO"
else
    echo "❌ @tailwind components - FALTANTE"
    exit 1
fi

if grep -q "@tailwind utilities" src/index.css; then
    echo "✅ @tailwind utilities - ENCONTRADO"
else
    echo "❌ @tailwind utilities - FALTANTE"
    exit 1
fi

# Verificar colores personalizados en config
echo ""
echo "🌈 Verificando colores personalizados..."

if grep -q "turquesa.*21665f" tailwind.config.js; then
    echo "✅ Color turquesa (#21665f) - CONFIGURADO"
else
    echo "❌ Color turquesa - FALTANTE O INCORRECTO"
    exit 1
fi

if grep -q "turquesa-dark.*1a524c" tailwind.config.js; then
    echo "✅ Color turquesa-dark (#1a524c) - CONFIGURADO"
else
    echo "❌ Color turquesa-dark - FALTANTE O INCORRECTO"
    exit 1
fi

# Verificar dependencias en package.json
echo ""
echo "📦 Verificando dependencias..."

if grep -q "tailwindcss.*3.4.16" package.json; then
    echo "✅ Tailwind CSS v3.4.16 - CONFIGURADO"
else
    echo "⚠️  Tailwind CSS - Versión diferente o faltante"
fi

if grep -q "postcss" package.json; then
    echo "✅ PostCSS - ENCONTRADO"
else
    echo "❌ PostCSS - FALTANTE"
    exit 1
fi

if grep -q "autoprefixer" package.json; then
    echo "✅ Autoprefixer - ENCONTRADO"
else
    echo "❌ Autoprefixer - FALTANTE"
    exit 1
fi

echo ""
echo "🎉 VERIFICACIÓN COMPLETADA - CONFIGURACIÓN CORRECTA ✅"
echo "================================================"
echo "La configuración de Tailwind CSS está lista y funcional."
