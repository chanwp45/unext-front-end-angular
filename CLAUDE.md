# CLAUDE.md — UNext Frontend Angular

---

## Project Overview

| Field | Value |
|-------|-------|
| Project Name | unext-front-end |
| Description | University management system — students, curricula, users, faculties |
| Framework | Angular 19 (standalone components) |
| UI Library | Angular Material 19 (Azure Blue theme) |
| Language | TypeScript (strict) |
| Target Users | Admin, Staff, Students |
| API Base URL | `http://localhost:8080/api` |
| Launch Date | 2026 |

---

## Quick Start

```bash
npm install
ng serve              # Dev server → http://localhost:4200
ng build              # Production build
ng test               # Unit tests (Karma/Jasmine)
ng lint               # ESLint check
```

---

## Folder Structure

```
src/app/
├── app.config.ts                   # Providers: router, HttpClient + auth interceptor, animations
├── app.routes.ts                   # Lazy-loaded feature routes (auth-guarded)
│
├── features/                       # Domain modules (vertical slices)
│   ├── auth/
│   │   ├── components/login/       # LoginComponent (standalone)
│   │   ├── guards/auth.guard.ts    # CanActivateFn — redirects to /auth/login if not logged in
│   │   ├── models/auth.model.ts    # LoginRequest, TokenResponse
│   │   ├── services/
│   │   │   ├── auth-api.service.ts # HTTP: login, refreshToken, logout
│   │   │   └── auth.service.ts     # State (signal isLoggedIn), login/logout orchestration
│   │   └── auth.routes.ts
│   │
│   ├── users/
│   │   ├── components/user-list/
│   │   ├── models/user.model.ts    # User, CreateUserRequest, UpdateUserRequest, UserRole
│   │   ├── services/users-api.service.ts
│   │   └── users.routes.ts
│   │
│   ├── faculties/
│   │   ├── components/faculty-list/
│   │   ├── models/faculty.model.ts # Faculty, Department
│   │   ├── services/faculties-api.service.ts
│   │   └── faculties.routes.ts
│   │
│   ├── curricula/
│   │   ├── components/curriculum-list/
│   │   ├── components/curriculum-detail/
│   │   ├── models/curriculum.model.ts  # Curriculum, CurriculumFilter, CurriculumAudit
│   │   ├── services/curricula-api.service.ts
│   │   └── curricula.routes.ts
│   │
│   └── students/
│       ├── components/student-list/
│       ├── components/student-detail/
│       ├── models/student.model.ts     # Student, StudentFilter, Gender, StudentStatus
│       ├── services/students-api.service.ts
│       └── students.routes.ts
│
└── shared/
    ├── components/
    │   ├── ui/                     # Shared presentational components
    │   └── layout/                 # Shell, sidenav, toolbar
    ├── interceptors/
    │   └── auth.interceptor.ts     # Attaches Bearer token; auto-refreshes on 401
    ├── models/
    │   └── api-response.model.ts   # ApiResponse<T>, PagedData<T>, FieldError
    └── services/
        ├── api-base.service.ts     # Base HTTP helpers (get/post/put/patch/delete)
        └── auth-token.service.ts   # localStorage token read/write/clear
```

---

## Architecture Rules

| Rule | Detail |
|------|--------|
| Standalone components | All components use `standalone: true` — no NgModules |
| Feature isolation | Features must NOT import each other; use `shared/` |
| Lazy loading | Every feature route uses `loadChildren` / `loadComponent` |
| Auth token | Stored in `localStorage` via `AuthTokenService`; interceptor adds Bearer header |
| Auto-refresh | `authInterceptor` retries with new token on 401; redirects to login if refresh fails |
| API envelope | All responses typed as `ApiResponse<T>` or `PagedResponse<T>` |
| Year values | `admission_year` / `effective_year` are Buddhist Era (BE) — subtract 543 for CE |

---

## SOP Rules

| File | Description |
|------|-------------|
| [ai-tools-config.md](./rules/ai-tools-config.md) | AI capabilities, stack, recommended prompt format |
| [coding-standards.md](./rules/coding-standards.md) | Naming, formatting, architecture, TypeScript rules |
| [unit-test-standard.md](./rules/unit-test-standard.md) | Test pattern, stack, coverage goals |
| [git-workflow.md](./rules/git-workflow.md) | Branch naming, workflow steps, PR template |
| [commit-convention.md](./rules/commit-convention.md) | Commit message format and types |
| [definition-of-done.md](./rules/definition-of-done.md) | DoD checklist |
| [ui-component-setup.md](./rules/ui-component-setup.md) | Angular Material usage, CSS tokens |
| [docker.md](./rules/docker.md) | Dockerfile, nginx.conf, docker-compose |

---

## API Reference

Full API spec: [`docs/api-spec.md`](./docs/api-spec.md)

- **Base URL:** `http://localhost:8080/api`
- **Auth:** Bearer JWT (15 min access token, 7-day refresh token)
- **Endpoints:** `/v1/auth/*`, `/v1/users`, `/v1/faculties`, `/v1/curricula`, `/v1/students`

---

## Environment Variables

```
# src/environments/environment.ts (dev)
apiBaseUrl: 'http://localhost:8080/api'

# src/environments/environment.prod.ts
apiBaseUrl: '/api'
```

---

**Last Updated**: May 2026 | **Version**: 1.0 | **Status**: Active
