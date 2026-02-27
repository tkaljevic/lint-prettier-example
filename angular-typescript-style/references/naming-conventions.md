# Naming Conventions

This file defines all naming rules for files, folders, classes, methods, variables, and other identifiers in Angular/TypeScript projects.

## Folders and Files

### Folder Names

**Use kebab-case for all folders**

```
❌ Bad
userService/
UserComponents/
app Modules/
dashBoard/

✔️ Good
user-service/
user-components/
app-modules/
dashboard/
```

### File Names

**Use kebab-case with type suffix** for all files

```
❌ Bad
userService.ts
UserProfile.ts
app.ts
AuthGuard.ts

✔️ Good
user.service.ts
user-profile.component.ts
app.component.ts
auth.guard.ts
admin-user.model.ts
move-direction.enum.ts
api-routes.const.ts
```

**Common type suffixes:**

- `.component.ts` - Angular components
- `.service.ts` - Services
- `.model.ts` - Data models / interfaces
- `.enum.ts` - Enumerations
- `.const.ts` - Constants
- `.guard.ts` - Route guards
- `.interceptor.ts` - HTTP interceptors
- `.pipe.ts` - Pipes
- `.directive.ts` - Directives
- `.validator.ts` - Validators
- `.spec.ts` - Test files

## URLs and Routes

**Use kebab-case for all URLs**

```ts
❌ Bad
const routes: Routes = [
	{ path: 'userProfile/settings', component: SettingsComponent },
	{ path: 'product details/overview', component: OverviewComponent },
];

✔️ Good
const routes: Routes = [
	{ path: 'user-profile/settings', component: SettingsComponent },
	{ path: 'product-details/overview', component: OverviewComponent },
];
```

## Components

### Component Class Names

**Use PascalCase with "Component" suffix**

```ts
❌ Bad
class userprofile { }
class UserPrfl { }
class user_profile_component { }

✔️ Good
class UserProfileComponent { }
class OrderSummaryComponent { }
class AdminDashboardComponent { }
```

### Component Selectors

**Use kebab-case with prefix**

```ts
✔️ Good
@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
})
export class UserProfileComponent { }
```

## Services

### Service Class Names

**Use PascalCase with descriptive service type suffix**

Every service must have a type in its name to indicate its responsibility.

#### Core Services

```ts
✔️ Good
@Injectable({ providedIn: 'root' })
export abstract class CoreApiService { }

@Injectable({ providedIn: 'root' })
export abstract class BaseHttpService { }
```

#### Facade Services

```ts
✔️ Good
@Injectable({ providedIn: 'root' })
export class UserFacadeService { }

@Injectable({ providedIn: 'root' })
export class OrderFacadeService { }
```

#### Specialized Services

**State Services:**

```ts
✔️ Good
export class UserStateService { }
export class ProductStateService { }
```

**Form Services:**

```ts
✔️ Good
export class UserFormService { }
export class OrderFormService { }
```

**Utility Services:**

```ts
✔️ Good
export class DateUtilityService { }
export class ValidationUtilityService { }
```

**HTTP Services:**

```ts
✔️ Good
export class UserHttpService { }
export class ProductHttpService { }
```

⚠️ **Never mix logic types!**

- HTTP calls belong in HTTP services
- General utilities belong in Utility services
- State management belongs in State services

### Service Method Names

**Methods must be descriptive and avoid repeating the entity name**

When inside a `UserService`, don't prefix methods with `user` since the context is already clear.

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

### Avoid Generic Method Names

Method names must be descriptive and self-explanatory. Generic verbs like `check`, `process`, `handle`, or `do` without context are unclear.

```ts
❌ Bad
// In PendingTasksService
check(): boolean { }           // Check what?
process(): void { }             // Process what?
get(): Observable<any> { }      // Get what?
handle(): void { }              // Handle what?

✔️ Good
// In PendingTasksService
hasPendingTasks(): boolean { }
checkIfThereArePendingTasks(): boolean { }
processPendingOrders(): void { }
getPendingTaskCount(): Observable<number> { }
handleTaskCompletion(): void { }
```

