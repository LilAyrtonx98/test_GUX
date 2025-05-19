#!/bin/bash

set -e

echo "⏳ Esperando a que MySQL esté disponible en $DB_HOST:$DB_PORT..."
until nc -z "$DB_HOST" "$DB_PORT"; do
  echo "🔄 Esperando conexión con MySQL..."
  sleep 2
done

echo "✅ MySQL disponible, ejecutando setup de Laravel..."

# Instala dependencias solo si no están ya instaladas
if [ ! -d "vendor" ]; then
  composer install --no-interaction --prefer-dist --optimize-autoloader
fi

# Configura entorno Laravel
php artisan config:clear
php artisan optimize:clear
php artisan migrate --force

echo "🚀 Iniciando servidor Laravel en http://localhost:8000"
exec php artisan serve --host=0.0.0.0 --port=8000
