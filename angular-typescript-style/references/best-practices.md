# Best Practices for Angular/TypeScript Development

This file contains architectural patterns, performance best practices, and organizational guidelines that go beyond syntax rules.

## Models Organization

### Separate Models from Components and Services

**Always organize models in a dedicated `models/` folder, grouped by domain:**

```
src/
├── models/
│   ├── index.ts           // Main barrel - exports from all groups
│   ├── users/
│   │   ├── index.ts       // Users group barrel
│   │   ├── user.model.ts
│   │   ├── create-user-dto.model.ts
│   │   └── update-user-dto.model.ts
│   ├── orders/
│   │   ├── index.ts       // Orders group barrel
│   │   ├── order.model.ts
│   │   └── order-status.model.ts
│   └── forms/
│       ├── index.ts       // Forms group barrel
│       ├── user-form.model.ts
│       └── order-form.model.ts
└── components/
    └── user-list/
        └── user-list.component.ts
```

**Group related models together:**

- `users/` - User, CreateUserDto, UpdateUserDto, UserProfile
- `orders/` - Order, OrderItem, OrderStatus, OrderSummary
- `forms/` - All reactive form interfaces
- `shared/` - Common interfaces used across domains

**Each model file contains exactly ONE main export:**

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

**Use group barrel exports:**

```ts
✔️ Good (users/index.ts)
export * from './user.model';
export * from './create-user-dto.model';
export * from './update-user-dto.model';
```

**Main index exports from all groups:**

```ts
✔️ Good (models/index.ts)
export * from './users';
export * from './orders';
export * from './forms';
export * from './shared';
```

**Multiple import options:**

```ts
✔️ Good (user-list.component.ts)
// From main models index (recommended)
import { User, CreateUserDto } from '../models';

// From specific group
import { User } from '../models/users';

// From specific file (when needed)
import { User } from '../models/users/user.model';
```

**Wrong import paths:**

```ts
❌ Bad (outdated from old flat structure)
import { User } from '../models/user.model';

✔️ Correct (new hierarchical structure)
import { User } from '../models/users/user.model';
```

````

❌ **Never define models inline in components or services:**

```ts
❌ Bad
@Component({ ... })
export class UserListComponent {
	// Don't define interfaces here!
	interface User {
		id: number;
		name: string;
	}
}
````

**Why this matters:**

- **Reusability**: Models can be imported across multiple components and services
- **Single Source of Truth**: Changes to model structure happen in one place
- **Type Safety**: Consistent type definitions prevent runtime errors
- **Maintainability**: Easy to find and update model definitions

## Service Organization and Architecture

### Use the Facade Pattern for Complex Logic

When components need to interact with multiple services or perform complex operations, use a Facade Service to simplify the component's responsibility.

```ts
❌ Bad (component knows too much)
@Component({ ... })
export class UserDashboardComponent {
	#userHttp = inject(UserHttpService);
	#userState = inject(UserStateService);
	#authService = inject(AuthService);
	#notificationService = inject(NotificationService);

	protected onLoadUsers(): void {
		const currentUser = this.#authService.getCurrentUser();
		this.#userHttp.fetchUsers(currentUser.id).subscribe((users) => {
			this.#userState.setUsers(users);
			this.#notificationService.show('Users loaded');
		});
	}
}

✔️ Good (facade simplifies interaction)
@Component({ ... })
export class UserDashboardComponent {
	#userFacade = inject(UserFacadeService);

	protected users = this.#userFacade.users;
	protected isLoading = this.#userFacade.isLoading;

	protected onLoadUsers(): void {
		this.#userFacade.loadUsers();
	}
}

// Facade handles complexity
@Injectable({ providedIn: 'root' })
export class UserFacadeService {
	#userHttp = inject(UserHttpService);
	#userState = inject(UserStateService);
	#authService = inject(AuthService);
	#notificationService = inject(NotificationService);

	users = this.#userState.users;
	isLoading = this.#userState.isLoading;

