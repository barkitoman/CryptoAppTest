#!/bin/bash

# Script para reiniciar Expo y ver logs correctamente

echo "🔄 Deteniendo todas las instancias de Expo..."
killall -9 node 2>/dev/null || true
sleep 2

echo "✅ Limpiando puerto 8081..."
lsof -ti:8081 | xargs kill -9 2>/dev/null || true
sleep 1

echo "📂 Cambiando al directorio correcto..."
cd /Users/julianenriquebarcocastro/Desktop/CryptoApp

echo "🚀 Iniciando Expo..."
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Los logs aparecerán aquí abajo"
echo "  Busca los emojis: 🔄 📡 ✅ ❌"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

npx expo start --clear
