import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  input,
  output,
  signal
} from '@angular/core';

import { User } from './models';

/**
 * [Component Description]
 *
 * @example
 * ```html
 * <app-example [userId]="123" (userChanged)="onUserChanged($event)" />
 * ```
 */
@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleComponent implements OnInit {
  // #region Dependencies

  #destroyRef = inject(DestroyRef);
  // #exampleService = inject(ExampleService);

  // #endregion

  // #region Angular stuff

  userId = input.required<number>();
  userName = input<string>();
  userChanged = output<User>();

  // #endregion

  // #region Class properties

  protected users = signal<User[]>([]);
  protected isLoading = signal<boolean>(false);
  protected errorMessage = signal<string>('');
  protected hasUsers = computed(() => this.users().length > 0);
  protected userCount = computed(() => this.users().length);

  // #endregion

  constructor() {}

  // #region Lifecycle hooks

  ngOnInit(): void {
    this.#initUsers();
  }

  // #endregion

  // #region Init

  #initUsers(): void {
    this.isLoading.set(true);

    // this.#exampleService
    //   .fetchUsers()
    //   .pipe(takeUntilDestroyed(this.#destroyRef))
    //   .subscribe(this.#handleUsers);
  }

  // #endregion

  // #region UI Responses

  protected onSave(): void {
    this.#saveData();
  }

  protected onDelete(id: number): void {
    this.#deleteUser(id);
  }

  protected onRefresh(): void {
    this.#initUsers();
  }

  // #endregion

  // #region Utility

  #formatUserName(user: User): string {
    return `${user.firstName} ${user.lastName}`;
  }

  #saveData(): void {
    // Save implementation
  }

  #deleteUser(id: number): void {
    // Delete implementation
  }

  // #endregion

  // #region Handlers

  #handleUsers = (users: User[]): void => {
    this.users.set(users);
    this.isLoading.set(false);
  };

  #handleError = (error: Error): void => {
    this.errorMessage.set(error.message);
    this.isLoading.set(false);
  };

  // #endregion
}
