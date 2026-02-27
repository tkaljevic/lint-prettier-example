# Angular-Specific Conventions

This file contains Angular framework-specific patterns, conventions, and modern best practices for Angular v20+.

## Components

### Always Use Standalone Components

Angular v20+ uses standalone components by default. **Do NOT** set `standalone: true` in the decorator.

```ts
❌ Bad
@Component({
	standalone: true,  // redundant in v20+
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
})
export class UserProfileComponent { }

✔️ Good
@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent { }
```

### OnPush Change Detection Strategy

**Always use OnPush change detection strategy** for better performance.

```ts
❌ Bad
@Component({
	selector: 'app- header',
	templateUrl: './header.component.html',
})
export class HeaderComponent {
	users: User[];
}

✔️ Good
@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
	users = signal<User[]>([]);
}
```

### Input and Output

**Use `input()` and `output()` functions instead of decorators**

```ts
❌ Bad
@Component({ ... })
export class UserCardComponent {
	@Input() userId!: number;
	@Input() userName?: string;
	@Output() userClicked = new EventEmitter<User>();
}

✔️ Good
@Component({ ... })
export class UserCardComponent {
	userId = input.required<number>();
	userName = input<string>();
	userClicked = output<User>();
}
```

**When to use `required`:**

- `input.required<T>()` - Input must be provided
- `input<T>()` - Input is optional

### Host Bindings and Listeners

**Do NOT use `@HostBinding` and `@HostListener` decorators.** Use the `host` object in the component decorator instead.

```ts
❌ Bad
@Component({
	selector: 'app-button',
	template: '<ng-content></ng-content>',
})
export class ButtonComponent {
	@HostBinding('class.active') isActive = true;
	@HostBinding('attr.aria-disabled') ariaDisabled = false;

	@HostListener('click', ['$event'])
	onClick(event: Event): void {
		console.log('clicked');
	}
}

✔️ Good
@Component({
	selector: 'app-button',
	template: '<ng-content></ng-content>',
	host: {
		'[class.active]': 'isActive',
		'[attr.aria-disabled]': 'ariaDisabled',
		'(click)': 'onClick($event)',
	},
})
export class ButtonComponent {
	isActive = true;
	ariaDisabled = false;

	onClick(event: Event): void {
		console.log('clicked');
	}
}
```

## Dependency Injection

### Use `inject()` Function

**Use the `inject()` function instead of constructor injection**

```ts
❌ Bad
@Component({ ... })
export class UserComponent {
	constructor(
		#userService: UserService,
		#router: Router,
		#activatedRoute: ActivatedRoute,
	) { }
}

✔️ Good
@Component({ ... })
export class UserComponent {
	readonly #userService = inject(UserService);
	readonly #router = inject(Router);
	readonly #activatedRoute = inject(ActivatedRoute);
}
```

**Why:** The `inject()` function is more concise and allows for cleaner composition.

### Service Registration

**Use `providedIn: 'root'` for singleton services**

```ts
✔️ Good
@Injectable({ providedIn: 'root' })
export class UserService {
	// service implementation
}
```

For feature-specific services that shouldn't be singletons, provide them at the component level or use `provideIn`.

## State Management with Signals

### Prefer Signals Over Observables for Template Rendering

```ts
❌ Bad (for template data)
@Component({
	selector: 'app-users',
	template: '<div>{{ users$ | async }}</div>',
})
export class UsersComponent {
	users$ = new BehaviorSubject<User[]>([]);
}

✔️ Good
@Component({
	selector: 'app-users',
	template: '<div>{{ users() }}</div>',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsersComponent {
	users = signal<User[]>([]);
}
```

### Computed Signals for Derived State

Use `computed()` for values derived from other signals.

```ts
✔️ Good
@Component({ ... })
export class UserListComponent {
	users = signal<User[]>([]);
	searchTerm = signal<string>('');

	// Derived state using computed
	filteredUsers = computed(() =>
		this.users().filter((user) =>
			user.name.toLowerCase().includes(this.searchTerm().toLowerCase())
		)
	);
}
```

### Updating Signals

**Do NOT use `mutate()` on signals. Use `update()` or `set()` instead.**

```ts
❌ Bad
this.users.mutate((users) => users.push(newUser));

✔️ Good
// Use set() for complete replacement
this.users.set([...this.users(), newUser]);

// Use update() for transformations
this.users.update((users) => [...users, newUser]);
```

## Templates

### Native Control Flow

**Use native control flow (`@if`, `@for`, `@switch`) instead of structural directives**

```html
❌ Bad
<div *ngIf="user">{{ user.name }}</div>

<div *ngFor="let item of items">{{ item }}</div>

<div [ngSwitch]="status">
	<div *ngSwitchCase="'active'">Active</div>
	<div *ngSwitchCase="'inactive'">Inactive</div>
</div>

✔️ Good @if (user()) {
<div>{{ user().name }}</div>
} @for (item of items(); track item.id) {
<div>{{ item }}</div>
} @switch (status()) { @case ('active') {
<div>Active</div>
} @case ('inactive') {
<div>Inactive</div>
} }
```

