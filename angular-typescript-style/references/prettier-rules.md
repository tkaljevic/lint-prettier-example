# Code Formatting Rules (Prettier)

This file contains all Prettier-specific formatting rules. These are about **how code looks**, not about code quality.

## Core Formatting Rules

### Line Length

**Maximum: 80 characters**

```ts
❌ Bad
const veryLongVariableName = someFunction(param1, param2, param3, param4, param5);

✔️ Good
const veryLongVariableName = someFunction(
	param1,
	param2,
	param3,
	param4,
	param5
);
```

### Quotes

**Always use single quotes (`'`)**

```ts
❌ Bad
const message = "Hello World";
import { Component } from "@angular/core";

✔️ Good
const message = 'Hello World';
import { Component } from '@angular/core';
```

### Indentation

**Use tabs with tab width of 2**

```ts
✔️ Good
export class UserComponent {
	#userName = signal<string>('');

	loadUser(): void {
		// tab-indented code
	}
}
```

### Semicolons

**Always required at the end of statements**

```ts
❌ Bad
const name = 'John'
const age = 25

✔️ Good
const name = 'John';
const age = 25;
```

### Trailing Commas

**Always use trailing commas where valid**

```ts
❌ Bad
const user = {
	name: 'John',
	age: 25
};

const items = [
	'item1',
	'item2'
];

✔️ Good
const user = {
	name: 'John',
	age: 25,
};

const items = [
	'item1',
	'item2',
];
```

### Arrow Function Parentheses

**Always use parentheses around arrow function parameters**

```ts
❌ Bad
const double = x => x * 2;
items.map(item => item.name);

✔️ Good
const double = (x) => x * 2;
items.map((item) => item.name);
```

### Object Spacing

**Always add spaces between brackets in objects**

```ts
❌ Bad
const user = {name: 'John', age: 25};
import {Component, OnInit} from '@angular/core';

✔️ Good
const user = { name: 'John', age: 25 };
import { Component, OnInit } from '@angular/core';
```

### HTML/Template Closing Bracket

**Put closing bracket on a new line for multi-line elements**

```html
❌ Bad
<button (click)="onSave()" [disabled]="isDisabled">Save</button>

✔️ Good
<button (click)="onSave()" [disabled]="isDisabled">Save</button>
```

## Import Organization

Imports are automatically organized with clear separation:

```ts
✔️ Good Structure:

// 1. External packages first
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

// 2. Then relative imports
import { UserService } from './services/user.service';
import { User } from '../models/users/user.model';
import { ApiRoutes } from '../constants/api-routes';
```

**Rules:**

- External packages before relative imports
- Alphabetical order within each group
- Single blank line between groups

## HTML Template Formatting

For Angular template files (`.html`), use the Angular parser which understands Angular-specific syntax:

```html
✔️ Good
<div class="container">
	@if (user()) {
	<div class="user-profile">
		<h2>{{ user().name }}</h2>
		<p>{{ user().email }}</p>
	</div>
	} @for (item of items(); track item.id) {
	<div class="item">{{ item.name }}</div>
	}
</div>
```

**Template-specific rules:**

- 80 character line limit applies to templates too
- Indent Angular control flow blocks (`@if`, `@for`, `@switch`)
- Proper spacing around interpolation `{{ }}`
- Self-closing tags where applicable: `<img />`, `<br />`

## Configuration File

If the user asks for a Prettier configuration, provide this `.prettierrc` file:

```json
{
	"printWidth": 80,
	"useTabs": true,
	"tabWidth": 2,
	"semi": true,
	"singleQuote": true,
	"trailingComma": "all",
	"arrowParens": "always",
	"bracketSpacing": true,
	"bracketSameLine": false,
	"overrides": [
		{
			"files": "*.html",
			"options": {
				"parser": "angular"
			}
		}
	]
}
```

## Common Formatting Fixes

### Long Function Calls

```ts
❌ Bad (exceeds 80 chars)
const result = someVeryLongFunctionName(parameter1, parameter2, parameter3, parameter4);

✔️ Good
const result = someVeryLongFunctionName(
	parameter1,
	parameter2,
	parameter3,
	parameter4,
);
```

### Long Object Literals

```ts
❌ Bad (exceeds 80 chars)
const config = { apiUrl: 'https://api.example.com', timeout: 5000, retries: 3 };

✔️ Good
const config = {
	apiUrl: 'https://api.example.com',
	timeout: 5000,
	retries: 3,
};
```

### Import Statements

```ts
❌ Bad (exceeds 80 chars)
import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';

✔️ Good
import {
	Component,
	OnInit,
	OnDestroy,
	Input,
	Output,
	EventEmitter,
} from '@angular/core';
```

## Integration with ESLint

**Important:** Prettier handles formatting; ESLint handles code quality. When both tools have overlapping rules:

- Prettier takes precedence for formatting (quotes, semicolons, spacing)
- ESLint handles code quality (type safety, complexity, logic)
- Use `eslint-config-prettier` to disable ESLint formatting rules

## Enforcement Strategy

1. **Run Prettier before committing**: `prettier --write .`
2. **Use editor integration**: Install Prettier extension for VS Code
3. **Format on save**: Enable `editor.formatOnSave` in VS Code settings
4. **Pre-commit hook**: Use husky + lint-staged to enforce formatting

Execute formatting check: `prettier --check .`
Execute formatting fix: `prettier --write .`
