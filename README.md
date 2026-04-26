# Research Tracker (Multi-Tenant Architecture)

This is a comprehensive multi-tenant research tracking application built with **Laravel 12**, **Inertia.js**, and **React**. 

### 🏗 Architecture Overview
The system uses a **Landlord/Tenant** architecture:
- **Landlord Database (`research_tracker`)**: Stores central information like subscription plans, tenant records, and global super-admins.
- **Tenant Databases (Dynamic)**: Each research institution or department (e.g., `research_tracker_bsit`) gets its own isolated database for its users, groups, and research data.

---

## 📋 Prerequisites

Before you start, ensure you have the following installed:
- **PHP 8.2+**
- **Composer**
- **Node.js (v18+) & npm**
- **MySQL** (via XAMPP, Laragon, or standalone)
- **Git**

---

## 💻 Installation Guide

### 1. Clone the Repository
```bash
git clone https://github.com/Chun-taro/Research_tracker.git
cd Research_tracker
```

### 2. Install Dependencies
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

#### Landlord Connection (The Central System)
```ini
DB_CONNECTION=landlord
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=research_tracker
DB_USERNAME=root
DB_PASSWORD=
```

#### Multi-Tenancy & Domains
```ini
# This allows subdomains to share the session (e.g., bsit.localhost)
SESSION_DOMAIN=.localhost
APP_URL=http://localhost:8000

# Tenant Database Credentials (The system uses these to create new DBs)
TENANT_DB_USERNAME=root
TENANT_DB_PASSWORD=
```

### 4. Database Initialization (CRITICAL STEP)
The multi-tenant structure requires a specific migration sequence.

**A. Create the Central Database:**
Open your MySQL client (e.g., phpMyAdmin, TablePlus) and create the main database:
```sql
CREATE DATABASE research_tracker;
```

**B. Generate App Key:**
```bash
php artisan key:generate
```

**D. Run Tenant Migrations (Workaround for Cross-DB Validation):**
To ensure that validation rules (like `exists:research_groups,id`) work across connections, run the tenant schema on the landlord database:
```bash
php artisan migrate --database=landlord --path=database/migrations/tenant
```

**E. Seed the System:**
This command seeds the landlord data AND automatically creates the first sample tenant database (`research_tracker_bsit`):
```bash
php artisan db:seed
```

### 5. Run the Application
You need two separate terminal windows:

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

The application uses subdomains to distinguish between the central admin and specific tenants.

- **Landlord Access (SaaS Admin):** [http://localhost:8000](http://localhost:8000)
  - **Email:** `superadmin@researchtracker.com`
  - **Password:** `password`
- **Tenant Portal (Sample):** [http://bsit.localhost:8000](http://bsit.localhost:8000)
  - **Email:** `admin@bsit.edu.ph`
  - **Password:** `password`

---

## 🛠 Troubleshooting

### ❌ "Table 'research_tracker.research_groups' doesn't exist"
This happens if you haven't run the tenant migrations on the landlord connection. Some validation rules require the table schema to be present in the default connection.
**Fix:** 
```bash
php artisan migrate --database=landlord --path=database/migrations/tenant
```

### ❌ "Integrity constraint violation (support_tickets_user_id_foreign)"
This was a known issue in older versions where support tickets in the central DB were trying to enforce foreign keys on tenant-specific users.
**Fix:** Pull the latest version and run migrations. The foreign key has been relaxed to support multi-database users.

### ❌ "Table 'research_tracker.tenants' doesn't exist"
This happens if you ran `php artisan migrate` without the `--path` flag. The default migration folder is empty.
**Fix:** Run the specific landlord migration command:
```bash
php artisan migrate --database=landlord --path=database/migrations/landlord
```

### ❌ Subdomain (bsit.localhost) not loading
- Ensure `SESSION_DOMAIN=.localhost` (with the leading dot) is set in `.env`.
- Use **Google Chrome** or **Brave**, as they automatically resolve `*.localhost` to your local machine.

### ❌ "Unknown Database 'research_tracker_bsit'"
This happens if the seeder failed or was skipped.
**Fix:** Run `php artisan db:seed`. This command is programmed to create the tenant databases for you.

### ❌ Vite Manifest Error
Ensure `npm run dev` is actively running in a terminal, or run `npm run build` for a production-ready version.
