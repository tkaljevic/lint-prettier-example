# Prettier Rules

## Basic Rules

| Rule                  | Value                    |
| --------------------- | ------------------------ |
| Max line length       | 120 characters           |
| Quotes                | Single (`'`)             |
| Indentation           | Spaces, 2 spaces         |
| Semicolons            | Always                   |
| Trailing commas       | None                     |
| Arrow function parens | Always — `(param) => {}` |
| Bracket spacing       | Yes — `{ foo: bar }`     |
| HTML closing bracket  | New line                 |

## Import Organization

External packages first, then relative imports, with a blank line between groups:

```ts
// External packages
import { Component } from '@angular/core';
import { Observable } from 'rxjs';

// Relative imports
import { UserService } from './user.service';
import { User } from '../models/user.model';
```

Imports are sorted automatically via `prettier-plugin-organize-imports`.

## HTML Templates

Angular parser is used for `.html` files — understands Angular-specific syntax.

## Config Reference (`.prettierrc.json`)

```json
{
  "printWidth": 120,
  "singleQuote": true,
  "useTabs": false,
  "tabWidth": 2,
  "semi": true,
  "trailingComma": "none",
  "arrowParens": "always",
  "bracketSpacing": true,
  "bracketSameLine": false
}
```