	loadUsers(): void {
		const currentUser = this.#authService.getCurrentUser();
		this.#userHttp
			.fetchUsers(currentUser.id)
			.pipe(takeUntilDestroyed(this.#destroyRef))
			.subscribe((users) => {
				this.#userState.setUsers(users);
				this.#notificationService.show('Users loaded');
			});
	}
}
```

### Never Mix Service Responsibilities

Each service type has a specific purpose. **Do not** mix logic across service types.

**Service Type Responsibilities:**

| Service Type       | Responsibility     | What It Does                                 | What It Doesn't Do                    |
| ------------------ | ------------------ | -------------------------------------------- | ------------------------------------- |
| **HttpService**    | HTTP communication | `get()`, `post()`, `put()`, `delete()` calls | Business logic, state management      |
| **StateService**   | State management   | Hold signals, update state                   | HTTP calls, UI logic                  |
| **FacadeService**  | Orchestration      | Coordinate multiple services                 | Direct HTTP calls, direct state       |
| **UtilityService** | Pure utilities     | Format, transform, validate data             | HTTP calls, state management          |
| **FormService**    | Form management    | Build forms, validators                      | HTTP calls (delegate to HTTP service) |

```ts
❌ Bad (mixing concerns)
@Injectable({ providedIn: 'root' })
export class UserService {
	users = signal<User[]>([]);  // State
	http = inject(HttpClient);

	// HTTP + State + Logic all mixed
	fetchUsers(): void {
		this.http.get<User[]>('/users').subscribe((users) => {
			const formatted = users.map((u) => this.formatUser(u));
			this.users.set(formatted);
		});
	}

	formatUser(user: User): User {
		// Utility logic in HTTP service!
		return { ...user, name: user.name.toUpperCase() };
	}
}

✔️ Good (separated concerns)
@Injectable({ providedIn: 'root' })
export class UserHttpService {
	#http = inject(HttpClient);

	fetchUsers(): Observable<User[]> {
		return this.#http.get<User[]>('/users');
	}
}

@Injectable({ providedIn: 'root' })
export class UserStateService {
	users = signal<User[]>([]);

	setUsers(users: User[]): void {
		this.users.set(users);
	}
}

@Injectable({ providedIn: 'root' })
export class UserUtilityService {
	formatUser(user: User): User {
		return { ...user, name: user.name.toUpperCase() };
	}
}

@Injectable({ providedIn: 'root' })
export class UserFacadeService {
	#userHttp = inject(UserHttpService);
	#userState = inject(UserStateService);
	#userUtility = inject(UserUtilityService);

	loadUsers(): void {
		this.#userHttp.fetchUsers().subscribe((users) => {
			const formatted = users.map((u) =>
				this.#userUtility.formatUser(u)
			);
			this.#userState.setUsers(formatted);
		});
	}
}
```

### Service Documentation

**All public services and their public methods must be documented with JSDoc.**

````ts
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
	#http = inject(HttpClient);
	#apiUrl = '/api/users';

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
	 * @throws HttpErrorResponse if user is not found or validation fails
	 * @example
	 * const updatedData = { name: 'John Doe', email: 'john@example.com' };
	 * this.updateProfile(123, updatedData).subscribe(user => console.log(user));
	 */
	updateProfile(id: number, data: User): Observable<User> {
		return this.#http.put<User>(`${this.#apiUrl}/${id}`, data);
	}
}
````

**Documentation Guidelines:**

- **Service level**: Explain overall purpose and responsibility
- **Method level**: Document parameters, return values, and potential errors
- **Examples**: Provide usage examples for complex methods
- **When to document**:
  - ✅ All public services (class-level JSDoc)
  - ✅ All public methods in services
  - ✅ Complex utility methods
  - ❌ Private methods (optional, only if very complex)
  - ❌ Simple getters/setters

## Component Organization

### Use Regions to Organize Class Members

Use `// #region` and `// #endregion` to group related code for better readability.

**Region Formatting Rules:**

- Always add **empty line after** `// #region`
- Always add **empty line before** `// #endregion`

      #userService = inject(UserService);
      #router = inject(Router);

      // #endregion

      // #region Angular stuff

      userId = input.required<number>();
      userChanged = output<User>();

      // #endregion

      // #region Class properties

      users = signal<User[]>([]); // public - no keyword
      #isLoading = signal<boolean>(false); // private - # prefix

      // #endregion

      constructor() {}

      // #region Lifecycle hooks

      ngOnInit(): void {
      	this.initUsers();
      }

      // #endregion

      // #region Init

      #initUsers(): void {
      	this.#loadUsers();
      }

      #saveUser(): void {
      	// save logic
      }

      #deleteUser(userId: number): void {
      	// delete logic
      }

      // #endregion

      // #region UI Responses

      protected onSave(): void {
      	this.#saveUser();
      }

      protected onDelete(userId: number): void {
      	this.#deleteUser(userId);
      }

      // #endregion

      // #region Handlers

      #handleUsers = (users: User[]): void => {
      	this.users.set(users);
      	this.#isLoading.set(false);
      };

      // #endregion

      // #region Utility

      #formatUserName(user: User): string {
      	return `${user.firstName} ${user.lastName}`;
      }

      // #endregion

  }

````

**Standard Region Order:**

1. Dependencies
2. Angular stuff (inputs, outputs, view children)
3. Class properties
4. Constructor
5. Lifecycle hooks
6. Init
7. UI Responses (methods starting with `on`)
8. Handlers (subscription callbacks starting with `handle`)
9. Utility

### Clear Encapsulation with Access Modifiers

**Accessibility Rules:**

