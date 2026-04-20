# Changelog

All notable changes to **Research Tracker** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [v1.0.0] - 2026-04-19

> Initial public release of the Research Tracker SaaS platform. This version establishes the full multi-tenant architecture, subscription tiers, and all core research management features.

### Added

#### 🏗️ Core Architecture
- **Multi-tenant SaaS architecture** — Centralized landlord/admin dashboard with isolated tenant workspaces
- **Centralized Identity Hub (SSO)** — Single sign-on system for cross-tenant identity and admin provisioning
- **Subscription tier system** — Three-tier subscription model (Basic, Standard, Premium) with feature gating
- **System versioning & update tracking** — Live version history pulled from GitHub releases with local git log fallback

#### 🎨 UI & Theming
- **Dynamic subscription plan theming** — Landlord can assign unique primary colors and Dark Mode themes per plan tier
- **Theme propagation** — Plan themes are applied consistently across Landlord and Tenant dashboards
- **Predefined theme defaults** — Emerald (Basic), Indigo (Standard), and Dark/Amber (Premium) auto-applied on seed
- **Responsive plan management UI** — Feature checkboxes, per-plan controls, and a randomization tool for theme previewing

#### 🧑‍💼 Tenant Management
- **Template Upload** — Tenants can upload and manage document templates
- **Schedule Management** — Create and manage academic/research schedules
- **Repository Addition** — Link and manage research repositories per tenant

#### 💳 Billing & Localization
- **PHP currency localization** — All billing and pricing standardized to Philippine Peso (₱)
- **Standardized billing interface** — Consistent billing display across all tenant-facing pages

#### 🔔 Notifications & Updates
- **Update notification system** — Admin/landlord users are notified when new system versions are available
- **System History page** — Dedicated page showing a full changelog of system updates
- **GitHub API integration** — Update logs are fetched from the GitHub Releases API, with dynamic repository configuration

#### 🎫 Support System
- **Support & Bug Reporting System** — Tenants can submit support tickets and bug reports
- **Admin support inbox** — Centralized support ticket management for the admin/landlord

#### 🔐 Authentication
- **Simplified authentication flow** — Streamlined login/registration experience
- **Randomized password generation** — Auto-generated secure passwords on tenant account creation
- **Welcome email system** — Automated welcome emails sent to newly provisioned tenant accounts

#### ⚙️ Infrastructure
- **Ziggy route prefix fixes** — Resolved route naming conflicts across multi-tenant contexts
- **Dynamic GitHub repo configuration** — Repository source for update tracking is configurable via environment variables
- **Subscription tier migration & seeder** — Reliable database seeding for all three subscription tiers

### Fixed
- Corrected syntax error in `ScheduleController` causing tenant schedule routes to fail
- Replaced all remaining `$` currency symbols with `₱` in Tenant management UI
- Restored missing `subscription_tiers` migration and seeder that was accidentally removed
- Improved `SystemUpdateService` resilience when GitHub API is unavailable
- Fixed research cycle selection, input typing, and settings update method bugs

### Changed
- Rebranded from single-tenant to full multi-tenant SaaS architecture
- Moved root directory to clean structure; legacy files archived

---

[Unreleased]: https://github.com/Chun-taro/Research_tracker/compare/v1.0.0...HEAD
[v1.0.0]: https://github.com/Chun-taro/Research_tracker/releases/tag/v1.0.0
