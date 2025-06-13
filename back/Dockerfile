# Usamos la imagen oficial de PHP con FPM y extensiones necesarias
FROM php:8.3-fpm

# Instalamos dependencias del sistema
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    git \
    curl \
    && docker-php-ext-configure gd \
    && docker-php-ext-install gd pdo pdo_mysql

# Instalamos Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Establecemos el directorio de trabajo
WORKDIR /var/www

# Copiamos los archivos del proyecto al contenedor
COPY . .

# Establecemos la configuración de PHP-FPM
RUN sed -i 's|listen = 127.0.0.1:9000|listen = 0.0.0.0:9000|' /usr/local/etc/php-fpm.d/www.conf

# Instalamos las dependencias de Laravel
RUN composer install --no-dev --optimize-autoloader

# Establecemos los permisos adecuados
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Exponemos el puerto 9000 (usado por PHP-FPM)
EXPOSE 9000

# Comando de inicio
CMD ["php-fpm"]