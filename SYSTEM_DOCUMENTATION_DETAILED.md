# 📘 System Documentation: Research Tracker SaaS Platform
**Version v1.1.0** | **Last Updated: April 2026**

---

## 1. Introduction
**Description**:
The Academic Research Tracker is a comprehensive Multi-Tenant SaaS solution designed to bridge the gap between student researchers, faculty advisers, and institutional administration.

**Details**:
Traditional research management often relies on fragmented email threads, paper trails, and unorganized cloud storage. This system centralizes the **Research Lifecycle**, providing institution-wide research portals with a white-labeled dashboard to:
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
- **Central Application (SaaS Core)**: Handles global administration, portal onboarding, system-wide health monitoring, and enterprise billing.
- **Tenant Application (Client Instance)**: Provides a private database and customized UI for each research portal (e.g., "Main Campus", "Graduate School").

---

## 3. Objectives
### Primary Objectives:
- **Standardization**: Create a uniform research submission process across all institution portals.
- **Integrity**: Implement a "no-deletion" versioning policy where all previous drafts are preserved.
- **Scalability**: Support hundreds of portals on a single codebase with effortless onboarding.

### Secondary Objectives:
- **Automation**: Automatic status updates and deadline alerts for students and advisers.
- **Visibility**: Provide real-time progress reports for portal administrators.
- **Repository Health**: Built-in archiving for long-term storage of final manuscripts.

---

## 4. Scope and Limitations
### Scope:
- **Institutional Onboarding**: Automated database provisioning for new portal signups.
- **Centralized Identity Hub (SSO)**: Global user identities span across all tenants.
- **Subscription Cycles**: Annual billing with automated plan restrictions and dynamic UI theming per tier.
- **System Versioning & Update Tracking**: Real-time integration with GitHub Releases API to track application updates.
- **Research Lifecycle Management**:
    - Title Proposal & Approval
    - Chapter-by-Chapter Submission & Review
    - Final Manuscript Submission
    - Resource Management (Templates & Repositories)
    - Milestone Scheduling
- **Versioning Engine**: Support for multiple file revisions with "Revert-to-Previous" functionality.

### Limitations:
- **File Types**: Currently optimized for PDF, DOCX, and XLSX formats.
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
The platform implements **Physical Database Isolation**. When a new portal is initialized:
- A new MySQL database is created (e.g., `tenant_bsit`).
- Migrations are run specifically on that database.
- Files are stored in tenant-specific directories: `storage/app/submissions/{tenant_id}/`.

This architecture prevents **Cross-Tenant Data Leakage**, meeting strict privacy requirements (GDPR/APEC).

---

## 7. Database Design
### Landlord (Central) Schema:
| Table Name | Primary Purpose |
| :--- | :--- |
| `tenants` | Metadata for portals (subdomain, db name, theme). |
| `subscriptions` | Active plans, expiry dates. |
| `payments` | Transaction logs and reference numbers. |
| `users` | SuperAdmin accounts for global platform oversight. |

### Tenant (Local) Schema:
| Table Name | Primary Purpose |
| :--- | :--- |
| `users` | Students, Advisers, and Panelists belonging to that portal. |
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

### 🔔 System Update Tracking
- **Live Versioning**: The central app pings the GitHub Releases API (falling back to local git tags) to grab the currently installed software version.
- **Notifications**: Admin users are alerted in-app whenever the central repository pushes a new release.

### 🎫 Interactive Support System
- Cross-tenant support ticketing allows tenants to report bugs/issues directly to the central Landlord dashboard, bridging the gap between developers and clients.

---

## 9. User Roles and Permissions (RBAC)
| Role | Key Capabilities |
| :--- | :--- |
| **SuperAdmin** | Onboard portals, set global plan limits, manage revenue. |
| **Portal Admin** | Manage portal users, set research cycles/deadlines. |
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
| `POST` | `/admin/tenants` | Create new portal instance. |
| `PATCH` | `/admin/submissions/{sub}` | Update submission status (Approve/Reject). |
| `POST` | `/admin/submissions/{sub}/revert/{ver}` | Restore previous document version. |
| `GET` | `/landlord/subscriptions` | System-wide revenue reporting. |

---

## 13. System Screenshots (Development View)
1. **Dynamic Dashboard**: Shows student distribution across research statuses (Pie chart).
2. **Billing Central**: Premium dark-mode themed billing dashboard for administrators.
3. **Tenant Management**: The central hub for creating and monitoring portal accounts.

---

## 14. Installation & Deployment
For full instructions on how to install, configure, and run this system locally, please view the [README.md](README.md) file included in the root of the repository.
