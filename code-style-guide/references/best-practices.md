# Best Practices

## Type Safety

Use `unknown` instead of `any` when the type is genuinely unknown. Never use `any`.

## Lifecycle Hooks

Never write logic directly in lifecycle hooks — delegate to private methods:

```ts
❌ ngOnInit(): void { this.userService.getUsers().subscribe(...); }
✔️ ngOnInit(): void { this.#initUsers(); }
   #initUsers(): void { this.userService.getUsers().subscribe(...); }
```

## OnPush Change Detection

Always use `ChangeDetectionStrategy.OnPush` on all components.

## Signals

Prefer signals over plain properties for state that drives template rendering:

```ts
✔️ users = signal<User[]>([]);
```

## Encapsulation

- **Public**: no keyword
- **Protected**: `protected` keyword (only for template-accessible members in components)
- **Private**: `#` prefix — never use the `private` keyword

## Keep Methods Small

Break large methods into smaller, focused private methods. If a component becomes too large, apply the Facade pattern.

## Hardcoded Values

Never hardcode URLs, keys, or magic strings — use enums or constants:

```ts
❌ #apiUrl = 'https://api.example.com/users';
✔️ #apiUrl = ApiPaths.Users;
```

## Subscriptions

Always unsubscribe using `takeUntilDestroyed`:

```ts
#destroyRef = inject(DestroyRef);

constructor() {
  this.#http.get('api/user')
    .pipe(takeUntilDestroyed(this.#destroyRef))
    .subscribe();
}
```

Never nest subscriptions — use `switchMap`, `combineLatest`, or other RxJS operators:

```ts
❌ service1.get().subscribe(a => { service2.get(a).subscribe(b => { }); });
✔️ service1.get().pipe(switchMap(a => service2.get(a))).subscribe(b => { });
```

## Models

Use `interface` for models, never `class`:

```ts
❌ export class User { name: string; }
✔️ export interface User { name: string; }
```

## Order in Class

```ts
export class ExampleComponent {
  // 1. Signal inputs
  userId = input.required<number>();

  // 2. Public properties
  loginForm!: FormGroup;
  users: User[] = [];

  // 3. Private properties (# prefix)
  #adminUsers: User[] = [];

  // 4. Constructor
  constructor() {}

  // 5. Public methods
  getUsers(): void {}

  // 6. Private methods (# prefix)
  #initForm(): void {}
}
```

## Regions

Use `// #region` / `// #endregion` blocks with an empty line after opening and before closing.

Mandatory region order for components:

```ts
// #region Dependencies
// #region Angular stuff (inputs, outputs)
// #region Class properties
// constructor
// #region Lifecycle hooks
// #region Init
// #region UI Responses (on* methods)
// #region Utility
// #region Handlers (handle* methods)
```

For services, region names are flexible — goal is to group related methods.

## Documentation

**All public services and public methods require JSDoc.** Comments must be rich enough to understand purpose, behavior, and usage without reading the implementation.

Service-level JSDoc should include:

- What the service does and why it exists
- Key features (as a bullet list)
- Usage instructions or example
- `@see` references to related services/constants

Method-level JSDoc should include:

- What it does
- `@param` for each parameter
- `@returns` with type and description
- `@throws` for error cases
- `@internal` if not meant to be called manually

**Constants with non-obvious values also require JSDoc** — describe timing, relationships, behavior, and UX considerations.

**Model properties with business constraints or relationships require JSDoc** — explain what the value means and any invariants.

When to document:

- ✅ All public services
- ✅ All public methods in services
- ✅ Constants with system-wide effects
- ✅ Model properties with business rules
- ❌ Private methods (only if logic is non-trivial)
- ❌ Simple getters/setters
