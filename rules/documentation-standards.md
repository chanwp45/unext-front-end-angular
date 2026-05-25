# Documentation Standards

## Required Files per Project

| File | Purpose |
|------|---------|
| `README.md` | Project setup & overview |
| `CLAUDE.md` | SOP & AI assistant guidelines |
| `docs/` folder | Detailed guides (see below) |

## docs/ Folder Structure

```
docs/
├── coding-standard-guide.md     # Extended coding guide
├── unit-test-guide.md           # Testing how-tos & examples
├── git-workflow-guide.md        # Detailed git process
├── api-documentation.md         # API endpoints & contracts
├── component-documentation.md   # Component library docs
├── architecture-decisions/      # ADR (Architecture Decision Records)
│   └── [adr-name].md
└── [custom-doc].md
```

## When to Update CLAUDE.md

- When team agrees on new standards
- When framework or tools version changes significantly
- When project structure changes
- At least **quarterly** for maintenance
- Always update version number and "Last Updated" date
