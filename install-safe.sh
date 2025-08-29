#!/bin/bash
# SCRIPT DE INSTALACIÓN SEGURA - VERSIONES FIJAS DE TAILWIND
# Ejecutar con: npm run install-safe

echo "🚀 INSTALANDO DEPENDENCIAS CON VERSIONES FIJAS..."
echo "================================================"

# Limpiar instalaciones previas
echo "🧹 Limpiando instalaciones previas..."
rm -rf node_modules
rm -f package-lock.json

# Instalar versiones exactas de Tailwind ecosystem
echo "📦 Instalando versiones EXACTAS de Tailwind CSS..."
npm install --save-dev tailwindcss@3.4.16 postcss@8.5.6 autoprefixer@10.4.21

# Instalar el resto de dependencias
echo "📦 Instalando dependencias restantes..."
npm install

# Verificar instalación
echo "✅ Verificando configuración..."
if [ -f "node_modules/tailwindcss/package.json" ]; then
    VERSION=$(cat node_modules/tailwindcss/package.json | grep '"version"' | head -1 | sed 's/.*"version": "\(.*\)".*/\1/')
    echo "✅ Tailwind CSS instalado: v$VERSION"
    
    if [ "$VERSION" = "3.4.16" ]; then
        echo "✅ ¡Versión correcta instalada!"
    else
        echo "❌ Versión incorrecta. Esperada: 3.4.16, Instalada: $VERSION"
        exit 1
    fi
else
    echo "❌ Tailwind CSS no instalado correctamente"
    exit 1
fi

echo ""
echo "🎉 INSTALACIÓN COMPLETADA CON VERSIONES CORRECTAS ✅"
echo "================================================"
echo "Ahora puedes ejecutar: npm run dev"
