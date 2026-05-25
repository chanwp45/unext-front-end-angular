# SOP Violation Handling

## Minor Violations (ฝ่าฝืนเล็กน้อย)

| Violation | Resolution |
|-----------|-----------|
| Branch naming | Rename before merge |
| Formatting/spacing | Auto-fix with Prettier |
| Import ordering | Auto-fix with ESLint |

## Major Violations (ฝ่าฝืนรุนแรง)

| Violation | Resolution |
|-----------|-----------|
| No unit tests | Request tests before merge |
| Console errors | Must be fixed |
| TypeScript `any` types | Refactor required |
| Skipped DoD checklist items | Reject PR |
| No accessibility compliance | Refactor required |
| Code duplication | Request refactoring |

## Escalation Path

1. Code reviewer identifies violation
2. PR author gets feedback + timeline to fix
3. If not fixed → Senior developer review required
4. Persistent violations → Team discussion → Policy update
