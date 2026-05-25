# AI Tools Configuration

## Available Capabilities

- Component creation & refactoring
- State management patterns
- API integration & services
- Unit test generation (Jest + React Testing Library)
- TypeScript type definitions
- Documentation & code comments
- Bug fixing & debugging
- Performance optimization
- Accessibility (a11y) improvements
- [ADD_CUSTOM_CAPABILITY]

## Stack

| Category | Tool | Notes |
|----------|------|-------|
| Language | [LANGUAGE_CHOICE] | TypeScript (strict) preferred |
| Framework | [FRAMEWORK_CHOICE] | React / Next.js / Vue / Angular |
| Package Manager | pnpm | Faster installs, strict dependency hoisting |
| Build Tool | Vite / Next.js | Vite for SPA, Next.js for SSR/SSG |
| Unit Testing | **Vitest** + React Testing Library | Native ESM, Vite-integrated |
| E2E Testing | **Playwright** | Cross-browser, reliable selectors |
| API Mocking | **MSW** (Mock Service Worker) | Network-level mocking |
| Server State | **TanStack Query** | Caching, sync, prefetch |
| Client State | **Zustand** / Jotai | Lightweight, no boilerplate |
| Code Quality | ESLint (flat config v9+) + Prettier | |
| IDE | Visual Studio Code | |

## Recommended Prompt Format

```markdown
## Issue/Task: [Clear Description]
## Context: [Relevant code/background]
## Requirements:
- [ ] Requirement 1
- [ ] Requirement 2
## Constraints:
- Browser support: [BROWSER_TARGETS]
- Performance targets: [PERFORMANCE_TARGETS]
- Accessibility: WCAG 2.1 AA
## Expected Output: [Specific deliverable/format]
```