**Why this matters:**

- Developers should immediately understand what a method does without reading implementation
- Self-documenting code reduces the need for comments
- Makes code reviews and maintenance easier

## Variables, Properties, and Function Parameters

### Use camelCase

```ts
❌ Bad
let last_login_time = null;
const MAX_count = 100;
let user-name = 'John';

✔️ Good
let lastLoginTime = null;
const maxCount = 100;
let userName = 'John';
```

### Minimum Identifier Length

**All variable, function, and parameter names must be at least 3 characters long** to ensure clarity.

```ts
❌ Bad
const t = 5;
const xy = 'test';
let ab: User;
function fn(a: number, b: string): void { }

✔️ Good
const total = 5;
const testName = 'test';
let activeUser: User;
function formatName(age: number, name: string): void { }
```

**Allowed exceptions** for common conventions:

- Loop counters: `i`, `j`, `k`
- Identifiers: `id`
- Coordinates: `x`, `y`

```ts
✔️ Exceptions OK
for (let i = 0; i < 10; i++) { }
const id = user.id;
const x = point.x;
```

### Constants

**Use UPPER_SNAKE_CASE for true constants** (values that never change)

```ts
✔️ Good
const MAX_RETRY_COUNT = 3;
const API_BASE_URL = 'https://api.example.com';
const DEFAULT_TIMEOUT_MS = 5000;
```

**Use camelCase for configuration objects** (even if they're `const`)

```ts
✔️ Good
const defaultUserConfig = {
	theme: 'dark',
	language: 'en',
};
```

## Observables and Subscriptions

### Use `$` Suffix

All observable variables and subscriptions must end with `$`.

```ts
❌ Bad
#users: Observable<User[]>;
#userStream: Observable<User>;
#subscription: Subscription;

✔️ Good
#users$: Observable<User[]>;
#userStream$: Observable<User>;
#subscription$: Subscription;
```

**Why:** The `$` suffix is a widely-adopted convention that makes it immediately obvious that a variable is an observable stream.

## UI Event Handler Methods

### Use `on` Prefix

Methods that respond to UI actions (clicks, inputs, etc.) must use the `on` prefix.

```ts
❌ Bad
<button (click)="save()">Save</button>
<input (input)="handleInput($event)" />

✔️ Good
<button (click)="onSave()">Save</button>
<input (input)="onInput($event)" />
```

```ts
✔️ Good Implementation
export class UserFormComponent {
	protected onSave(): void {
		this.#saveUserData();
	}

	protected onInput(event: Event): void {
		this.#validateInput(event);
	}

	#saveUserData(): void {
		// actual save logic
	}

	#validateInput(event: Event): void {
		// validation logic
	}
}
```

**Why:** The `on` prefix clearly indicates that this method is a UI event handler, separating it from business logic.

## Subscription Callback Methods

### Use `handle` Prefix

Methods that handle observable subscription results use the `handle` prefix.

```ts
❌ Bad
#getUsers(): void {
	this.userHttpService.fetchUsers()
		.subscribe((users) => {
			// handling logic directly in subscribe
			this.users.set(users);
		});
getUsers(): void {
	this.userHttpService.fetchUsers()
		.subscribe(this.#handleUsers);
}

#handleUsers = (users: User[]): void => {
	this.users.set(users);
	this.#isLoading.set(false);
}
```

**Why:** Separating handlers improves testability and readability.

## Interfaces and Types

### Interface Names

**Use PascalCase without "I" prefix**

```ts
❌ Bad
interface IUser { }
interface user_data { }
interface UserInterface { }

✔️ Good
interface User { }
interface UserData { }
interface CreateUserDto { }
```

### Type Alias Names

**Use PascalCase**

```ts
✔️ Good
type UserId = string | number;
type UserRole = 'admin' | 'user' | 'guest';
type ApiResponse<T> = {
	data: T;
	error?: string;
};
```

## Enums

### Enum Names

**Use PascalCase for enum name, PascalCase for enum members**

```ts
❌ Bad
enum user_status { }
enum MOVE_DIRECTION { }

✔️ Good
enum UserStatus {
	Active = 'active',
	Inactive = 'inactive',
	Pending = 'pending',
}

enum MoveDirection {
	Up = 'up',
	Down = 'down',
	Left = 'left',
	Right = 'right',
}
```

## Boolean Variables and Methods

### Use Descriptive Prefixes

Boolean variables and methods that return booleans should use prefixes like `is`, `has`, `should`, `can`.

```ts
❌ Bad
#loading = signal<boolean>(false);
#user = signal<boolean>(false);
active(): boolean { }

✔️ Good
#isLoading = signal<boolean>(false);
#hasUser = signal<boolean>(false);
isActive(): boolean { }
canEdit(): boolean { }
shouldDisplay(): boolean { }
```

## Private Fields with `#` Prefix

For true private class members that are never accessed outside the class (and not in templates), use JavaScript private fields with `#`.

```ts
✔️ Good
export class UserService {
	// Public API - no keyword
	fetchUsers(): Observable<User[]> {
		return this.#http.get<User[]>(this.#buildUrl());
	}

	// Private fields with #
	#apiUrl = 'https://api.example.com';
	#http = inject(HttpClient);

	#buildUrl(): string {
		return `${this.#apiUrl}/users`;
	}
}
```

**When to use `#` vs `private`:**

