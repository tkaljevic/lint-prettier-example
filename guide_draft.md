# Code Style Guide

A comprehensive guide to style conventions, best practices, and rules for writing quality Angular/TypeScript code.

---

## Table of Contents

1. [Code Formatting (Prettier)](#code-formatting-prettier)
2. [Code Quality (ESLint)](#code-quality-eslint)
3. [Naming Conventions](#naming-conventions)
4. [Best Practices](#best-practices)
5. [Angular Specifics](#angular-specifics)

---

## Code Formatting (Prettier)

### Basic Rules

- **Maximum line length**: 120 characters
- **Quotes**: Single quotes (`'`) instead of double quotes (`"`)
- **Indentation**: Spaces (2 spaces indentation)
- **Semicolons**: Always at the end of statements (`;`)
- **Trailing commas**: Don't use it.
- **Arrow functions**: Always use parentheses around parameters `(param) => {}`
- **Spacing**: Spaces between brackets in objects `{ foo: bar }`
- **JSX/HTML closing bracket**: On a new line

### Import Organization

Automatically organized imports with clear separation:

```ts
// First external packages
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

// Then relative imports
import { UserService } from './user.service';
import { User } from '../models/user.model';
```

### HTML Template Formatting

For Angular template files, the Angular parser is used which understands Angular-specific syntax.

---

## Code Quality (ESLint)

### TypeScript Basics

#### Typing

**Forbidden use of `any` type**

```ts
❌ Bad
user: any;

✔️ Good
user: User;
// or if type is unknown:
data: unknown;
```

**Explicit function return types**

All functions must have explicitly specified return type:

```ts
❌ Bad
function getData() {
	return "data";
}

✔️ Good
function getData(): string {
	return "data";
}

function setItem(item: User): void {
	this.item = item;
}
```

**Explicit types for module boundaries**

All exported functions must have explicitly specified return type:

```ts
❌ Bad
export function calculateTotal(items: Item[]) {
	return items.reduce((sum, item) => sum + item.price, 0);
}

✔️ Good
export function calculateTotal(items: Item[]): number {
	return items.reduce((sum, item) => sum + item.price, 0);
}
```

**Don't use inferrable types**

```ts
❌ Bad
const count: number = 5;
const name: string = "John";

✔️ Good
const count = 5;
const name = "John";
```

#### Code Quality Rules

**Consistent return values**

Functions must always either return a value or never:

```ts
❌ Bad
function foo(x: boolean) {
	if (x) {
		return 1;
	}
	// no return
}

✔️ Good
function bar(x: boolean): number {
	if (x) {
		return 1;
	}
	return 0;
}
```

**Prefer const**

Use `const` for variables that are never reassigned:

```ts
❌ Bad
let maxCount = 100;

✔️ Good
const maxCount = 100;
```

**Magic numbers**

Avoid "magic numbers", use named constants (except 0, 1, 2 and enum values):

```ts
❌ Bad
if (users.length > 50) { ... }

✔️ Good
const maxUsers = 50;
if (users.length > maxUsers) { ... }
```

**Function complexity**

Maximum cyclomatic complexity: 3

```ts
❌ Bad
function process(data: Data): void {
	if (...) {
		if (...) {
			if (...) {
				if (...) {
					// too many nested ifs
				}
			}
		}
	}
}

✔️ Good
// Break into smaller functions
```

**Maximum number of parameters**

Functions can have a maximum of 4 parameters:

```ts
❌ Bad
function create(name: string, age: number, email: string, phone: string, address: string): User { ... }

✔️ Good
interface CreateUserDto {
	name: string;
	age: number;
	email: string;
	phone: string;
	address: string;
}

function create(userData: CreateUserDto): User { ... }
```

**Prefer readonly**

Use `readonly` for variables that are never changed after initialization:

```ts
✔️ Good
class UserService {
	#apiUrl = 'https://api.example.com';
	#http = inject(HttpClient);
}
```

#### TypeScript Operators

**Optional chaining**

Use optional chaining wherever possible:

```ts
❌ Bad
const city = user && user.address && user.address.city;

✔️ Good
const city = user?.address?.city;
```

**Includes instead of indexOf**

```ts
❌ Bad
if (array.indexOf(item) !== -1) { ... }

✔️ Good
if (array.includes(item)) { ... }
```

**StartsWith / EndsWith**

```ts
❌ Bad
if (str.substring(0, 3) === 'foo') { ... }

✔️ Good
if (str.startsWith('foo')) { ... }
```

#### Type Definitions

**Use interface for object types**

```ts
❌ Bad
type User = {
	name: string;
	age: number;
};

✔️ Good
interface User {
	name: string;
	age: number;
}
```

**Enum rules**

- All enum values must be initialized
- No duplicate values
- No mixing of numeric and string enum values

```ts
❌ Bad
enum Status {
	Active,      // missing initialization
	Inactive = 1,
	Pending = 1  // duplicate
}

✔️ Good
enum Status {
	Active = 0,
	Inactive = 1,
	Pending = 2
}
```

#### Class Member Organization

Order of class members:

1. Signature
2. Fields (properties)
3. Constructor
4. Methods

```ts
✔️ Good
export class UserComponent {
	// 1. ClassProperties
	userId = input.required<number>();  // public input
	userName = signal<string>('');  // public signal
	#isAdmin = false;

	// 2. Constructor
	constructor() { }

	// 3. Methods
	loadUser(): void { ... }  // public - no keyword
	#handleUserData(user: User): void { ... }  // private - # prefix
}

❌ Bad
export class UserComponent {
	// 1. ClassProperties
	userName = signal<string>('');  // public signal

	// 2. Constructor
	constructor() { }
	userId = input.required<number>();  // public input

	// 3. Methods
	loadUser(): void { ... }  // public - no keyword
	#isAdmin = false;
	#handleUserData(user: User): void { ... }  // private - # prefix
}
```

---

## Naming Conventions

### Folders and Files

**Kebab-case convention** for all folders and files:

```
❌ Bad
userService/
UserComponents/
app Modules/

✔️ Good
user-services/
user-components/
app-modules/
```

**Files with type**

```
❌ Bad
auth.ts
UserProfile.ts

✔️ Good
auth.service.ts
user-profile.component.ts
admin-user.model.ts
move-direction.enum.ts
api-routes.const.ts
```

### Models Organization

**Models must be organized in separate files within a `models/` folder, grouped by meaning:**

**File organization:**

- If model/enum is small and used only within another model (and not exported), it can be in the same file.
- Larger models and enums should be in separate files.

```
src/
├── models/
│   ├── index.ts           // Main export - exports from all groups
│   ├── users/
│   │   ├── index.ts       // Export all user-related models
│   │   ├── user.model.ts
│   │   ├── create-user-dto.model.ts
│   │   └── update-user-dto.model.ts
│   ├── orders/
│   │   ├── index.ts       // Export all order-related models
│   │   ├── order.model.ts
│   │   └── order-item.model.ts
│   └── forms/
│       ├── index.ts       // Export all form-related models
│       ├── user-form.model.ts
│       └── login-form.model.ts
└── components/
    └── user-list/
        └── user-list.component.ts
```

**Group models by domain/feature:**

- `users/` - All user-related interfaces (User, CreateUserDto, UpdateUserDto)
- `orders/` - All order-related interfaces (Order, OrderItem, OrderStatus)
- `forms/` - All form-related interfaces (UserForm, LoginForm, etc.)
- `shared/` - Common interfaces used across multiple domains

**Each model = One file:**

```ts
✔️ Good (users/user.model.ts) - Only User interface
export interface User {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
}
```

```ts
✔️ Good (users/create-user-dto.model.ts) - Only CreateUserDto
export interface CreateUserDto {
	firstName: string;
	lastName: string;
	email: string;
}
```

```ts
✔️ Good (users/update-user-dto.model.ts) - Only UpdateUserDto
// Import from same group
import { CreateUserDto } from './create-user-dto.model';

export interface UpdateUserDto extends Partial<CreateUserDto> {
	id: number;
}
```

**Export through group index.ts:**

```ts
✔️ Good (users/index.ts)
export * from './user.model';
export * from './create-user-dto.model';
export * from './update-user-dto.model';
```

```ts
✔️ Good (forms/index.ts)
export * from './user-form.model';
export * from './login-form.model';
```

**Main index exports from all groups:**

```ts
✔️ Good (models/index.ts)
export * from './users';
export * from './orders';
export * from './forms';
export * from './shared';
```

**Import models - multiple ways:**

```ts
✔️ Good (components/user-list.component.ts)
// From main models index (most common)
import { User, CreateUserDto } from '../models';

// From specific group
import { User, CreateUserDto } from '../models/users';

// From specific file (when needed)
import { User } from '../models/users/user.model';
```

❌ **Never define models inline in components or services:**

```ts
❌ Bad (user-list.component.ts)
export class UserListComponent {
	// Don't define interfaces here!
	interface User {
		id: number;
		name: string;
	}
}
```

### URLs

All URLs use **kebab-case**:

```
❌ Bad
/userProfile/settings
/product details/overview

✔️ Good
/user-profile/settings
/product-details/overview
```

### Components

**PascalCase** for component names:

```ts
❌ Bad
class userProfileComponent { }
class UsrPrflCmp { }

✔️ Good
class UserProfileComponent { }
class OrderSummaryComponent { }
```

### Services

Every service name must include a suffix that reflects its type:

#### Facade Services

```ts
@Injectable({ providedIn: 'root' })
export class UserFacadeService {}
```

#### Specialized Services (for Client Apps)

- **State**: `UserStateService`, `ProductStateService`
- **Form**: `UserFormService`, `OrderFormService`
- **Utility**: `DateUtilityService`, `ValidationUtilityService`
- **HTTP**: `UserHttpService`, `ProductHttpService`

⚠️ **Never mix logic!** HTTP calls in HTTP service, general logic in Utility service.

#### Documentation for Public Services and Methods

**All public services and their public methods must be documented** with JSDoc comments that are rich enough for another developer to fully understand the purpose, behavior, and usage without reading the implementation.

A good service comment goes well beyond a one-liner. It should explain:

- What the service does and why it exists
- Key features or behaviors worth calling out
- How to set it up or use it (with a concrete example)
- Any important caveats, performance considerations, or design decisions

```ts
❌ Bad
@Injectable({ providedIn: 'root' })
export class SessionService {
	showPopup(): void { }
	extendSession(): void { }
}

✔️ Good
/**
 * Manages user session lifecycle, including activity tracking and expiry warnings.
 *
 * This service monitors user inactivity and shows a warning popup before the session
 * expires, giving the user the option to extend. If no action is taken, the user is
 * automatically logged out when the timer reaches zero.
 *
 * **Key Features:**
 * - Configurable activity window and popup timing via session constants
 * - Cross-tab synchronization: extending the session in one tab dismisses popups
 *   and resets timers in all other open tabs
 * - Only one popup is shown at a time; subsequent calls dismiss the previous one
 *
 * **Usage:**
 * This service is initialized automatically. No manual setup is required beyond
 * including it in the root providers.
 *
 * @see {@link sessionPopupBeforeEnd} for popup timing configuration
 * @see {@link sessionActivityWindowBeforeEnd} for activity window configuration
 */
@Injectable({ providedIn: 'root' })
export class SessionService {

	/**
	 * Displays a session expiry warning snackbar with an "Extend session" action.
	 *
	 * Called automatically when the time remaining reaches the configured threshold
	 * ({@link sessionPopupBeforeEnd}). The popup informs the user that their session
	 * will expire in one minute and provides a single action to extend it.
	 *
	 * **Behavior:**
	 * - If a popup is already visible, it is dismissed before showing the new one
	 * - Clicking "Extend session" calls {@link extendSession} and dismisses the snackbar
	 * - Ignoring the popup results in automatic logout when the timer expires
	 *
	 * @internal Should not be called manually — triggered by the session timer
	 */
	showPopup(): void { }

	/**
	 * Extends the current session by the full session duration and notifies other tabs.
	 *
	 * Resets the expiry timer and broadcasts the new expiry timestamp via BroadcastChannel,
	 * so all other open tabs can dismiss their popups and sync their timers accordingly.
	 *
	 * @returns Observable<void> that completes once the session has been extended on the server
	 * @throws HttpErrorResponse if the session extension request fails
	 */
	extendSession(): Observable<void> { }
}
```

**Service-level comment should include:**

- **What it does** — overall responsibility in 1–2 sentences
- **Key Features** — bullet list of notable behaviors
- **Usage** — how to set it up or get started (with `@example` or prose)
- **Important caveats** — performance, zone behavior, cross-tab effects, etc.
- **`@see` references** — link to related services, constants, or config

**Method-level comment should include:**

- **What it does** — clear description of the operation
- **Behavior** — notable side effects, edge cases, sequencing
- **`@param`** — each parameter with purpose and expected values
- **`@returns`** — what is returned and in what shape
- **`@throws`** — documented error cases
- **`@internal`** — if the method should not be called manually

#### Documentation for Constants, Config Files, and Models

**Even a file with a single exported constant deserves a full comment** if that value has non-obvious behavior or interacts with other parts of the system. The comment should make it possible to understand the value's role, timing, and consequences without searching through the codebase.

````ts
❌ Bad
export const sessionPopupBeforeEnd = 60 * 1000;

✔️ Good
/**
 * Time (in milliseconds) before session expiry when the warning popup is displayed.
 *
 * When this threshold is reached without detected user activity during the activity
 * window, a snackbar notification appears warning the user that their session will
 * expire soon and providing an "Extend session" action button.
 *
 * **Session Timeline:**
 * ```
 * [Session Start] ──────────────────────────────► [Session Expires]
 *                            ▲                 ▲
 *                            │                 └─ Popup appears (1 min before expiry)
 *                            └─ Activity window starts (2 min before expiry)
 *
 * User has no activity during the 2-minute window:
 * ├─ 2 min before: Activity tracking starts
 * ├─ 1 min before: ⚠️ Popup shows "Session expires in one minute"
 * └─ 0 min: Auto-logout if no action taken
 * ```
 *
 * **Popup Behavior:**
 * - Displays a warning message: "Session expires in one minute"
 * - Provides an action button: "Extend session"
 * - Clicking "Extend session" → extends session by the full session duration
 * - Ignoring the popup → automatic logout when timer reaches zero
 * - Only one popup is shown at a time
 *
 * **Cross-Tab Synchronization:**
 * If the user extends the session in one tab, all other open tabs automatically
 * dismiss their popups and reset their timers to the new expiry time.
 *
 * **Interaction with Other Constants:**
 * - Must be **less than** {@link sessionActivityWindowBeforeEnd}
 * - The gap between them determines how long activity is tracked before the popup appears
 *
 * @default 1 minute (60_000 ms)
 * @see {@link SessionService.showPopup} for popup implementation
 */
export const sessionPopupBeforeEnd = 60 * 1000; // 1 minute
````

The same principle applies to model properties. If a field has a non-obvious constraint, relationship, or business meaning, add a JSDoc comment above it:

```ts
❌ Bad
export interface UserSession {
	expiresAt: number;
	activityWindowStart: number;
}

✔️ Good
export interface UserSession {
	/**
	 * Unix timestamp (ms) when the session expires.
	 * Used to calculate remaining time and schedule the expiry popup.
	 */
	expiresAt: number;

	/**
	 * Unix timestamp (ms) marking the start of the inactivity detection window.
	 * Activity detected after this point resets the expiry timer.
	 * Must always be earlier than {@link expiresAt}.
	 */
	activityWindowStart: number;
}
```

**When to document:**

- ✅ All public services (class-level JSDoc)
- ✅ All public methods in services
- ✅ Constants with non-obvious values or system-wide effects
- ✅ Model properties with business rules, constraints, or relationships
- ✅ Config files and tokens
- ❌ Private methods (optional — only if logic is non-trivial)
- ❌ Simple getters/setters with self-evident names

### Methods in Services

Methods must be clear and without repeating entity name:

```ts
❌ Bad (in UserService)
getUserData(): Observable<User> { }
updateUserProfile(): Observable<User> { }
deleteUserAccount(): void { }

✔️ Good (in UserHttpService)
fetchData(): Observable<User> { }
updateProfile(data: User): Observable<User> { }
deleteAccount(id: number): void { }
```

**Avoid generic method names** - method names must be descriptive and self-explanatory. Generic verbs like `check`, `process`, `handle`, or `do` without context are unclear and make code harder to understand.

```ts
❌ Bad
// In PendingService
check(): boolean { } // Check what?
process(): void { } // Process what?
get(): Observable<any> { } // Get what?

✔️ Good
// In PendingService
hasPendingTasks(): boolean { }
checkIfThereArePendingTasks(): boolean { }
processPendingOrders(): void { }
getPendingTaskCount(): Observable<number> { }
```

**Why this matters:**

- Other developers should immediately understand what a method does without reading its implementation
- Self-documenting code reduces the need for comments
- Makes code reviews and maintenance significantly easier

### Variables, Properties and Methods

**camelCase** for all:

```ts
❌ Bad
let last_login-time = null;
const MAX_count = 100;

✔️ Good
let lastLoginTime = null;
const maxCount = 100;
```

**Minimum identifier length** (applies to both TypeScript and HTML templates):

All variable, function, and parameter names must be at least 3 characters long to ensure clarity and readability.

```ts
❌ Bad
const t = 5;
const xy = "test";
let ab: User;
function fn(a: number, b: string): void { }

✔️ Good
const total = 5;
const userName = "test";
let activeUser: User;
function formatName(age: number, name: string): void { }

// Exceptions are allowed for common conventions:
for (let i = 0; i < 10; i++) { } // i, j, k in loops
const id = user.id; // id for identifiers
const x = point.x; // x, y for coordinates
callback prefixed with 'fn' // for functions
```

### Observables and Subscriptions

Always use `$` suffix:

```ts
❌ Bad
#users: Observable<User[]>;
#subscription: Subscription;

✔️ Good
#users$: Observable<User[]>;
#subscription$: Subscription;
```

### Methods that Respond to UI Actions

Use **on** prefix:

```html
❌ Bad
<button (click)="save()">Save</button>

✔️ Good
<button (click)="onSave()">Save</button>
```

```ts
✔️ Good
public onSave(): void {
	this.saveData();
}

private saveData(): void {
	// logic
}
```

### Handler Methods (Subscription Callbacks)

Use **handle** prefix:

```ts
❌ Bad
private getUsers(): void {
	this.userHttpService.fetchUsers()
		.subscribe(users => {
			// handling logic here
		});
}

✔️ Good
private getUsers(): void {
	this.userHttpService.fetchUsers()
		.subscribe(this.handleUsers);
}

private handleUsers = (users: User[]): void => {
	// handling logic here
}
```

---

## Best Practices

### Avoid `any` Type

```ts
❌ Bad
class UserProfileComponent {
	user: any;
	admin: any;
}

✔️ Good
class UserProfileComponent {
	user: User;
	admin: Admin;
}
```

If type is unknown, use `unknown` instead of `any`.

### Don't Write Logic Directly in Lifecycle Hooks

```ts
❌ Bad
export class UserProfileComponent implements OnInit {
	ngOnInit(): void {
		this.userService.getUserData().subscribe(user => {
			// data processing...
		});
	}
}

✔️ Good
export class UserProfileComponent implements OnInit {
	ngOnInit(): void {
		this.initUserData();
	}

	#initUserData(): void {
		this.userService.getUserData().subscribe(user => {
			// data processing...
		});
	}
}
```

### OnPush Change Detection

Always use `OnPush` strategy:

```ts
❌ Bad
@Component({
	selector: 'app-header',
	templateUrl: './header.component.html'
})
export class HeaderComponent {
	users: User[];
}
```

```ts
✔️ Good
@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
	users$ = new BehaviorSubject<User[]>([]);
	// or even better:
	users = signal<User[]>([]);
}
```

### Use Signals

Prefer signals over observables for template rendering:

```ts
✔️ Good
@Component({
	selector: 'app-users',
	template: '<div>{{ users() }}</div>',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UsersComponent {
	users = signal<User[]>([]);
}
```

### Keep Methods Small

```ts
❌ Bad
// One huge method that does everything

✔️ Good
// Break into smaller, focused methods
// If component becomes too large, consider Facade pattern
```

### Clear Encapsulation

**Accessibility Rules:**

- **Public**: No keyword (nothing before the name)
- **Protected**: Use `protected` keyword (for template-accessible members in components)
- **Private**: Use `#` prefix, NO `private` keyword

```ts
❌ Bad
export class ExampleComponent {
	loginForm: FormGroup;  // unclear
	private users: User[];  // don't use 'private' keyword
}

✔️ Good
export class ExampleComponent {
	loginForm: FormGroup;  // public (no keyword)
	#users: User[];  // private (# prefix)
}
```

#### Encapsulation Rules by Context

**Services:**

- Public methods/properties: NO keyword (accessible from outside)
- Private implementation: `#` prefix

```ts
✔️ Good
export class UserHttpService {
	// Public API - no keyword
	fetchUsers(): Observable<User[]> {
		return this.http.get<User[]>(this.#buildUrl());
	}

	// Private implementation - # prefix
	#apiUrl = 'https://api.example.com/users';
	#http = inject(HttpClient);

	#buildUrl(): string {
		return `${this.#apiUrl}/list`;
	}
}
```

**Components:**

- Template-accessible: Use `protected` keyword
- Internal only: Use `#` prefix
- Public (rare): No keyword

```ts
✔️ Good
@Component({
	selector: 'app-user-list',
	template: `
		<div>{{ userName() }}</div>
		<button (click)="onLoadUsers()">Load</button>
	`
})
export class UserListComponent {
	// Protected - used in template
	protected userName = signal<string>('');

	// Protected - called from template
	protected onLoadUsers(): void {
		this.#fetchAndProcessUsers();
	}

	// Private - internal only, # prefix
	#userService = inject(UserService);

	#fetchAndProcessUsers(): void {
		// internal logic
	}
}
```

**Why use `#` for private?**

- JavaScript private fields (`#`) provide true privacy at runtime
- Cannot be accessed even via bracket notation or reflection
- Enforced by the JavaScript engine, not just TypeScript compiler
- Cleaner than `private` keyword

#### Type Safety in HTTP Methods

When using HTTP service methods (get, post, put, patch, delete), **always specify the generic type explicitly**. This ensures proper type inference in subscription callbacks and prevents implicit `any` types.

```ts
❌ Bad
// Without type parameter - results in 'any' type
this.#backendService.get('users').subscribe((users) => {
	// users is 'any' - no type safety!
	console.log(users);
});

✔️ Good
// With explicit type parameter - proper type inference
this.#backendService.get<User[]>('users').subscribe((users) => {
	// users is User[] - fully typed!
	console.log(users);
});

// Also applies to other HTTP methods
this.#backendService.post<User>('users', userData).subscribe((user) => {
	// user is User
});

this.#backendService.put<User>(`users/${id}`, userData).subscribe((user) => {
	// user is User
});
```

**Why this matters:**

- Without the generic type, the return type defaults to `any`, bypassing all type checking
- Explicit typing provides autocomplete and compile-time error detection
- Makes the codebase more maintainable and self-documenting

### Order in Class

```ts
✔️ Good
export class ExampleComponent {
	// 1. Dependencies (if any)

	#userService = inject(UserService);

	// 2. Angular stuff (if any)
	userId = input.required<number>();

	// 3. Public properties (no keyword in services, `protected` in components)
	protected loginForm!: FormGroup;
	protected users: User[] = [];

	// 4. Private properties (# prefix)
	#adminUsers: User[] = [];

	// 5. Constructor
	constructor() { }

	// 6. Lifecycle hooks in components

	ngOnInit(): void {
		this.#initForm();
	}

	// 7. Public methods (no keyword in service, `protected` in components)
	protected getUsers(): void { }

	// 8. Private methods (# prefix)
	#initForm(): void { }
}

```

### Use Regions

**Always use regions with proper spacing:**

- Add empty line **after** `// #region`
- Add empty line **before** `// #endregion`

The order of regions is mandatory for components. Use the following template as a reference:

```ts
class MyComponent {
	// #region Dependencies

	#userService = inject(UserService);

	// #endregion

	// #region Angular stuff

	userId = input.required<number>();
	userChanged = output<User>();

	// #endregion

	// #region Class properties

	protected users = signal<User[]>([]);
	#isLoading = signal<boolean>(false);

	// #endregion

	constructor() {}

	// #region Lifecycle hooks

	ngOnInit(): void {
		this.#initUsers();
	}

	// #endregion

	// #region Init

	#initUsers(): void {}

	// #endregion

	// #region UI Responses

	protected onSave(): void {}

	// #endregion

	// #region Handlers

	#handleUsers = (users: User[]): void => {};

	// #endregion

	// #region Utility

	#formatUserName(user: User): string {}

	// #endregion
}
```

For Services, use regions as well, but naming them is flexible — the goal is simply to group related methods together. For example:

- Validators
- Event handlers
- General auth methods

### Reactive Forms with Types

Typed forms are encouraged but not required. Reactive forms, however, are mandatory — template-driven forms should not be used.

```ts
✔️ Good
const login = new FormGroup({
	email: new FormControl(''),
	password: new FormControl('')
});

✔️ Good
interface LoginForm {
	email: FormControl<string>;
	password: FormControl<string>;
}

const login = new FormGroup<LoginForm>({
	email: new FormControl('', { nonNullable: true }),
	password: new FormControl('', { nonNullable: true })
});

❌ Bad
<input [(ngModel)]="email" />
```

### Always Unsubscribe

```ts
✔️ Good
export class AppComponent {
	#destroyRef = inject(DestroyRef);
	#http = inject(HttpClient);

	constructor() {
		this.#http
			.get('api/user')
			.pipe(takeUntilDestroyed(this.#destroyRef))
			.subscribe();
	}
}
```

### Avoid Nested Subscriptions

```ts
❌ Bad
this.userService.getUser().subscribe(user => {
	this.orderService.getOrders(user.id).subscribe(orders => {
		this.productService.getProducts(orders).subscribe(products => {
			// products
		});
	});
});

✔️ Good
this.userService
	.getUser()
	.pipe(
		switchMap(user => this.orderService.getOrders(user.id)),
		switchMap(orders => this.productService.getProducts(orders))
	)
	.subscribe(products => {
		// products
	});
```

### Don't Hardcode Values

```ts
❌ Bad
export class UserService {
	#apiUrl = 'https://api.example.com/users';  // hardcoded
	#localStorageKey = 'user_data';  // hardcoded
}

✔️ Good
enum ApiPaths {
	Users = 'https://api.example.com/users'
}

enum LocalStorageKeys {
	UserData = 'user_data'
}

export class UserService {
	#apiUrl = ApiPaths.Users;
	#localStorageKey = LocalStorageKeys.UserData;
}
```

### Models and Enums

**Use Interface for models, not Class:**

```ts
❌ Bad
export class User {
	name: string;
	email: string;
}

✔️ Good
export interface User {
	name: string;
	email: string;
}
```

---

## Angular Specifics

### Components

**Always use standalone components:**

```ts
✔️ Good
@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileComponent { }
```

⚠️ **Don't set `standalone: true`** - it's the default in Angular v20+

### Input/Output

Use functions instead of decorators:

```ts
❌ Bad
@Input() userId!: number;
@Output() userChanged = new EventEmitter<User>();

✔️ Good
userId = input.required<number>();
userChanged = output<User>();
```

### Host Bindings

```ts
❌ Bad
@HostBinding('class.active') isActive = true;
@HostListener('click', ['$event'])
onClick(event: Event): void { }

✔️ Good
@Component({
	selector: 'app-button',
	host: {
		'[class.active]': 'isActive',
		'(click)': 'onClick($event)'
	}
})
export class ButtonComponent {
	isActive = true;
	onClick(event: Event): void { }
}
```

### Dependency Injection

Use `inject()` function instead of constructor injection:

```ts
❌ Bad
constructor(
	#userService: UserService,
	#router: Router
) { }

✔️ Good
#userService = inject(UserService);
#router = inject(Router);
```

### Guards and Interceptors

Guards and interceptors must be written as functions, not classes:

```ts
❌ Bad
@Injectable()
export class AuthGuard implements CanActivate {
	canActivate(): boolean {
		// ...
	}
}

✔️ Good
export const authGuard: CanActivateFn = () => {
	// ...
};
```

```ts
❌ Bad
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		// ...
	}
}

✔️ Good
export const authInterceptor: HttpInterceptorFn = (req, next) => {
	// ...
};
```

### Deferrable Views

Use `@defer` to lazily load non-critical parts of the template. This improves initial load performance by deferring the rendering and bundle loading of heavy or below-the-fold content until it is actually needed.

```html
❌ Bad
<!-- Heavy component always rendered and included in the initial bundle -->
<app-analytics-dashboard />
<app-comments-section />

✔️ Good
<!-- Loaded and rendered only when the element enters the viewport -->
@defer (on viewport) {
<app-analytics-dashboard />
} @placeholder {
<div class="skeleton"></div>
}

<!-- Loaded after the browser becomes idle -->
@defer (on idle) {
<app-comments-section />
}
```

**When to use `@defer`:**

- Heavy components not needed on initial render (charts, rich text editors, modals)
- Below-the-fold content (sections the user has to scroll to)
- Features used only by a subset of users (admin panels, advanced settings)
- Any component that can be loaded after the page is interactive without affecting UX

**Available triggers:**

- `on idle` — defers until the browser is idle
- `on viewport` — defers until the element enters the viewport
- `on interaction` — defers until the user interacts with the placeholder
- `on hover` — defers until the user hovers over the placeholder
- `when <condition>` — defers until a boolean expression becomes true

**Use `@placeholder` and `@loading` to avoid layout shifts:**

```html
@defer (on viewport) {
<app-heavy-chart />
} @placeholder (minimum 100ms) {
<div class="chart-skeleton"></div>
} @loading (minimum 200ms) {
<app-spinner />
} @error {
<p>Failed to load chart.</p>
}
```

### Pure Pipes Over Method Calls in Templates

Avoid calling methods directly in templates for data transformations. Angular re-evaluates every method call in the template on each change detection cycle, even if the input hasn't changed. Pure pipes are memoized — they only re-execute when their input changes.

```html
❌ Bad
<!-- getFullName() is called on every change detection cycle -->
<p>{{ getFullName(user) }}</p>
<li *ngFor="let item of getFilteredItems(items)">{{ item.name }}</li>
```

```ts
❌ Bad
getFullName(user: User): string {
	return `${user.firstName} ${user.lastName}`;
}

getFilteredItems(items: Item[]): Item[] {
	return items.filter(item => item.active);
}
```

```ts
✔️ Good
@Pipe({ name: 'fullName', pure: true, standalone: true })
export class FullNamePipe implements PipeTransform {
	transform(user: User): string {
		return `${user.firstName} ${user.lastName}`;
	}
}

@Pipe({ name: 'activeItems', pure: true, standalone: true })
export class ActiveItemsPipe implements PipeTransform {
	transform(items: Item[]): Item[] {
		return items.filter(item => item.active);
	}
}
```

```html
✔️ Good
<p>{{ user | fullName }}</p>
<li *ngFor="let item of items | activeItems">{{ item.name }}</li>
```

Pure pipes are the default — omitting `pure: true` is fine since it's already the default value. Only use `pure: false` when the transformation depends on external mutable state, and do so sparingly as it removes the memoization benefit.

### Templates

**Native control flow instead of structural directives:**

```html
❌ Bad
<div *ngIf="user">{{ user.name }}</div>
<div *ngFor="let item of items">{{ item }}</div>
<div [ngSwitch]="status">
	<div *ngSwitchCase="'active'">Active</div>
</div>

✔️ Good @if (user) {
<div>{{ user.name }}</div>
} @for (item of items; track item.id) {
<div>{{ item }}</div>
} @switch (status) { @case ('active') {
<div>Active</div>
} }
```

**Don't use ngClass/ngStyle:**

```html
❌ Bad
<div [ngClass]="{ 'active': isActive }"></div>
<div [ngStyle]="{ 'color': color }"></div>

✔️ Good
<div [class.active]="isActive"></div>
<div [style.color]="color"></div>
```

**Avoid arrow functions in templates:**

```html
❌ Bad
<button (click)="items.filter(i => i.active)">Filter</button>

✔️ Good
<button (click)="onFilter()">Filter</button>
```

```ts
// In component
public onFilter(): void {
	this.filteredItems = this.items.filter(i => i.active);
}
```

### Images

Use `NgOptimizedImage` for static images:

```html
✔️ Good <img ngSrc="assets/logo.png" width="200" height="100" alt="Logo" />
```

⚠️ Doesn't work for inline base64 images.

### Lifecycle Interfaces

If you use a lifecycle hook, you must implement the interface:

```ts
❌ Bad
export class MyComponent {
	ngOnInit(): void { }
}

✔️ Good
export class MyComponent implements OnInit {
	ngOnInit(): void { }
}
```

### Accessibility

- Must pass all **AXE** checks
- Must follow **WCAG AA** minimum
- Focus management
- Color contrast
- ARIA attributes

```html
✔️ Good
<button
	(click)="onSave()"
	(keydown.enter)="onSave()"
	[attr.aria-label]="'Save user data'"
	[attr.aria-disabled]="isDisabled"
>
	Save
</button>
```

### Template Accessibility Rules

```html
✔️ Good
<!-- Interactive elements must support keyboard -->
<div (click)="onClick()" (keydown.enter)="onClick()" tabindex="0">Click me</div>

<!-- Valid ARIA attributes -->
<div role="button" [attr.aria-pressed]="isPressed">Toggle</div>

<!-- Self-closing tags where possible -->
<img src="logo.png" alt="Logo" />
<br />
```

---

## Conclusion

This guide combines:

- **Prettier** rules for consistent formatting
- **ESLint** rules for code quality and safety
- **Best practices** for maintainable and scalable code
- **Angular** specific conventions for modern Angular applications

Following these rules ensures:

- ✅ Consistent code across the project
- ✅ Easier maintenance and readability
- ✅ Fewer errors and bugs
- ✅ Better team collaboration
- ✅ More accessible applications (accessibility)

**Happy coding! 🚀**
