import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { CreateUserDto, User } from './models';

/**
 * Service responsible for [describe responsibility].
 * Provides methods for [list main operations].
 *
 * @example
 * ```ts
 * constructor() {
 *   this.exampleService.fetchAll().subscribe(users => {
 *     this.users.set(users);
 *   });
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ExampleHttpService {
  // #region Dependencies

  #http = inject(HttpClient);

  // #endregion

  // #region Configuration

  #apiUrl = '/api/example';

  // #endregion

  /**
   * Fetches all users from the API.
   *
   * @returns Observable<User[]> Stream of all users
   * @example
   * this.fetchAll().subscribe(users => this.users.set(users));
   */
  fetchAll(): Observable<User[]> {
    return this.#http.get<User[]>(this.#buildUrl());
  }

  /**
   * Fetches a single user by ID.
   *
   * @param id - The unique identifier of the user
   * @returns Observable<User> Stream containing the requested user
   * @throws HttpErrorResponse if user is not found
   */
  fetchById(id: number): Observable<User> {
    return this.#http.get<User>(`${this.#buildUrl()}/${id}`);
  }

  /**
   * Creates a new user.
   *
   * @param data - The user data to create
   * @returns Observable<User> Stream containing the created user
   * @throws HttpErrorResponse if validation fails
   */
  create(data: CreateUserDto): Observable<User> {
    return this.#http.post<User>(this.#buildUrl(), data);
  }

  /**
   * Updates an existing user.
   *
   * @param id - The unique identifier of the user to update
   * @param data - Updated user data
   * @returns Observable<User> Stream containing the updated user
   * @throws HttpErrorResponse if user is not found or validation fails
   */
  update(id: number, data: Partial<User>): Observable<User> {
    return this.#http.put<User>(`${this.#buildUrl()}/${id}`, data);
  }

  /**
   * Deletes a user by ID.
   *
   * @param id - The unique identifier of the user to delete
   * @returns Observable<void> Completes when deletion is successful
   * @throws HttpErrorResponse if user is not found
   */
  delete(id: number): Observable<void> {
    return this.#http.delete<void>(`${this.#buildUrl()}/${id}`);
  }

  // #region Private Helpers

  #buildUrl(): string {
    return this.#apiUrl;
  }

  // #endregion
}