- **Public**: No keyword (nothing before the name)
- **Protected**: Use `protected` keyword (for template-accessible members in components)
- **Private**: Use `#` prefix, NO `private` keyword

**In Services:**

- Public methods/properties: NO keyword (accessible from outside)
- Private implementation: `#` prefix

```ts
✔️ Good
export class UserHttpService {
	// Public API - no keyword
	fetchUsers(): Observable<User[]> {
		return this.http.get<User[]>(this.#buildUrl());
	}

	// Private implementation with #
	#apiUrl = 'https://api.example.com/users';
	#http = inject(HttpClient);

	#buildUrl(): string {
		return `${this.#apiUrl}/list`;
	}
}
````

**In Components:**

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
	`,
})
export class UserListComponent {
	// Protected - used in template
	protected userName = signal<string>('');

	protected onLoadUsers(): void {
		this.#fetchAndProcessUsers();
	}

	// Private - internal only
	#userService = inject(UserService);

	#fetchAndProcessUsers(): void {
		// internal logic
	}
}
```

**Why use `#` for private?**

- True privacy at runtime (not just compile-time)
- Cannot be accessed via bracket notation
- Enforced by JavaScript engine

## Performance Best Practices

### Use OnPush Change Detection

Always use `OnPush` change detection strategy with signals for optimal performance.

```ts
✔️ Good
@Component({
	selector: 'app-user-list',
	templateUrl: './user-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserListComponent {
	users = signal<User[]>([]);
	filteredUsers = computed(() =>
		this.users().filter((u) => u.active)
	);
}
```

### Avoid Heavy Computations in Templates

Don't perform expensive operations directly in templates. Use `computed()` instead.

```html
❌ Bad
<div>{{ expensiveCalculation(data) }}</div>
<div>{{ items.filter(i => i.active).map(i => transform(i)) }}</div>

✔️ Good
<div>{{ calculatedValue() }}</div>
<div>{{ transformedItems() }}</div>
```

```ts
// In component
protected calculatedValue = computed(() =>
	this.expensiveCalculation(this.data())
);

protected transformedItems = computed(() =>
	this.items()
		.filter((i) => i.active)
		.map((i) => this.transform(i))
);
```

### Lazy Loading Routes

Always lazy load feature modules/routes.

```ts
✔️ Good
const routes: Routes = [
	{
		path: 'admin',
		loadComponent: () =>
			import('./admin/admin.component').then((m) => m.AdminComponent),
	},
	{
		path: 'users',
		loadChildren: () =>
			import('./users/users.routes').then((m) => m.USERS_ROUTES),
	},
];
```

## Maintainability Patterns

### Don't Hardcode Values

Use enums or constants instead of hardcoded strings and numbers.

```ts
❌ Bad
export class UserService {
	#apiUrl = 'https://api.example.com/users';
	#localStorageKey = 'user_data';
	#maxRetries = 3;
}

✔️ Good
enum ApiPaths {
	Users = 'https://api.example.com/users',
	Products = 'https://api.example.com/products',
}

enum LocalStorageKeys {
	UserData = 'user_data',
	AuthToken = 'auth_token',
}

enum RetryConfig {
	MaxRetries = 3,
	TimeoutMs = 5000,
}

export class UserService {
	#apiUrl = ApiPaths.Users;
	#localStorageKey = LocalStorageKeys.UserData;
	#maxRetries = RetryConfig.MaxRetries;
}
```

### Use Interfaces for Models, Not Classes

Prefer interfaces over classes for data models.

```ts
❌ Bad
export class User {
	id: number;
	name: string;
	email: string;

	constructor(id: number, name: string, email: string) {
		this.id = id;
		this.name = name;
		this.email = email;
	}
}

✔️ Good
// Import from models/
import { User } from '../models';

// Use interface instead of class for data
```

**Why:** Interfaces are lightweight, don't add runtime overhead, and work better with JSON serialization.

**File Organization:**

- Small models used only within a specific context can be in the same file
- Larger models or shared models should have separate files

## Accessibility Best Practices

### Mandatory Accessibility Requirements

All components **must**:

- Pass all AXE automated accessibility checks
- Follow WCAG AA minimum standards
- Include proper focus management
- Maintain sufficient color contrast (minimum 4.5:1 for normal text)
- Use appropriate ARIA attributes

### Keyboard Accessibility

All interactive elements must be keyboard accessible.

```html
✔️ Good
<!-- Native button - inherently accessible -->
<button (click)="onSave()">Save</button>

<!-- Custom interactive element - requires manual accessibility -->
<div
	(click)="onClick()"
	(keydown.enter)="onClick()"
	(keydown.space)="onClick()"
	tabindex="0"
	role="button"
	[attr.aria-pressed]="isPressed()"
>
	Toggle
</div>
```

### Focus Management