- Use `#` for truly private implementation details in services
- Use `protected` in components for template-accessible members
- Use `private` for members that shouldn't be in templates but might need to be accessible in tests

## Summary Table

| Element        | Convention                    | Example                     |
| -------------- | ----------------------------- | --------------------------- |
| Folders        | kebab-case                    | `user-profile/`             |
| Files          | kebab-case with type          | `user-profile.component.ts` |
| URLs           | kebab-case                    | `/user-profile/settings`    |
| Components     | PascalCase + Component        | `UserProfileComponent`      |
| Services       | PascalCase + Service Type     | `UserHttpService`           |
| Interfaces     | PascalCase                    | `User`                      |
| Enums          | PascalCase                    | `UserStatus`                |
| Variables      | camelCase                     | `userName`                  |
| Constants      | UPPER_SNAKE_CASE              | `MAX_RETRY_COUNT`           |
| Observables    | camelCase + `$`               | `users$`                    |
| UI Handlers    | `on` + PascalCase             | `onSave()`                  |
| Data Handlers  | `handle` + PascalCase         | `handleUsers()`             |
| Booleans       | is/has/can/should + camelCase | `isLoading`                 |
| Private fields | `#` + camelCase               | `#apiUrl`                   |

## Quick Decision Tree

**Naming a service method?**

1. Is it handling HTTP? → `fetch`, `create`, `update`, `delete`
2. Is it a boolean check? → `has`, `is`, `can`, `should`
3. Avoid repeating entity name (in `UserService`, use `fetchData()` not `fetchUserData()`)
4. Avoid generic verbs (`check`, `process`, `get`) - be specific!

**Naming a component method?**

1. Is it called from template event? → Use `on` prefix: `onClick()`, `onSubmit()`
2. Is it handling subscription data? → Use `handle` prefix: `handleUsers()`
3. Is it initialization logic? → Use `init` or `initialize` prefix
4. Otherwise → Use descriptive verb: `validateForm()`, `calculateTotal()`

**Naming a variable?**

1. Is it Observable/Subscription? → Add `$` suffix
2. Is it boolean? → Use `is/has/can/should` prefix
3. Is it a constant value? → UPPER_SNAKE_CASE
4. Otherwise → camelCase
