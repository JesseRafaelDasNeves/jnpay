FROM php:8.5-fpm

# Instalar dependências do sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    wget \
    unzip \
    zip \
    postgresql-client \
    libpq-dev \
    nodejs \
    npm \
    && rm -rf /var/lib/apt/lists/*

# Instalar extensões PHP necessárias
RUN docker-php-ext-configure pgsql -with-pgsql=/usr/local/pgsql \
    && docker-php-ext-install pdo pdo_pgsql pgsql

# Instalar Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos do projeto
COPY . .

# Instalar dependências PHP
RUN composer install --no-dev --optimize-autoloader

# Instalar dependências Node.js e compilar assets
RUN npm install && npm run build

# Criar arquivo .env a partir do .env.example se não existir
RUN cp .env.example .env || true

# Gerar chave da aplicação
RUN php artisan key:generate --force

# Limpar cache e otimizar
RUN php artisan config:cache && \
    php artisan route:cache && \
    php artisan view:cache

# Permissões para storage e bootstrap
RUN chown -R www-data:www-data /app/storage /app/bootstrap /app/public

EXPOSE 8000

CMD ["php-fpm"]