Manage focus appropriately for modals, dropdowns, and dynamic content.

```ts
✔️ Good
@Component({ ... })
export class ModalComponent implements AfterViewInit {
	@ViewChild('closeButton') closeButton!: ElementRef<HTMLButtonElement>;

	ngAfterViewInit(): void {
		// Move focus to close button when modal opens
		this.closeButton.nativeElement.focus();
	}

	protected onClose(): void {
		// Return focus to trigger element when modal closes
		this.returnFocus();
	}
}
```

### ARIA Attributes

Use ARIA attributes to enhance screen reader support.

```html
✔️ Good
<!-- Live regions for dynamic content -->
<div [attr.aria-live]="'polite'" [attr.aria-atomic]="true">
	{{ statusMessage() }}
</div>

<!-- Labels for inputs without visible labels -->
<input
	type="search"
	[attr.aria-label]="'Search users'"
	[(ngModel)]="searchTerm"
/>

<!-- Expanded/collapsed state -->
<button
	(click)="toggleMenu()"
	[attr.aria-expanded]="isMenuOpen()"
	[attr.aria-controls]="'menu-content'"
>
	Toggle Menu
</button>

<div id="menu-content" [hidden]="!isMenuOpen()">
	<!-- menu items -->
</div>
```

## Common Pitfalls to Avoid

### Don't Subscribe in Constructor

Subscriptions in constructors run before component initialization is complete.

```ts
❌ Bad
constructor() {
	this.userService.getUsers().subscribe(); // Too early!
}

✔️ Good
ngOnInit(): void {
	this.initUsers();
}

#initUsers(): void {
	this.userService
		.getUsers()
		.pipe(takeUntilDestroyed(this.#destroyRef))
		.subscribe(this.#handleUsers);
}
```

### Don't Mutate Input Signals

Input signals should be treated as read-only.

```ts
❌ Bad
@Component({ ... })
export class UserCardComponent {
	user = input.required<User>();

	updateUser(): void {
		this.user().name = 'New Name'; // Mutating input!
	}
}

✔️ Good
@Component({ ... })
export class UserCardComponent {
	user = input.required<User>();
	userChanged = output<User>();

	protected onUpdateUser(): void {
		const updatedUser = { ...this.user(), name: 'New Name' };
		this.userChanged.emit(updatedUser);
	}
}
```

### Don't Create Multiple Subscriptions for Same Observable

If multiple parts of the component need the same data, use a signal and subscribe once.

```ts
❌ Bad
ngOnInit(): void {
	// Same observable subscribed multiple times
	this.userService.getUser().subscribe(this.handleUser1);
	this.userService.getUser().subscribe(this.handleUser2);
	this.userService.getUser().subscribe(this.handleUser3);
}

✔️ Good
ngOnInit(): void {
	this.userService
		.getUser()
		.pipe(
			tap((user) => this.user.set(user)),
			takeUntilDestroyed(this.destroyRef),
		)
		.subscribe();
}

// Multiple computed signals can derive from the same source
protected userName = computed(() => this.user()?.name ?? '');
protected userEmail = computed(() => this.user()?.email ?? '');
```

### Always Track Items in @for Loops

```html
❌ Bad @for (item of items(); track $index) {
<div>{{ item.name }}</div>
} ✔️ Good @for (item of items(); track item.id) {
<div>{{ item.name }}</div>
}
```

**Why:** Using `track item.id` provides Angular with a stable identity, improving performance and preventing unnecessary re-renders.

## Testing Considerations

While this skill doesn't cover testing in detail, follow these patterns to make code more testable:

- Use dependency injection instead of creating instances with `new`
- Keep business logic in services, not components
- Use pure functions where possible
- Avoid side effects in constructors
- Make dependencies explicit through `inject()` or constructor parameters

## Summary Checklist

Before completing any Angular/TypeScript code:

✅ **Services:**

- [ ] Single responsibility (HTTP, State, Facade, Utility)
- [ ] JSDoc documentation for public APIs
- [ ] Use `#` for private members
- [ ] Typed HTTP calls with generics

✅ **Components:**

- [ ] OnPush change detection
- [ ] Signals for state, computed for derived state
- [ ] `protected` for template-accessible members
- [ ] No logic directly in lifecycle hooks
- [ ] Proper regions for organization

✅ **Templates:**

- [ ] Native control flow (`@if`, `@for`, `@switch`)
- [ ] Direct bindings instead of `ngClass`/`ngStyle`
- [ ] No arrow functions in templates
- [ ] `track` in all `@for` loops
- [ ] Keyboard accessibility for interactive elements

✅ **Best Practices:**

- [ ] No hardcoded values (use enums/constants)
- [ ] No `any` type
- [ ] Subscription management with `takeUntilDestroyed`
- [ ] Interfaces for models
- [ ] AXE and WCAG AA compliance
