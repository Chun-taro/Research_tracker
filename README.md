# Research Tracker (Multi-Tenant Architecture)

This is a comprehensive multi-tenant research tracking application rebuilt with Laravel 12, Inertia.js, and React. It features a central Landlord system to manage isolated Department (Tenant) databases, handles multi-role workflows (Student, Adviser, Panelist, Admin), and includes automated subscription billing via Stripe.

## 📋 Prerequisites

Before you start, ensure you have the following installed on your new computer:
- **PHP 8.2+** 
- **Composer**
- **Node.js (v18+)** & npm
- **MySQL** (via XAMPP, Laragon, or standalone)
- **Git**

## 💻 Installation Guide

### 1. Clone the Repository
Open your terminal/command prompt and pull the code from GitHub:
```bash
git clone https://github.com/your-username/research_tracker.git
cd research_tracker
```

### 2. Install Dependencies
Install the PHP packages and Node modules:
```bash
composer install
npm install
```

### 3. Environment Configuration
Duplicate the example environment file:
```bash
cp .env.example .env
```
Open the `.env` file and verify these critical settings:
```ini
APP_URL=http://localhost:8000
SESSION_DOMAIN=.localhost

# Landlord Database Connection
DB_CONNECTION=landlord
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=research_tracker_landlord
DB_USERNAME=root
DB_PASSWORD=

# Tenant Database Config (Credentials used dynamically)
TENANT_DB_USERNAME=root
TENANT_DB_PASSWORD=

# Stripe Configuration (Used for Mock Subscriptions locally)
STRIPE_KEY=sk_test_dummy
STRIPE_SECRET=sk_test_dummy
```

### 4. Create the Central Database
Before running migrations, you must legally create the central Landlord database. Open your MySQL client (e.g., phpMyAdmin, TablePlus) and execute:
```sql
CREATE DATABASE research_tracker_landlord;
```
*(Note: Do not create the tenant databases manually! The system handles that automatically).*

### 5. Generate Key, Migrate, and Seed
Run these commands to prepare your software:
```bash
# Generate App encryption key
php artisan key:generate

# Run migrating and seeding for the Landlord database
php artisan migrate --database=landlord --path=database/migrations/landlord
php artisan db:seed
```

### 6. Run the Application
You will need two separate terminal windows to run both the Laravel backend and the Vite frontend server:

**Terminal 1 (Backend):**
```bash
php artisan serve
```

**Terminal 2 (Frontend Assets):**
```bash
npm run dev
```

---

## 🚀 Accessing the System

Everything is driven by subdomains. Because `SESSION_DOMAIN=.localhost` is set, you can navigate locally to different branches.

### Central System (Landlord)
- **URL**: `http://localhost:8000` (or `http://admin.localhost:8000`)
- **Login Credentials**: Check `database/seeders/DatabaseSeeder.php` for the default landlord admin account created during seeding.

### Department Portals (Tenants)
If you created a department named `bsit`, the system will automatically provision its database. 
- **URL**: `http://bsit.localhost:8000`
- **Login Credentials**: Use the initial Admin Password you set in the Landlord dashboard when creating the department.

---

## 🛠 Troubleshooting
- **Routing/Domain issues**: If `bsit.localhost` doesn't resolve on your Windows machine, ensure your browser caches are cleared, or temporarily use Chrome/Brave which resolves `.localhost` loopbacks automatically.
- **Vite Manifest Error**: Ensure you ran `npm install` and that `npm run dev` is actively running in a terminal, OR run `npm run build` to compile static assets.
- **SQL "Unknown Database" Error**: Ensure you explicitly executed `CREATE DATABASE research_tracker_landlord;` before running `php artisan migrate`.
