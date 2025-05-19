FROM php:8.2-fpm

# Instalar dependencias del sistema y netcat
RUN apt-get update && apt-get install -y \
    git \
    curl \
    zip \
    unzip \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    netcat-openbsd \
    && docker-php-ext-install pdo_mysql mbstring zip

# Instalar Composer desde otra imagen
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Establecer el directorio de trabajo
WORKDIR /var/www/html

# Copiar archivos del proyecto
COPY . .

# Instalar dependencias PHP
RUN composer install --no-interaction --prefer-dist --optimize-autoloader

# Copiar el entrypoint y darle permisos de ejecución
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Entrypoint: espera a MySQL y luego arranca Laravel
ENTRYPOINT ["/entrypoint.sh"]

# Comando por defecto: levantar Laravel
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
