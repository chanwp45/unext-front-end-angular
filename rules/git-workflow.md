# Git Workflow

## Branch Naming Convention

```
feature/[feature-name]           # New features
bugfix/[bug-name]                # Bug fixes
hotfix/[hotfix-name]             # Production hotfixes
docs/[documentation-update]      # Documentation
refactor/[refactor-name]         # Code refactoring
chore/[task-name]                # Chores & maintenance
```

## Workflow Steps

1. Create feature branch from `main`
2. Make commits following the [Commit Convention](./commit-convention.md)
3. Push branch to remote
4. Create Pull Request using the template below
5. Code review & approval required
6. Merge and delete branch

## Pull Request Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] New Feature
- [ ] Bug Fix
- [ ] Documentation Update
- [ ] Performance Improvement
- [ ] Code Refactoring

## Testing
- [ ] Unit tests added
- [ ] Manual testing completed
- [ ] Browser compatibility checked

## Checklist
- [ ] Code follows SOP
- [ ] Self-review completed
- [ ] Comments & documentation added
- [ ] No breaking changes
```

## Code Review Checklist

- [ ] Follows naming conventions from [Coding Standards](./coding-standards.md)?
- [ ] Has unit tests with ≥80% coverage?
- [ ] Passes ESLint & Prettier checks?
- [ ] Includes TypeScript types (no `any` types)?
- [ ] Documentation/comments added?
- [ ] Accessibility standards met (WCAG 2.1 AA)?
- [ ] Performance impact analyzed?
- [ ] No console errors/warnings?
- [ ] Branch naming follows convention?
- [ ] Commit messages follow [Commit Convention](./commit-convention.md)?
