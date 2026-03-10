---
name: code-style-guide
description: Enforces the team's code style, formatting, and quality standards for Angular/TypeScript projects. Use when reviewing, writing, or refactoring Angular/TypeScript code to ensure compliance with Prettier formatting, ESLint rules, naming conventions, best practices, and Angular-specific patterns. Don't use for Vue, React, Svelte, or non-TypeScript projects.
---

# Code Style Guide Skill

This skill enforces the team's code style standards as defined in `guide_draft.md`.

## When to Use This Skill

- Reviewing existing Angular/TypeScript code for style violations
- Writing new components, services, guards, interceptors, or pipes
- Refactoring code to follow team conventions
- Setting up or validating `.prettierrc`, `.eslintrc`, or `.editorconfig`
- Training team members on code standards

## Core Workflow

### Step 1: Identify the Task Type

Determine which category applies:

- **Formatting** (quotes, indentation, line length, trailing commas) → Read `references/prettier-rules.md`
- **Code quality** (types, complexity, enums, class organization) → Read `references/eslint-rules.md`
- **Naming** (files, classes, services, methods, variables, observables) → Read `references/naming-conventions.md`
- **Angular patterns** (components, DI, templates, guards, pipes, forms) → Read `references/angular-conventions.md`
- **Architecture and best practices** (signals, subscriptions, encapsulation, documentation) → Read `references/best-practices.md`

**Do not read all reference files upfront.** Load only what is needed for the specific task.

### Step 2: Load Relevant Context

Read the matching reference file based on Step 1. If the task spans multiple categories, read the relevant files one at a time, starting with the most critical.

### Step 3: Apply the Rules

1. **Code review**: List all violations grouped by category, with line references
2. **Refactoring**: Apply fixes using exact patterns from the reference file
3. **New code**: Follow templates and patterns from the reference file
4. **Config validation**: Compare `.prettierrc`, `.eslintrc`, `.editorconfig` against `references/prettier-rules.md` and `references/eslint-rules.md`

### Step 4: Validate

After applying changes, confirm:
1. All rules from the loaded reference are satisfied
2. Angular-specific patterns are checked against `references/angular-conventions.md`
3. Accessibility requirements are met (WCAG AA minimum)

## Progressive Disclosure Map

```
SKILL.md (you are here)
│
└── references/
    ├── prettier-rules.md        # Formatting: line length, quotes, indentation, imports
    ├── eslint-rules.md          # Types, complexity, operators, class organization
    ├── naming-conventions.md    # Files, URLs, classes, services, methods, variables
    ├── best-practices.md        # Signals, subscriptions, encapsulation, documentation
    └── angular-conventions.md  # Components, DI, templates, guards, pipes, forms
│
└── assets/
    ├── component-template.ts     # Skeleton for new components
    ├── service-template.ts       # Skeleton for new HTTP services
    ├── state-service-template.ts # Skeleton for new state services
    ├── form-template.ts          # Typed reactive form example
    └── models/
        ├── index.ts
        ├── users/                # User, CreateUserDto, UpdateUserDto
        └── forms/                # UserForm, UserFormData
```

## Quick Reference

### Fix Formatting
1. Read `references/prettier-rules.md`
2. Apply: single quotes, 120 char limit, 2-space indentation, no trailing commas, semicolons required

### Enforce Type Safety
1. Read `references/eslint-rules.md`
2. Check: no `any`, explicit return types, no inferrable types, interface over type alias

### Fix Naming
1. Read `references/naming-conventions.md`
2. Check: kebab-case files, PascalCase classes, camelCase methods/variables, `$` suffix for observables, `on` prefix for UI handlers, `handle` prefix for callbacks

### Modernize Angular Code
1. Read `references/angular-conventions.md`
2. Replace: `@Input/@Output` → `input()/output()`, constructor DI → `inject()`, structural directives → native control flow, class guards/interceptors → functional

### Review Architecture
1. Read `references/best-practices.md`
2. Check: OnPush strategy, signals for state, `takeUntilDestroyed` for subscriptions, no nested subscriptions, JSDoc on public services and methods

### Scaffold New Code
- **Component**: Copy `assets/component-template.ts` — contains `ExampleComponent` with regions, signals, inputs/outputs, lifecycle hooks, and handler pattern
- **HTTP Service**: Copy `assets/service-template.ts` — contains `ExampleHttpService` with `fetchAll`, `fetchById`, `create`, `update`, `delete` using `User`/`CreateUserDto` from models
- **State Service**: Copy `assets/state-service-template.ts` — contains `ExampleStateService` with signal-based state and mutations (`setUsers`, `addUser`, `updateUser`, `removeUser`, `selectUser`)
- **Form Service**: Copy `assets/form-template.ts` — contains `UserFormService` with `initForm`, `isFieldInvalid`, `getFieldError`, `resetForm`
- **Models**: Copy structure from `assets/models/` — domain folders with barrel `index.ts` files; add new domain folder following the same pattern

## Rule Precedence

- Angular-specific rules (`references/angular-conventions.md`) take precedence over generic TypeScript rules
- Prettier formatting rules override ESLint formatting rules
- Accessibility rules are non-negotiable (WCAG AA minimum)

## Error Handling

### If rules conflict
- Prettier handles formatting; ESLint handles code quality — they do not conflict
- When Angular conventions differ from general TypeScript conventions, follow Angular conventions

### If legacy patterns are found
- Provide migration path: `NgModule` → standalone, `@Input()` → `input()`, class guards → functional
- Do not mix old and new patterns in the same file

### If the task involves documentation
- Read `references/best-practices.md` → "Documentation" section
- All public services and methods require JSDoc; constants with non-obvious values also require JSDoc
