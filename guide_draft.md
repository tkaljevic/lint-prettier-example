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

- **Maximum line length**: 80 characters
- **Quotes**: Single quotes (`'`) instead of double quotes (`"`)
- **Indentation**: Tabs (tab width: 2)
- **Semicolons**: Always at the end of statements (`;`)
- **Trailing commas**: Always where valid (objects, arrays, etc.)
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
let MAX_COUNT = 100;

✔️ Good
const MAX_COUNT = 100;
```

**Magic numbers**

Avoid "magic numbers", use named constants (except 0, 1, 2 and enum values):

```ts
❌ Bad
if (users.length > 50) { ... }

✔️ Good
const MAX_USERS = 50;
if (users.length > MAX_USERS) { ... }
```

**Function complexity**

Maximum cyclomatic complexity: 10

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

**Nullish coalescing**

Prefer `??` operator instead of `||`:

```ts
❌ Bad
const value = input || 'default';

✔️ Good
const value = input ?? 'default';
```

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
	// 1. Fields
	#userService = inject(UserService);
	userId = input.required<number>();  // public input
	userName = signal<string>('');  // public signal

	// 2. Constructor
	constructor() { }

	// 3. Methods
	loadUser(): void { ... }  // public - no keyword
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

Every service must have a type in its name:

#### Core Services

```ts
@Injectable({ providedIn: 'root' })
export abstract class CoreApiService {}
```

#### Facade Services

```ts
@Injectable({ providedIn: 'root' })
export class UserFacadeService {}
```

#### Specialized Services

- **State**: `UserStateService`, `ProductStateService`
- **Form**: `UserFormService`, `OrderFormService`
- **Utility**: `DateUtilityService`, `ValidationUtilityService`
- **HTTP**: `UserHttpService`, `ProductHttpService`

⚠️ **Never mix logic!** HTTP calls in HTTP service, general logic in Utility service.

#### Documentation for Public Services and Methods

**All public services and their public methods must be documented** with clear JSDoc comments. This helps other developers understand the purpose, parameters, return values, and usage patterns without diving into implementation details.

````ts
❌ Bad
@Injectable({ providedIn: 'root' })
export class UserHttpService {
	fetchUsers(): Observable<User[]> {
		return this.#http.get<User[]>(this.#apiUrl);
	}

	updateProfile(id: number, data: User): Observable<User> {
		return this.#http.put<User>(`${this.#apiUrl}/${id}`, data);
	}
}

✔️ Good
/**
 * Service responsible for handling all user-related HTTP operations.
 * Provides methods for fetching, creating, updating, and deleting user data.
 *
 * @example
 * ```ts
 * constructor() {
 *   this.userHttpService.fetchUsers().subscribe(users => {
 *     console.log(users);
 *   });
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class UserHttpService {
	/**
	 * Fetches all users from the API.
	 *
	 * @returns Observable<User[]> Stream of all users
	 * @example
	 * this.fetchUsers().subscribe(users => console.log(users));
	 */
	fetchUsers(): Observable<User[]> {
		return this.#http.get<User[]>(this.#apiUrl);
	}

	/**
	 * Updates user profile information.
	 *
	 * @param id - The unique identifier of the user to update
	 * @param data - Updated user data conforming to User interface
	 * @returns Observable<User> Stream containing the updated user object
	 * @throws HttpErrorResponse if the user is not found or validation fails
	 * @example
	 * const updatedData = { name: 'John Doe', email: 'john@example.com' };
	 * this.updateProfile(123, updatedData).subscribe(user => console.log(user));
	 */
	updateProfile(id: number, data: User): Observable<User> {
		return this.#http.put<User>(`${this.#apiUrl}/${id}`, data);
	}
}
````

**Documentation guidelines:**

- **Service level**: Explain the overall purpose and responsibility of the service
- **Method level**: Document what the method does, all parameters, return values, and potential errors
- **Examples**: Provide usage examples for complex methods
- **Parameters**: Describe each parameter's purpose and expected type
- **Return values**: Explain what is returned and in what format
- **Error cases**: Document potential errors or exceptions that can be thrown

**When to document:**

- ✅ All public services (class-level JSDoc)
- ✅ All public methods in services
- ✅ Complex utility methods
- ❌ Private methods (optional - only if very complex)
- ❌ Simple getters/setters

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
	// 1. Angular decorators (@Input, @Output, @ViewChild)
	@Input() userId!: number;

	// 2. Public properties (no keyword)
	loginForm!: FormGroup;
	users: User[] = [];

	// 3. Private properties (# prefix)
	#adminUsers: User[] = [];
	#unsubscribe$ = new Subject<void>();

	// 4. Constructor
	constructor() { }

	// 5. Public methods (no keyword)
	getUsers(): void { }

	// 6. Private methods (# prefix)
	#initForm(): void { }
}
```

### Use Regions

**Always use regions with proper spacing:**

- Add empty line **after** `// #region`
- Add empty line **before** `// #endregion`

```ts
class SomeGeneralClassName {
	// #region Dependencies

	#userService = inject(UserService);

	// #endregion

	// #region Angular stuff

	@Input() userId!: number;
	@Output() userChanged = new EventEmitter<User>();

	// #endregion

	// #region Class properties

	users = signal<User[]>([]);
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

### Reactive Forms with Types

```ts
❌ Bad
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

**File organization:**

- If model/enum is small and used only within another model, it can be in the same file
- Larger models and enums should be in separate files

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
