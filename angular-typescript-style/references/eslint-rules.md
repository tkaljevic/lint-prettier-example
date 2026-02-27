# Code Quality Rules (ESLint)

This file contains all ESLint rules focused on code quality, type safety, and preventing bugs. These rules enforce **correctness and maintainability**, not formatting.

## Type Safety Rules

### Forbidden `any` Type

The `any` type bypasses all type checking and should never be used.

```ts
❌ Bad
user: any;
data: any;
function process(input: any): any { }

✔️ Good
user: User;
data: unknown;  // when type is truly uncertain
function process(input: User): ProcessedData { }
```

**When type is unknown:** Use `unknown` instead of `any`, then narrow the type with type guards.

### Explicit Function Return Types

All functions must have explicitly specified return types.

```ts
❌ Bad
function getData() {
	return 'data';
}

function processUser(user: User) {
	return user.name;
}

✔️ Good
function getData(): string {
	return 'data';
}

function processUser(user: User): string {
	return user.name;
}

function setItem(item: User): void {
	this.item = item;
}
```

### Explicit Types for Module Boundaries

All **exported** functions must have explicitly specified return types. This ensures predictable API contracts.

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

**Why:** Exported functions are consumed by other modules. Explicit return types prevent breaking changes and improve autocomplete.

### Don't Use Inferrable Types

TypeScript can infer simple types automatically. Don't specify types that are obvious.

```ts
❌ Bad
const count: number = 5;
const name: string = 'John';
const isActive: boolean = true;

✔️ Good
const count = 5;
const name = 'John';
const isActive = true;
```

**Exception:** When the inferred type is too broad or incorrect, specify the type explicitly.

## Code Quality Rules

### Consistent Return Values

Functions must always either return a value or never return. Inconsistent returns are bugs waiting to happen.

```ts
❌ Bad
function foo(x: boolean) {
	if (x) {
		return 1;
	}
	// no return - returns undefined implicitly
}

✔️ Good
function bar(x: boolean): number {
	if (x) {
		return 1;
	}
	return 0;
}

// OR if function doesn't need to return:
function baz(x: boolean): void {
	if (x) {
		console.log('x is true');
	}
}
```

### Prefer `const`

Use `const` for variables that are never reassigned. This prevents accidental mutations.

```ts
❌ Bad
let MAX_COUNT = 100;
let userName = 'John';

✔️ Good
const MAX_COUNT = 100;
const userName = 'John';
```

Use `let` only when the variable will be reassigned.

### Avoid Magic Numbers

Don't use unexplained numeric literals in code. Use named constants instead.

**Exceptions:** `0`, `1`, `2`, and enum values are allowed.

```ts
❌ Bad
if (users.length > 50) { }
setTimeout(callback, 3000);
const threshold = 0.85;

✔️ Good
const MAX_USERS = 50;
const TIMEOUT_MS = 3000;
const THRESHOLD_PERCENTAGE = 0.85;

if (users.length > MAX_USERS) { }
setTimeout(callback, TIMEOUT_MS);

// OK to use 0, 1, 2 without constants
for (let i = 0; i < items.length; i++) { }
```

### Function Complexity

**Maximum cyclomatic complexity: 10**

If a function has more than 10 independent paths, it's too complex and must be broken down.

```ts
❌ Bad
function process(data: Data): void {
	if (data.type === 'A') {
		if (data.status === 'active') {
			if (data.priority > 5) {
				if (data.user.role === 'admin') {
					if (data.flags.urgent) {
						// too many nested conditions = high complexity
					}
				}
			}
		}
	}
}

✔️ Good
function process(data: Data): void {
	if (!isProcessable(data)) {
		return;
	}

	handleProcessableData(data);
}

function isProcessable(data: Data): boolean {
	return data.type === 'A' && data.status === 'active';
}

function handleProcessableData(data: Data): void {
	// simpler, more focused logic
}
```

### Maximum Parameters

**Maximum: 4 parameters per function**

If a function needs more than 4 parameters, use an options object instead.

```ts
❌ Bad
function createUser(
	name: string,
	age: number,
	email: string,
	phone: string,
	address: string,
): User { }

✔️ Good
// Import from models/
import { CreateUserDto, User } from '../models';

function createUser(userData: CreateUserDto): User { }
```

### Prefer `readonly`

Use `readonly` for class properties that are never changed after initialization.

```ts
❌ Bad
class UserService {
	#apiUrl = 'https://api.example.com';
	#http = inject(HttpClient);
}

✔️ Good
class UserService {
	readonly #apiUrl = 'https://api.example.com';
	readonly #http = inject(HttpClient);
}
```

## TypeScript Operators

### Nullish Coalescing (`??`)

Prefer `??` operator over `||` when checking for null/undefined.

```ts
❌ Bad
const value = input || 'default';  // fails for 0, '', false

✔️ Good
const value = input ?? 'default';  // only fails for null/undefined
```

**Why:** `||` treats `0`, `''`, and `false` as falsy. `??` only checks for `null` and `undefined`.

