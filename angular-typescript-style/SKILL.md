---
name: angular-typescript-style
description: Enforces Angular and TypeScript code style conventions, formatting rules, and best practices. Use when reviewing, refactoring, or writing Angular/TypeScript code to ensure adherence to Prettier formatting, ESLint quality rules, naming conventions, and Angular-specific patterns. Don't use for Vue, React, Svelte, or non-TypeScript projects.
---

# Angular/TypeScript Style Enforcement Skill

This skill helps enforce comprehensive code style, quality, and best practices for Angular and TypeScript projects.

## When to Use This Skill

Activate this skill when:

- Reviewing existing Angular/TypeScript code for style violations
- Refactoring code to follow team conventions
- Writing new components, services, or other Angular artifacts
- Performing code quality audits
- Setting up linting and formatting rules
- Training team members on code standards

## Core Workflow

### Step 1: Identify the Task Type

Determine which aspect of code style needs attention:

- **Formatting**: Line length, quotes, indentation, semicolons → See `references/prettier-rules.md`
- **Type Safety**: Type annotations, `any` usage, return types → See `references/eslint-rules.md`
- **Naming**: Files, classes, methods, variables → See `references/naming-conventions.md`
- **Angular Patterns**: Components, services, templates → See `references/angular-conventions.md`
- **General Best Practices**: Architecture, performance, accessibility → See `references/best-practices.md`
- **Models Organization**: Interface/type definitions, folder structure, domain grouping → See `assets/models/` examples

### Step 2: Load Relevant Context

Based on the task type identified in Step 1, read the corresponding reference file:

- For formatting issues or Prettier configuration: Read `references/prettier-rules.md`
- For type safety, complexity, or ESLint rules: Read `references/eslint-rules.md`
- For file names, class names, or variable naming: Read `references/naming-conventions.md`
- For component structure, dependency injection, or templates: Read `references/angular-conventions.md`
- For models organization, domain grouping: Check `assets/models/` folder structure and `references/best-practices.md`
- For architecture patterns, state management, or accessibility: Read `references/best-practices.md`

**Do not read all files upfront.** Only load what is needed for the specific task.

### Step 3: Apply the Rules

Execute the corrections or provide feedback based on the loaded reference:

1. **For Code Review**: List all violations found, grouped by category, with specific line references
2. **For Refactoring**: Apply fixes directly to the code using the exact patterns from references
3. **For New Code**: Use templates from `assets/` folder to scaffold correct structure
4. **For Configuration**: Generate or update `.prettierrc`, `.eslintrc`, or `tsconfig.json` based on rules

### Step 4: Validate the Result

After applying changes:

1. Confirm that all rules from the relevant reference file are satisfied
2. Check for common edge cases (see `references/best-practices.md` → "Common Pitfalls")
3. If the change involves Angular-specific patterns, verify against `references/angular-conventions.md`

## Quick Reference Commands

### Check Formatting Compliance

1. Read `references/prettier-rules.md`
2. Compare code against: line length (80), quotes (single), indentation (tabs), semicolons (required)
3. Report violations with specific line numbers

### Enforce Type Safety

1. Read `references/eslint-rules.md`
2. Scan for: `any` type usage, missing return types, implicit types at module boundaries
3. Provide explicit type annotations following the rules

### Fix Naming Violations

1. Read `references/naming-conventions.md`
2. Check: file names (kebab-case), class names (PascalCase), variables (camelCase), methods (descriptive verbs)
3. Suggest renames with exact before/after examples

### Modernize Angular Code

1. Read `references/angular-conventions.md`
2. Replace: `@Input/@Output` → `input()/output()`, `@HostBinding` → `host` object, `*ngIf` → `@if`
3. Apply OnPush change detection and signal-based state

### Scaffold New Components

1. Read `references/angular-conventions.md` for structure requirements
2. Use template from `assets/component-template.ts`
3. Fill in component-specific logic while preserving encapsulation and organization rules

## Progressive Disclosure Map

```
SKILL.md (you are here)
│
├── references/
│   ├── prettier-rules.md          # Formatting: line length, quotes, indentation
│   ├── eslint-rules.md            # Type safety, complexity, code quality
│   ├── naming-conventions.md      # Files, classes, methods, variables
│   ├── angular-conventions.md     # Components, DI, templates, lifecycle
│   └── best-practices.md          # Architecture, performance, accessibility
│
└── assets/
    ├── component-template.ts      # Skeleton for new components
    ├── service-template.ts        # Skeleton for new services
    └── form-template.ts           # Typed reactive form example
```

## Error Handling

### If rules conflict:

- Angular-specific rules in `references/angular-conventions.md` take precedence over generic TypeScript rules
- Prettier formatting rules override ESLint formatting rules (ESLint handles quality, Prettier handles style)
- Accessibility rules in `references/best-practices.md` are non-negotiable (WCAG AA minimum)

### If edge cases arise:

- For complex service architectures: Consult `references/best-practices.md` → "Service Organization"
- For unclear lifecycle hook usage: Read `references/angular-conventions.md` → "Lifecycle Interfaces"
- For type inference uncertainties: Default to explicit types per `references/eslint-rules.md`

### If user's code uses legacy patterns:

- Provide migration path (e.g., `NgModule` → standalone, `@Input()` → `input()`)
- Reference specific sections in `references/angular-conventions.md`
- Do not mix old and new patterns in the same file

## Output Format

When providing feedback or corrections:

1. **Group by Category**: Prettier → ESLint → Naming → Angular → Best Practices
2. **Reference the Rule**: Always cite the specific reference file and section
3. **Provide Examples**: Show before/after code snippets
4. **Prioritize**: Critical (type safety, accessibility) → High (naming) → Medium (formatting)

## Examples

### Example 1: Reviewing a Component

```
User: "Review this component for style violations"

Agent Actions:
1. Read references/angular-conventions.md (component structure)
2. Read references/naming-conventions.md (method names, properties)
3. Scan code for: change detection strategy, encapsulation, lifecycle interfaces
4. Report violations grouped by severity
```

### Example 2: Scaffolding a New Service

```
User: "Create a UserHttpService"

Agent Actions:
1. Read references/angular-conventions.md → "Services" section
2. Read references/naming-conventions.md → "Services" and "Methods in Services"
3. Use assets/service-template.ts as base structure
4. Fill in HTTP methods with proper typing and JSDoc
```

### Example 3: Fixing Formatting

```
User: "Fix Prettier violations in this file"

Agent Actions:
1. Read references/prettier-rules.md
2. Apply: single quotes, 80 char limit, tabs, semicolons, trailing commas
3. Do not change logic, only formatting
```

## Integration with Development Tools

This skill complements but does not replace:

- **Prettier CLI**: For bulk formatting (run `prettier --write .`)
- **ESLint CLI**: For automated linting (run `eslint . --fix`)
- **Angular Schematics**: For generating new components/services

When the user asks to "set up linting," provide configuration files based on the rules in references/.

## Notes

- All file paths in this skill use forward slashes (`/`) regardless of OS
- Code examples in reference files are authoritative—copy patterns exactly
- This skill assumes Angular v20+ with standalone components as default
- Accessibility is mandatory, not optional (see `references/best-practices.md`)