**Important:** Always include `track` expression in `@for` loops for performance.

### Class and Style Bindings

**Do NOT use `ngClass` or `ngStyle`. Use direct class/style bindings instead.**

```html
❌ Bad
<div [ngClass]="{ 'active': isActive, 'disabled': isDisabled }"></div>
<div [ngStyle]="{ 'color': textColor, 'font-size': fontSize }"></div>

✔️ Good
<div [class.active]="isActive" [class.disabled]="isDisabled"></div>
<div [style.color]="textColor" [style.font-size]="fontSize"></div>
```

### Avoid Arrow Functions in Templates

**Do not write arrow functions directly in templates** - they are not supported and harm performance.

```html
❌ Bad
<button (click)="items.filter((i) => i.active)">Filter</button>
<div>{{ users.map((u) => u.name).join(', ') }}</div>

✔️ Good
<button (click)="onFilter()">Filter</button>
<div>{{ formattedUserNames() }}</div>
```

```ts
// In component
protected onFilter(): void {
	this.filteredItems.set(this.items().filter((i) => i.active));
}

protected formattedUserNames = computed(() =>
	this.users().map((u) => u.name).join(', ')
);
```

### Don't Assume Globals in Templates

Templates don't have access to global JavaScript objects like `Date`, `Math`, etc. Reference them through component properties.

```html
❌ Bad
<div>{{ new Date() }}</div>
<div>{{ Math.round(value) }}</div>

✔️ Good
<div>{{ currentDate() }}</div>
<div>{{ roundedValue() }}</div>
```

```ts
// In component
protected currentDate = signal(new Date());
protected roundedValue = computed(() => Math.round(this.value()));
```

## Images

### Use NgOptimizedImage for Static Images

```html
❌ Bad
<img src="assets/logo.png" alt="Logo" />

✔️ Good
<img ngSrc="assets/logo.png" width="200" height="100" alt="Logo" />
```

**Benefits:**

- Automatic lazy loading
- Responsive srcset generation
- Prevents layout shift
- Better performance

**⚠️ Limitation:** Does NOT work for inline base64 images.

## Forms

### Reactive Forms with Typed FormGroups

**Use typed FormGroups and FormControls**

```ts
❌ Bad
const loginForm = new FormGroup({
	email: new FormControl(''),
	password: new FormControl(''),
});

✔️ Good
interface LoginForm {
	email: FormControl<string>;
	password: FormControl<string>;
}

const loginForm = new FormGroup<LoginForm>({
	email: new FormControl('', { nonNullable: true }),
	password: new FormControl('', { nonNullable: true }),
});
```

**Why:** Type safety prevents runtime errors and provides autocomplete.

### Prefer Reactive Forms Over Template-Driven

Use Reactive Forms for all but the simplest forms.

```ts
✔️ Good
@Component({
	selector: 'app-login',
	template: \`
		<form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
			<input formControlName="email" type="email" />
			<input formControlName="password" type="password" />
			<button type="submit">Login</button>
		</form>
	\`,
})
export class LoginComponent {
	protected loginForm = this.#createForm();

	#formBuilder = inject(FormBuilder);

	#createForm(): FormGroup<LoginForm> {
		return this.#formBuilder.group<LoginForm>({
			email: this.#formBuilder.control('', { nonNullable: true }),
			password: this.#formBuilder.control('', { nonNullable: true }),
		});
	}

	protected onSubmit(): void {
		if (this.loginForm.valid) {
			const formValue = this.loginForm.getRawValue();
			// formValue is fully typed!
		}
	}
}
```

## Lifecycle Hooks

### Always Implement Lifecycle Interfaces

If you use a lifecycle hook method, you **must** implement the corresponding interface.

```ts
❌ Bad
export class MyComponent {
	ngOnInit(): void {
		this.loadData();
	}
}

✔️ Good
export class MyComponent implements OnInit {
	ngOnInit(): void {
		this.loadData();
	}
}
```

**Common lifecycle interfaces:**

- `OnInit` - `ngOnInit()`
- `OnDestroy` - `ngOnDestroy()`
- `OnChanges` - `ngOnChanges()`
- `AfterViewInit` - `ngAfterViewInit()`
- `AfterContentInit` - `ngAfterContentInit()`

### Don't Write Logic Directly in Lifecycle Hooks

Keep lifecycle hooks clean by delegating to separate methods.

```ts
❌ Bad
export class UserComponent implements OnInit {
	ngOnInit(): void {
		this.userService.getUserData().subscribe((user) => {
			this.user.set(user);
			this.isLoading.set(false);
		});
	}
}

✔️ Good
export class UserComponent implements OnInit {
	ngOnInit(): void {
		this.initUserData();
	}

	#initUserData(): void {
		this.userService
			.getUserData()
			.pipe(takeUntilDestroyed(this.#destroyRef))
			.subscribe(this.#handleUserData);
	}

	#handleUserData = (user: User): void => {
		this.user.set(user);
		this.#isLoading.set(false);
	};
}
```

