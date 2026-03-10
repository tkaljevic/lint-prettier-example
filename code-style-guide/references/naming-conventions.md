# Naming Conventions

## Folders and Files

- **kebab-case** for all folders and files
- File name must include a type suffix

```
❌ userService/  UserProfile.ts  auth.ts
✔️ user-services/  user-profile.component.ts  auth.service.ts

Suffixes: .component.ts  .service.ts  .model.ts  .enum.ts  .const.ts
```

## URLs

All route paths use **kebab-case**:

```
❌ /userProfile/settings
✔️ /user-profile/settings
```

## Classes

**PascalCase**:

```ts
❌ class userProfileComponent { }
✔️ class UserProfileComponent { }
```

## Services

Every service name must include a suffix reflecting its type:

| Suffix           | Example              | Purpose                         |
| ---------------- | -------------------- | ------------------------------- |
| `FacadeService`  | `UserFacadeService`  | Orchestrates other services     |
| `StateService`   | `UserStateService`   | Manages component/feature state |
| `HttpService`    | `UserHttpService`    | HTTP calls only                 |
| `FormService`    | `UserFormService`    | Form logic                      |
| `UtilityService` | `DateUtilityService` | General utilities               |

⚠️ Never mix concerns — HTTP calls belong only in `HttpService`.

## Methods in Services

Methods must not repeat the entity name of the service:

```ts
// In UserHttpService:
❌ getUserData()  updateUserProfile()
✔️ fetchData()    updateProfile()
```

Avoid generic names — be descriptive:

```ts
❌ check()  process()  get()
✔️ hasPendingTasks()  processPendingOrders()  getPendingTaskCount()
```

## Variables, Properties, Methods

**camelCase** for all. Minimum 3 characters (exceptions: `i`, `j`, `k`, `id`, `x`, `y`).

## Observables and Subscriptions

Always use `$` suffix:

```ts
❌ #users: Observable<User[]>;
✔️ #users$: Observable<User[]>;
```

## UI Event Handlers

Use `on` prefix for methods bound to template events:

```html
<button (click)="onSave()">Save</button>
```

## Subscription Callbacks

Use `handle` prefix for methods passed as subscription callbacks:

```ts
this.userHttpService.fetchUsers().subscribe(this.handleUsers);

#handleUsers = (users: User[]): void => { }
```

## Models Organization

Models in a `models/` folder, grouped by domain, one model per file:

```
models/
├── index.ts          ← exports all groups
├── users/
│   ├── index.ts      ← exports all user models
│   ├── user.model.ts
│   └── create-user-dto.model.ts
└── forms/
    ├── index.ts
    └── user-form.model.ts
```

Import from the group index or main index:

```ts
import { User } from '../models'; // from main index
import { User } from '../models/users'; // from group index
```

Never define models inline inside components or services.