### Optional Chaining (`?.`)

Use optional chaining to safely access nested properties.

```ts
❌ Bad
const city = user && user.address && user.address.city;
const name = user ? user.name : undefined;

✔️ Good
const city = user?.address?.city;
const name = user?.name;
```

### Includes Instead of indexOf

```ts
❌ Bad
if (array.indexOf(item) !== -1) { }
if (str.indexOf('foo') > -1) { }

✔️ Good
if (array.includes(item)) { }
if (str.includes('foo')) { }
```

### StartsWith / EndsWith

```ts
❌ Bad
if (str.substring(0, 3) === 'foo') { }
if (str.substr(str.length - 3) === 'bar') { }

✔️ Good
if (str.startsWith('foo')) { }
if (str.endsWith('bar')) { }
```

## Type Definitions

### Use Interface for Object Types

Prefer `interface` over `type` for object type definitions.

```ts
❌ Bad
// Don't use type for object shapes
type User = {
	name: string;
	age: number;
};

✔️ Good
// Import from models/ or define interface if local
import { User } from '../models';
// OR if it's a local component-specific interface:
interface LocalComponentState {
	name: string;
	age: number;
}
```

**When to use `type`:** For unions, intersections, or aliases of primitive/complex types.

```ts
✔️ Good
type Status = 'active' | 'inactive' | 'pending';
type ID = string | number;
```

### Enum Rules

All enum values must be explicitly initialized to prevent bugs.

```ts
❌ Bad
enum Status {
	Active,           // implicit 0
	Inactive = 1,
	Pending = 1       // duplicate value
}

enum MixedEnum {
	First = 0,
	Second = 'second' // mixing numeric and string
}

✔️ Good
enum Status {
	Active = 0,
	Inactive = 1,
	Pending = 2,
}

// OR all strings
enum StatusString {
	Active = 'active',
	Inactive = 'inactive',
	Pending = 'pending',
}
```

**Rules:**

- All values must be initialized
- No duplicate values
- Don't mix numeric and string values

## Class Member Organization

Enforce a specific order for class members to improve readability.

**Order:**

1. Signature / Index signature
2. Fields (properties)
3. Constructor
4. Methods

```ts
✔️ Good
export class UserComponent {
	// 1. Fields
	readonly #userService = inject(UserService);
	userId = input.required<number>();
	userName = signal<string>('');

	// 2. Constructor
	constructor() { }

	// 3. Methods
	loadUser(): void { }
	#handleUserData(user: User): void { }
}
```

## Type Safety in HTTP Methods

When using HTTP service methods (`get`, `post`, `put`, `patch`, `delete`), **always specify the generic type explicitly**.

```ts
❌ Bad
this.http.get('api/users').subscribe((users) => {
	// users is 'any' - no type safety!
	console.log(users);
});

✔️ Good
this.http.get<User[]>('api/users').subscribe((users) => {
	// users is User[] - fully typed!
	console.log(users);
});

this.http.post<User>('api/users', userData).subscribe((user) => {
	// user is User
});
```

**Why:** Without the generic type, the return type defaults to `any`, bypassing all type checking.

## ESLint Configuration

If the user asks for ESLint configuration, key rules should include:

```json
{
	"rules": {
		"@typescript-eslint/no-explicit-any": "error",
		"@typescript-eslint/explicit-function-return-type": "error",
		"@typescript-eslint/explicit-module-boundary-types": "error",
		"@typescript-eslint/prefer-as-const": "error",
		"@typescript-eslint/no-inferrable-types": "error",
		"@typescript-eslint/prefer-readonly": "error",
		"@typescript-eslint/prefer-nullish-coalescing": "error",
		"@typescript-eslint/prefer-optional-chain": "error",
		"@typescript-eslint/prefer-includes": "error",
		"@typescript-eslint/prefer-string-starts-ends-with": "error",
		"prefer-const": "error",
		"no-magic-numbers": ["error", { "ignore": [0, 1, 2] }],
		"complexity": ["error", 10],
		"max-params": ["error", 4]
	}
}
```

## Common Violations and Fixes

### Missing Explicitly Specified Return Type

```ts
❌ Violation
export function getUsers() {
	return this.http.get('/users');
}

✔️ Fix
export function getUsers(): Observable<User[]> {
	return this.http.get<User[]>('/users');
}
```

### Using `any` Type

```ts
❌ Violation
function handleData(data: any): any {
	return data.value;
}

✔️ Fix
function handleData(data: unknown): string {
	if (typeof data === 'object' && data !== null && 'value' in data) {
		return String(data.value);
	}
	throw new Error('Invalid data format');
}
```

### Inconsistent Returns

```ts
❌ Violation
function findUser(id: number) {
	const user = users.find((u) => u.id === id);
	if (user) {
		return user;
	}
	// undefined returned implicitly
}

✔️ Fix
function findUser(id: number): User | null {
	const user = users.find((u) => u.id === id);
	return user ?? null;
}
```