## Subscription Management

### Always Unsubscribe from Observables

Use `takeUntilDestroyed()` with `DestroyRef` to automatically unsubscribe.

```ts
❌ Bad
export class AppComponent implements OnInit {
	ngOnInit(): void {
		this.http.get('/api/users').subscribe((users) => {
			// Memory leak! Never unsubscribed
		});
	}
}

✔️ Good
export class AppComponent implements OnInit {
	#destroyRef = inject(DestroyRef);
	#http = inject(HttpClient);

	ngOnInit(): void {
		this.#http
			.get('/api/users')
			.pipe(takeUntilDestroyed(this.#destroyRef))
			.subscribe((users) => {
				// Automatically unsubscribed on component destroy
			});
	}
}
```

### Avoid Nested Subscriptions

**Use RxJS operators like `switchMap`, `mergeMap`, `concatMap` instead of nesting**

```ts
❌ Bad (nested subscriptions)
this.userService.getUser().subscribe((user) => {
	this.orderService.getOrders(user.id).subscribe((orders) => {
		this.productService.getProducts(orders).subscribe((products) => {
			this.products.set(products);
		});
	});
});

✔️ Good (chained operators)
this.userService
	.getUser()
	.pipe(
		switchMap((user) => this.orderService.getOrders(user.id)),
		switchMap((orders) => this.productService.getProducts(orders)),
		takeUntilDestroyed(this.destroyRef),
	)
	.subscribe((products) => {
		this.products.set(products);
	});
```

## Accessibility

### Must Pass AXE and WCAG AA

All components must:

- Pass all **AXE** automated accessibility checks
- Follow **WCAG AA** minimum standards
- Include proper focus management
- Maintain sufficient color contrast
- Use appropriate ARIA attributes

```html
✔️ Good
<button
	(click)="onSave()"
	(keydown.enter)="onSave()"
	[attr.aria-label]="'Save user data'"
	[attr.aria-disabled]="isDisabled()"
>
	Save
</button>

<!-- Interactive div must be keyboard accessible -->
<div
	(click)="onClick()"
	(keydown.enter)="onClick()"
	tabindex="0"
	role="button"
	[attr.aria-pressed]="isPressed()"
>
	Toggle
</div>

<!-- Images must have alt text -->
<img ngSrc="logo.png" width="200" height="100" alt="Company logo" />
```

### Interactive Elements Must Support Keyboard

All clickable elements must respond to keyboard events.

```html
❌ Bad
<div (click)="onClick()">Click me</div>

✔️ Good
<div (click)="onClick()" (keydown.enter)="onClick()" tabindex="0" role="button">
	Click me
</div>

<!-- Or use native button element -->
<button (click)="onClick()">Click me</button>
```

### Valid ARIA Attributes

```html
✔️ Good
<div role="button" [attr.aria-pressed]="isPressed()">Toggle</div>
<input [attr.aria-label]="'Search users'" type="text" />
<div [attr.aria-live]="'polite'">{{ statusMessage() }}</div>
```

## Template File Paths

When using external templates and styles, use paths **relative to the component TypeScript file**.

```ts
✔️ Good
@Component({
	selector: 'app-user-profile',
	templateUrl: './user-profile.component.html',
	styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent { }
```

## Component Size and Responsibility

### Keep Components Small and Focused

Each component should have a single responsibility. If a component grows too large, consider:

1. **Extracting child components** for distinct UI sections
2. **Using a Facade Service** to handle complex business logic
3. **Breaking into feature components** for different concerns

```ts
✔️ Good Pattern
// Large component delegates to facade
@Component({ ... })
export class UserDashboardComponent {
	#userFacade = inject(UserFacadeService);

	protected users = this.#userFacade.users;
	protected isLoading = this.#userFacade.isLoading;

	protected onLoadUsers(): void {
		this.#userFacade.loadUsers();
	}
}
```

## Quick Migration Guide

If updating legacy Angular code to modern patterns:

| Old Pattern                               | New Pattern                                 |
| ----------------------------------------- | ------------------------------------------- |
| `@Input() userId!: number;`               | `userId = input.required<number>();`        |
| `@Output() clicked = new EventEmitter();` | `clicked = output<void>();`                 |
| `@HostBinding('class.active')`            | `host: { '[class.active]': 'isActive' }`    |
| `@HostListener('click', ['$event'])`      | `host: { '(click)': 'onClick($event)' }`    |
| `#myService: MyService` in constructor    | `#myService = inject(MyService);`           |
| `*ngIf="condition"`                       | `@if (condition()) { }`                     |
| `*ngFor="let item of items"`              | `@for (item of items(); track item.id) { }` |
| `[ngClass]="{ ... }"`                     | `[class.name]="condition"`                  |
| `[ngStyle]="{ ... }"`                     | `[style.property]="value"`                  |
| `BehaviorSubject` in templates            | `signal()`                                  |

**Do not mix old and new patterns in the same component!**
