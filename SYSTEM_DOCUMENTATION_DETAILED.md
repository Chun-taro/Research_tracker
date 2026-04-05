# 📘 System Documentation: Research Tracker SaaS Platform
**Version 1.1** | **Last Updated: April 5, 2026**

---

## 1. Introduction
**Description**:
The Academic Research Tracker is a comprehensive Multi-Tenant SaaS solution designed to bridge the gap between student researchers, faculty advisers, and institutional administration.

**Details**:
Traditional research management often relies on fragmented email threads, paper trails, and unorganized cloud storage. This system centralizes the **Research Lifecycle**, providing institutional departments with a white-labeled dashboard to:
- Standardize thesis and dissertation workflows.
- Enforce strict document versioning and audit trails.
- Monitor student progress against institutional deadlines.
- Securely store and archive completed scholarly works.

---

## 2. Project Overview
**Description**:
A cloud-ready, enterprise-grade platform for academic research oversight.

**Details**:
The platform utilizes a **Multi-Database Tenancy 모델**, which is the gold standard for security in SaaS. 
- **Central Application (SaaS Core)**: Handles global administration, department onboarding, system-wide health monitoring, and enterprise billing.
- **Tenant Application (Client Instance)**: Provides a private database and customized UI for each department (e.g., "College of Engineering", "Dept. of Computer Science").

---

## 3. Objectives
### Primary Objectives:
- **Standardization**: Create a uniform research submission process across all university departments.
- **Integrity**: Implement a "no-deletion" versioning policy where all previous drafts are preserved.
- **Scalability**: Support hundreds of departments on a single codebase with effortless onboarding.

### Secondary Objectives:
- **Automation**: Automatic status updates and deadline alerts for students and advisers.
- **Visibility**: Provide real-time progress reports for department heads.
- **Repository Health**: Built-in archiving for long-term storage of final manuscripts.

---

## 4. Scope and Limitations
### Scope:
- **Institutional Onboarding**: Automated database provisioning for new department signups.
- **Subscription Cycles**: Annual billing with automated plan restrictions.
- **Research Lifecycle Management**:
    - Title Proposal & Approval
    - Chapter-by-Chapter Submission & Review
    - Final Manuscript Submission
    - Panelist Defense Scheduling
- **Versioning Engine**: Support for multiple file revisions with "Revert-to-Previous" functionality.

### Limitations:
- **File Types**: Currently optimized for PDF, DOCX, and XLSX formats.
- **Dependency**: Requires a modern web browser and stable internet connection.
- **Local Testing**: Requires wildcard subdomain support (e.g., `*.localhost`) for full domain-based testing.

---

## 5. System Architecture
### High-Level Flow:
1. **Identification**: The system detects the tenant via the URI (e.g., `bsit.localhost`).
2. **Middleware**: Laravel middleware switches the database connection from `landlord` to the specific `tenant` database.
3. **Execution**: The application logic runs, only interacting with the isolated tenant data.

### Tech Stack:
- **Core**: Laravel v11.x (PHP 8.2+)
- **React Frontend**: Powered by Inertia.js (Zero-API approach)
- **Styling**: Tailwind CSS (Fully Responsive layout)
- **Tenancy**: `spatie/laravel-multitenancy`
- **Charting**: `Chart.js` for real-time progress analytics.

---

## 6. Multi-Tenancy Design
### Isolation Strategy:
The platform implements **Physical Database Isolation**. When a new department is initialized:
- A new MySQL database is created (e.g., `tenant_bsit`).
- Migrations are run specifically on that database.
- Files are stored in tenant-specific directories: `storage/app/submissions/{tenant_id}/`.

This architecture prevents **Cross-Tenant Data Leakage**, meeting strict privacy requirements (GDPR/APEC).

---

## 7. Database Design
### Landlord (Central) Schema:
| Table Name | Primary Purpose |
| :--- | :--- |
| `tenants` | Metadata for departments (subdomain, db name, theme). |
| `subscriptions` | Active plans, expiry dates. |
| `payments` | Transaction logs and reference numbers. |
| `users` | SuperAdmin accounts for global platform oversight. |

### Tenant (Local) Schema:
| Table Name | Primary Purpose |
| :--- | :--- |
| `users` | Students, Advisers, and Panelists belonging to that department. |
| `research_groups` | Student clusters and their assigned advisers. |
| `submissions` | The core "Research Work" record. |
| `submission_versions` | The physical files and history of changes. |
| `research_cycles` | Institutional deadlines and timelines. |

---

## 8. System Features & Logic
### 🔄 Reversion Engine (Versioning)
The system uses a **Copy-Forward** mechanism.
- When a user "Downgrades" a submission to a previous version, the system creates a *new* version record pointing to the old file metadata. 
- **Benefit**: Never lose a draft. Audit trails show exactly when a user reverted and why.

### 📅 Research Cycle Enforcement
- Administrators can set specific deadlines for Proposals, Chapters, and Finals.
- The system prevents late submissions and alerts advisers to pending reviews.

---

## 9. User Roles and Permissions (RBAC)
| Role | Key Capabilities |
| :--- | :--- |
| **SuperAdmin** | Onboard departments, set global plan limits, manage revenue. |
| **Dept. Admin** | Manage department users, set research cycles/deadlines. |
| **Adviser** | Monitor assigned groups, provide "Revision Required" status. |
| **Panelist** | Review final defense manuscripts, provide final approval scores. |
| **Student** | Form groups, submit documents, track status and version history. |

---

## 10. Pricing & Subscription Model
| Tier | Price | Capacity | Exclusive Features |
| :--- | :--- | :--- | :--- |
| **Basic** | ₱1,000/yr | 5 Groups | Core Workflows |
| **Standard** | ₱2,500/yr | 20 Groups | Advanced Scheduling, Priority Email |
| **Premium** | ₱4,000/yr | Unlimited | API Access, 24/7 Dedicated Support |

---

## 11. Security Implementation
- **Data Protection**: Automatic switching between databases at the middleware level ensures no query can accidentally cross-access records.
- **Encryption**: All passwords are hashed using `Bcrypt`. All file paths are obfuscated.
- **CSRF & XSS**: Laravel’s built-in session protection and Inertia’s safe-rendering prevent traditional web attacks.

---

## 12. Core API Documentation
| Method | Endpoint | Data / Action |
| :--- | :--- | :--- |
| `POST` | `/admin/tenants` | Create new department instance. |
| `PATCH` | `/admin/submissions/{sub}` | Update submission status (Approve/Reject). |
| `POST` | `/admin/submissions/{sub}/revert/{ver}` | Restore previous document version. |
| `GET` | `/landlord/subscriptions` | System-wide revenue reporting. |

---

## 13. System Screenshots (Development View)
1. **Dynamic Dashboard**: Shows student distribution across research statuses (Pie chart).
2. **Billing Central**: Premium dark-mode themed billing dashboard for administrators.
3. **Tenant management**: The central hub for creating and monitoring departmental accounts.

---

## 14. Development & Deployment
- **Local Dev**: Laragon/XAMPP with Virtual Hosts enabled for `*.localhost`.
- **Packaging**: `composer` for backend dependencies, `npm` for frontend.
- **Database**: 1 Central DB + N Tenant DBs.
- **Deployment**: Best suited for VPS/Dedicated servers where wildcard DNS can be configured.
