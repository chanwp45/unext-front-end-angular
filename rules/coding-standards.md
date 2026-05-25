# Coding Standards

## Naming Conventions

```typescript
// Components (PascalCase)
const UserProfile: React.FC = () => {};
const LoginForm = () => {};

// Functions & Methods (camelCase)
function fetchUserData() {}
const handleButtonClick = () => {};

// Constants (UPPER_SNAKE_CASE)
const MAX_RETRIES = 3;
const API_TIMEOUT = 5000;

// Variables (camelCase)
let isLoading = false;
const userData = {};
```

## Formatting Standards

| Rule | Value |
|------|-------|
| Indentation | 2 spaces |
| Line Length | Max 100 characters |
| Semicolons | Required |
| Quotes | Single quotes for strings |
| Trailing Commas | ES5 compatible |
| Formatter | Prettier (auto-format) |

## Code Organization (Architecture)

> **Feature-First (Vertical Slice)** — organize by domain, not by file type.

```
src/
├── app/                              # Bootstrap, routing, global providers
├── features/
│   └── [feature-name]/               # Self-contained domain module
│       ├── components/
│       │   └── ComponentName/
│       │       ├── index.ts          # Barrel — export only public surface
│       │       ├── ComponentName.tsx
│       │       └── ComponentName.test.tsx
│       ├── hooks/
│       ├── api/
│       ├── store/
│       ├── types/
│       ├── utils/
│       └── index.ts                  # Feature public API
├── shared/
│   ├── components/
│   │   ├── ui/                       # Base primitives (Button, Input, Modal)
│   │   └── layout/                   # Layout wrappers
│   ├── hooks/
│   ├── lib/                          # Third-party wrappers
│   ├── types/
│   ├── utils/
│   └── constants/
├── store/                            # Global state (cross-feature only)
├── styles/                           # Global CSS & design tokens
└── config/                           # Env, route map, feature flags
```

### Key Architecture Rules

- **Features do not import each other** — share via `shared/` or a global event bus
- **Barrel exports** — each feature exposes only what's needed through `index.ts`
- **Colocation** — tests, local types, and styles live beside the component they belong to
- **shared/ discipline** — if only one feature uses it, keep it inside that feature

## TypeScript Rules

- Strict mode must be **enabled**
- No `any` types — refactor required if found
- All exported functions and components must have explicit types
