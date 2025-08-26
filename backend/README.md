# Project Cake Backend API

## Setup Instructions

### 1. Database Setup
First, make sure you have MySQL running and create the database:

```bash
mysql -u root -p < database.sql
```

Or manually create the database and run the SQL commands in `database.sql`.

### 2. Install Dependencies
The project uses Composer for dependency management. Install dependencies:

```bash
composer install
```

### 3. Start the Development Server
Run the PHP development server:

```bash
php -S localhost:8000
```

Or use the provided server script:

```bash
php server.php
```

### 4. API Endpoints

#### Register User
- **URL**: `POST /api/register`
- **Body**: 
  ```json
  {
    "username": "example_user",
    "email": "user@example.com",
    "password": "password123"
  }
  ```

#### Login User
- **URL**: `POST /api/login`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### 5. Environment Configuration
Make sure your MySQL credentials in `config/database.php` match your local setup.

The API will be available at `http://localhost:8000/api/`
