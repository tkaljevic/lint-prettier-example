# Angular Conventions

## Components

Always standalone (no `NgModule`). Don't set `standalone: true` — it's the default in Angular v20+.
Always use `ChangeDetectionStrategy.OnPush`.

```ts
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserProfileComponent {}
```

## Input / Output

Use signal-based functions, not decorators:

```ts
❌ @Input() userId!: number;  @Output() changed = new EventEmitter<User>();
✔️ userId = input.required<number>();  changed = output<User>();
```

## Host Bindings

Use the `host` object in `@Component`, not `@HostBinding` / `@HostListener`:

```ts
@Component({
  host: {
    '[class.active]': 'isActive',
    '(click)': 'onClick($event)'
  }
})
```

## Dependency Injection

Use `inject()`, not constructor injection:

```ts
❌ constructor(private userService: UserService) { }
✔️ #userService = inject(UserService);
```

## Guards and Interceptors

Must be written as functions, not classes:

```ts
✔️ export const authGuard: CanActivateFn = () => { };
✔️ export const authInterceptor: HttpInterceptorFn = (req, next) => { };
```

## Deferrable Views

Use `@defer` to lazily load non-critical or below-the-fold content:

```html
@defer (on viewport) {
<app-analytics-dashboard />
} @placeholder {
<div class="skeleton"></div>
}
```

Triggers: `on idle`, `on viewport`, `on interaction`, `on hover`, `when <condition>`
Always provide `@placeholder` and `@loading` to avoid layout shifts.

## Pure Pipes

Use pure pipes instead of method calls in templates — pipes are memoized, method calls re-run on every change detection cycle:

```ts
@Pipe({ name: 'fullName', standalone: true })
export class FullNamePipe implements PipeTransform {
  transform(user: User): string {
    return `${user.firstName} ${user.lastName}`;
  }
}
```

```html
✔️ {{ user | fullName }} ❌ {{ getFullName(user) }}
```

## Templates

**Native control flow** — use `@if`, `@for`, `@switch` instead of `*ngIf`, `*ngFor`, `[ngSwitch]`:

```html
✔️ @if (user) {
<div>{{ user.name }}</div>
} ✔️ @for (item of items; track item.id) {
<div>{{ item }}</div>
}
```

**No `ngClass` / `ngStyle`** — use direct bindings:

```html
❌ [ngClass]="{ 'active': isActive }" ✔️ [class.active]="isActive"
```

**No arrow functions in templates** — move logic to component method:

```html
❌ (click)="items.filter(i => i.active)" ✔️ (click)="onFilter()"
```

**No interpolation in attributes** — use property binding:

```html
❌
<div title="{{ name }}">
  ✔️
  <div [title]="name"></div>
</div>
```

**Self-closing tags** where possible:

```html
✔️ <app-user /> <br />
<img src="..." alt="..." />
```

## Images

Use `NgOptimizedImage` for static images:

```html
<img ngSrc="assets/logo.png" width="200" height="100" alt="Logo" />
```

## Lifecycle Interfaces

Implement the interface when using a lifecycle hook:

```ts
❌ export class MyComponent { ngOnInit(): void { } }
✔️ export class MyComponent implements OnInit { ngOnInit(): void { } }
```

## Reactive Forms

Reactive forms are mandatory — template-driven forms (`ngModel`) are forbidden.
Typed forms are encouraged but not required.

```ts
✔️ const form = new FormGroup<LoginForm>({
  email: new FormControl('', { nonNullable: true }),
  password: new FormControl('', { nonNullable: true })
});
```

## Accessibility

- Must pass all **AXE** checks
- Must follow **WCAG AA** minimum
- Interactive elements must support keyboard events
- Valid ARIA attributes required

```html
✔️ <button (click)="onSave()" (keydown.enter)="onSave()" [attr.aria-label]="'Save'">Save</button> ✔️
<div (click)="onClick()" (keydown.enter)="onClick()" tabindex="0">Click me</div>
```
