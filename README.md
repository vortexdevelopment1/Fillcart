# Fillcart – Scalable Monorepo Platform

Fillcart is a multi-vendor on-demand product delivery platform (similar to Blinkit and BigBasket, without a 10-minute delivery constraint) engineered with a scalable, production-grade monorepo architecture.

---

## 1. Monorepo Overview

This repository houses the entire Fillcart digital ecosystem across mobile, web, backend, shared packages, and cloud infrastructure:

```
fillcart/
├── apps/
│   ├── customer-app/       # Flutter + Dart mobile app for end customers
│   ├── vendor-app/         # Flutter + Dart mobile app for store vendors & managers
│   ├── rider-app/          # Flutter + Dart mobile app for delivery fleet riders
│   ├── website/            # Next.js + TypeScript public marketing & web portal
│   ├── admin-dashboard/    # Next.js + TypeScript central operations admin panel
│   └── backend/            # Express.js + TypeScript modular REST backend with Prisma & PostgreSQL
├── packages/
│   ├── flutter_shared/     # Reusable Flutter widgets, themes, networking utilities, and common components (Dart)
│   ├── ui-web/             # Reusable React components, hooks, and UI shared between website and admin dashboard
│   ├── api-contracts/      # Shared API contracts & endpoint specifications
│   ├── design-tokens/      # Cross-platform design tokens (colors, typography, spacing, themes)
│   ├── shared-types/       # TypeScript type definitions shared across web & backend
│   ├── validations/        # Reusable runtime schemas & input validation rules
│   ├── constants/          # Shared platform-wide constants
│   ├── utils/              # Shared helper functions and utility libraries
│   ├── assets/             # Brand logos, shared vector icons, and graphics
│   └── config/             # Shared tooling configurations (TypeScript, ESLint, Prettier)
├── infrastructure/         # Deployment definitions, Docker configurations, Nginx, CI/CD, and monitoring
├── docs/                   # Architectural blueprints, database schemas, and developer documentation
├── scripts/                # Repository orchestration, build, and operational automation scripts
├── .github/                # GitHub Actions workflows and CI/CD pipelines
├── .gitignore              # Production-grade Git ignore specifications
├── .env.example            # Environment variables template
└── README.md               # Repository documentation and architecture map
```

---

## 2. Technology Stack

| Layer | Technology |
|---|---|
| **Monorepo Engine** | Turborepo |
| **Package Manager** | npm |
| **Mobile Applications** | Flutter + Dart (Feature-First Architecture) |
| **Website & Admin** | Next.js + TypeScript (Feature-Based Structure) |
| **Central Backend** | Express.js + TypeScript (Modular Domain Architecture) |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **API Architecture** | REST API |
| **Real-time Engine** | WebSockets (Planned) |

---

## 3. Applications Breakdown

### A. Customer Mobile App (`apps/customer-app`)
Built with **Flutter & Dart** using feature-first architecture. Handles customer discovery, product browsing, cart management, checkout, order tracking, addresses, payment gateway integration, and customer profile.

### B. Vendor Mobile App (`apps/vendor-app`)
Built with **Flutter & Dart**. Empowers store owners and merchants to manage catalogs, real-time inventories, incoming orders, preparation workflows, promotional offers, store earnings, and analytics.

### C. Rider Mobile App (`apps/rider-app`)
Built with **Flutter & Dart**. Equips delivery partners with shift availability toggling, dispatch delivery requests, pickup confirmations, route navigation, live delivery tracking, earnings summaries, and delivery history.

### D. Public Website (`apps/website`)
Built with **Next.js & TypeScript**. Serves as the high-performance, SEO-optimized public portal showcasing platform offerings, onboarding funnels for vendors/riders, corporate information, careers, and support.

### E. Admin Dashboard (`apps/admin-dashboard`)
Built with **Next.js & TypeScript**. The mission-control dashboard for Fillcart operations, platform governance, inventory auditing, vendor KYC, rider verification, dispute resolution, financial reports, analytics, and global system configurations.

### F. Central Backend API (`apps/backend`)
Built with **Express.js & TypeScript** following clean modular architecture. Organizes business domains independently into 25 dedicated modules (auth, users, vendors, catalog, orders, payments, delivery, refunds, analytics, etc.), each containing its own controllers, services, repositories, models, DTOs, validators, routes, interfaces, and test suites.

---

## 4. Shared Packages Policy

- **Dart vs TypeScript Isolation**: Flutter applications write in Dart and consume reusable Dart code from `packages/flutter_shared/` without directly importing TypeScript packages. Mobile and web UI implementations remain strictly segregated.
- **Language-Neutral API Contracts**: `packages/api-contracts/` uses OpenAPI specifications as the single authoritative source of truth, compiling into TypeScript contracts (`typescript/`) and Dart client models (`dart/`).
- **Web UI Reusability**: Shared React components, design patterns, hooks, and presentation layouts between the public website and admin dashboard are housed within `packages/ui-web/`.
- **Contract Sharing**: Web applications and backend share `api-contracts`, `shared-types`, `validations`, `constants`, and `utils`.
- **Design Consistency**: Shared tokens (`colors`, `typography`, `spacing`, `themes`) in `packages/design-tokens/` ensure brand consistency across Flutter mobile apps and React web portals.
- **No Domain Contamination**: Application-specific business logic is prohibited from `packages/`. Only reusable, agnostic utilities and contracts reside here.

---

## 5. Architectural Principles

1. **Single Monorepo**: All applications and shared resources version-controlled in a unified repository.
2. **Independent Mobile Apps**: Each mobile app maintains its own Flutter project lifecycle.
3. **Single Backend Hub**: All customer, vendor, rider, and administrative interfaces interact with the central Express backend.
4. **Single Source of Truth Database**: PostgreSQL managed centrally via Prisma in the backend.
5. **Horizontal Scalability**: Stateless API design prepared for containerization and load-balanced multi-instance deployments.
