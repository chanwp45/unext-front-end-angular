# Unit Test Standard

## Testing Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| Unit & Component | **Vitest** + React Testing Library | Fast, Vite-native, ESM-first (replaces Jest) |
| Integration | Vitest + MSW (Mock Service Worker) | API mocking at network level |
| E2E | **Playwright** | Cross-browser end-to-end testing |

## File Placement (Colocation)

Tests live **next to** the source file they cover — not in a separate `__tests__/` folder.

```
features/auth/components/LoginForm/
├── LoginForm.tsx
├── LoginForm.test.tsx        ← unit test colocated
└── index.ts

tests/
├── e2e/                      ← Playwright E2E tests
└── integration/              ← multi-feature integration tests
```

## Unit Test Pattern

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { UserProfile } from './UserProfile';

describe('UserProfile', () => {
  const user = { name: 'John' };

  it('renders user name', () => {
    render(<UserProfile user={user} />);
    expect(screen.getByText('John')).toBeInTheDocument();
  });

  it('calls onEdit when edit button clicked', async () => {
    const onEdit = vi.fn();
    render(<UserProfile user={user} onEdit={onEdit} />);
    await userEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(onEdit).toHaveBeenCalledOnce();
  });
});
```

## E2E Test Pattern (Playwright)

```typescript
import { test, expect } from '@playwright/test';

test('user can log in and see dashboard', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('secret');
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page).toHaveURL('/dashboard');
});
```

## Coverage Goals

| Level | Tool | Target |
|-------|------|--------|
| Unit Tests | Vitest | ≥ 80% of functions/branches |
| Integration Tests | Vitest + MSW | Critical API flows |
| E2E Tests | Playwright | Main user journeys |

## Naming Convention

| Type | Pattern |
|------|---------|
| Unit / Component | `ComponentName.test.tsx` |
| Hook | `useHookName.test.ts` |
| Utility | `utilName.test.ts` |
| Integration | `tests/integration/[flow].test.ts` |
| E2E | `tests/e2e/[journey].spec.ts` |
