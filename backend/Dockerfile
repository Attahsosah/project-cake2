FROM php:8.1-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    sqlite3 \
    libsqlite3-dev \
    curl \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install SQLite extension for PHP
RUN docker-php-ext-install pdo_sqlite

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set working directory
WORKDIR /app

# Copy composer files
COPY composer.json composer.lock ./

# Install dependencies
RUN composer install --no-dev --optimize-autoloader

# Copy application files
COPY . .

# Expose port
EXPOSE $PORT

# Make startup script executable
RUN chmod +x start.sh

# Start the application with debugging
CMD ["./start.sh"]
