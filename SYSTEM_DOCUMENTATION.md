# System Documentation: Research Tracker SaaS Platform

## 1. Introduction
**Description**:
Research Tracker is a specialized Multi-Tenant Software as a Service (SaaS) platform designed to streamline the management of academic research, theses, and dissertations within educational institutions.

**Details**:
The platform provides a centralized environment where multiple departments (tenants) can manage their own research cycles, student groups, and document submissions in complete isolation. By automating the tracking of deadlines and version control, it reduces administrative overhead for both students and faculty.

**Illustrations / Diagrams**:
*(Placeholder: Conceptual diagram showing multiple University Departments connecting to a single Central Application Core)*

---

## 2. Project Overview
**Description**:
A cloud-native solution for research coordinators to manage the end-to-end lifecycle of student research projects.

**Details**:
The system is built on a "Two-Application" concept:
- **Central Landlord App**: Manages department onboarding, subscription billing, and global system health.
- **Tenant Departmental App**: A private, branded instance for each department to manage its own students, advisers, and repositories.

---

## 3. Objectives
**Description**:
To provide a scalable and secure infrastructure for academic research management.

**Details**:
- **Data Isolation**: Ensure that research data from one department is never accessible by another.
- **Efficiency**: Automate the submission and review process with real-time feedback and version history.
- **Sustainability**: Provide a centralized digital repository for all completed research works.
- **Scalability**: Allow the institution to onboard new departments instantly without manual server configuration.

---

## 4. Scope and Limitations
**Scope**:
- Multi-database tenant isolation.
- Subscription management and automated billing.
- Role-Based Access Control (RBAC) for Students, Advisers, and Panelists.
- Document submission with automated versioning and "revert" capabilities.
- Research cycle and deadline management.
- Centralized research repository for archived works.

**Limitations**:
- Requires an internet connection for real-time synchronization.
- Initial setup requires wildcard DNS or host-file configuration for local subdomain testing.

---

## 5. System Architecture
**Description**:
One-Application, Multi-Database SaaS Architecture.

**Details**:
- **Backend**: Laravel 11+ framework providing robust routing, middleware, and database management.
- **Frontend**: React.js with Inertia.js for a Single Page Application (SPA) experience without the complexity of a separate API.
- **Multitenancy**: Powered by `spatie/laravel-multitenancy`, which dynamically switches database connections based on the visiting subdomain/slug.
- **Infrastructure**: Designed for easy deployment with clear separation between Landlord (Central) and Tenant (Departmental) logic.

---

## 6. Multi-Tenancy Design
**Description**:
Physical Data Isolation via Multiple Databases.

**Details**:
Each department (tenant) is provisioned with its own dedicated MySQL database. When a user visits `engineering.researchtracker.edu`, the application identifies the "Engineering" tenant and switches the database connection on the fly. This ensures that even in the case of a security breach in one department, others remain completely unaffected.

---

## 7. Database Design
The system utilizes two distinct types of databases:

1. **Central (Landlord) DB**:
   - Stores tenant records (name, slug, domain).
   - Stores global users (SuperAdmins).
   - Manages subscriptions and payment transactions.

2. **Tenant (Departmental) DBs**:
   - Stores local users (Students, Advisers, Panelists).
   - Stores Research Groups, Submissions, and Versions.
   - Stores Schedules, Templates, and Repository archives.

*(Attached: Screenshot of relational schema for both Landlord and Tenant databases)*

---

## 8. System Features
- **Central Dashboard**: Global overview of all active departments and revenue (for SuperAdmins).
- **Tenant Management**: One-click onboarding for new departments.
- **Subscription Engine**: Tiered access controlling feature availability and storage limits.
- **Research Lifecycle**: Management of title proposals, chapter reviews, and final defense manuscripts.
- **Versioning System**: "Copy-Forward" versioning that allows users to revert to previous states without data loss.
- **Automated Deadlines**: System-enforced research cycles to keep groups on track.

---

## 9. User Roles and Permissions (RBAC)
- **SuperAdmin (Landlord)**: Manages the platform, tenants, and billing.
- **Department Admin (Tenant)**: Manages department-wide settings, users, and research cycles.
- **Adviser**: Oversees specific research groups, provides feedback, and requests revisions.
- **Panelist**: Reviews final manuscripts and participates in the defense evaluation.
- **Student**: Submits research documents and tracks progress within their assigned group.

---

## 10. Pricing Model
The platform offers a tiered subscription model:
- **Free/Basic**: Limited to 5 active research groups; 5GB storage; core workflows only.
- **Standard**: Up to 20 active groups; 20GB storage; advanced scheduling tools.
- **Premium**: Unlimited groups; 100GB storage; full API access; priority support.

---

## 11. Security Implementation
- **Authentication**: Secure login via Laravel Breeze/Inertia with password hashing.
- **Authorization**: Strict Middleware checks at both the Landlord and Tenant levels.
- **Data Safety**: CSRF protection on all forms, SQL Injection prevention via Eloquent ORM, and XSS protection via Inertia's data handling.
- **Database Isolation**: The most significant security layer, ensuring no cross-tenant data leakage.

---

## 12. API Documentation
The system exposes several internal and external routes:
- `/landlord/tenants`: Management of department accounts.
- `/admin/submissions`: Handling of document uploads and reviews.
- `/admin/billing`: Subscription and invoice management.
*(Detailed API specs attached in Postman/Swagger format if applicable)*

---

## 13. System Screenshots
*(Placeholder: Insert screenshots of)*
- Landlord dashboard showing revenue metrics.
- Tenant management screen.
- Student submission page with version history.
- Admin billing/pricing tier page.

---

## 14. Development Documentation
- **PHP**: ^8.2
- **Laravel**: ^11.0
- **Node.js**: ^20.0 (Vite)
- **Database**: MySQL 8.0+
- **Styling**: Tailwind CSS
- **Stack**: "The TALL Stack derivative" (Laravel, Inertia, React, Tailwind)
