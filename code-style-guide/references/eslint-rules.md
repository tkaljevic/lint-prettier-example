# ESLint Rules

## Typing

**No `any` type** — use explicit types or `unknown`:

```ts
❌ user: any;
✔️ user: User;  // or data: unknown
```

**Explicit function return types** — all functions must declare return type:

```ts
❌ function getData() { return 'data'; }
✔️ function getData(): string { return 'data'; }
```

**Explicit module boundary types** — exported functions must declare return type.

**No inferrable types** — don't annotate what TypeScript can infer:

```ts
❌ const count: number = 5;
✔️ const count = 5;
```

**Use `interface` for object types**, not `type`:

```ts
❌ type User = { name: string; };
✔️ interface User { name: string; }
```

## Code Quality

**No console** — `console.log/error/warn` are forbidden; use a logging service.

**Consistent return** — functions must always return a value or never return one.

**Prefer `const`** — use `const` for variables that are never reassigned.

**No magic numbers** — use named constants. Allowed exceptions: `0`, `1`, `2`, enum values:

```ts
❌ if (users.length > 50) { }
✔️ const maxUsers = 50; if (users.length > maxUsers) { }
```

**Max cyclomatic complexity: 3** — break complex functions into smaller ones.

**Max parameters: 4** — use an object/interface for more than 4 params.

**Prefer readonly** — properties never reassigned after init should be `readonly`.

**No unused variables.**

**No unnecessary conditions** — don't write conditions that are always true/false.

## TypeScript Operators

**Optional chaining** — use `?.` instead of manual null checks:

```ts
❌ const city = user && user.address && user.address.city;
✔️ const city = user?.address?.city;
```

**`includes` instead of `indexOf`:**

```ts
❌ if (array.indexOf(item) !== -1) { }
✔️ if (array.includes(item)) { }
```

**`startsWith` / `endsWith`** instead of `substring` comparisons.

## Type Definitions

**No unnecessary type arguments** — don't pass generics that match the default:

```ts
❌ const subject = new Subject<void>();
✔️ const subject = new Subject();
```

**No duplicate type constituents:**

```ts
❌ type A = string | string;
✔️ type A = string;
```

**No redundant type constituents:**

```ts
❌ type B = string | unknown;  // unknown absorbs everything
✔️ type B = unknown;
```

## Enum Rules

- All enum values must be initialized
- No duplicate values
- No mixing of numeric and string values

```ts
❌ enum Status { Active, Inactive = 1, Pending = 1 }
✔️ enum Status { Active = 0, Inactive = 1, Pending = 2 }
```

## Class Member Ordering

Order: `signature` → `field` → `constructor` → `method`

```ts
✔️
export class UserComponent {
  userId = input.required<number>();
  userName = signal<string>('');
  #isAdmin = false;

  constructor() { }

  loadUser(): void { }
  #handleUserData(user: User): void { }
}
```

## Identifier Length

Minimum 3 characters. Exceptions: `i`, `j`, `k`, `id`, `x`, `y`.

## Angular-Specific ESLint Rules

- **Component selector**: element type, `app-` prefix, kebab-case
- **Directive selector**: attribute type, `app` prefix, camelCase
- **OnPush change detection**: mandatory on all components
- **Lifecycle interfaces**: must be declared if hook is implemented
- **Native control flow**: `@if/@for/@switch` instead of `*ngIf/*ngFor/ngSwitch`
- **Self-closing tags**: use `<app-foo />` not `<app-foo></app-foo>`
- **`NgSrc`**: use `NgOptimizedImage` for static images
- **No interpolation in attributes**: use property binding instead of `{{ }}`
