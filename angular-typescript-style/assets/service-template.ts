import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Service responsible for [describe responsibility].
 * Provides methods for [list main operations].
 *
 * @example
 * ```ts
 * constructor() {
 *   this.exampleService.fetchData().subscribe(data => {
 *     console.log(data);
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
	 * Fetches all items from the API.
	 *
	 * @returns Observable<Item[]> Stream of all items
	 * @example
	 * this.fetchItems().subscribe(items => console.log(items));
	 */
	fetchItems(): Observable<Item[]> {
		return this.#http.get<Item[]>(this.#buildUrl());
	}

	/**
	 * Fetches a single item by ID.
	 *
	 * @param id - The unique identifier of the item
	 * @returns Observable<Item> Stream containing the requested item
	 * @throws HttpErrorResponse if item is not found
	 * @example
	 * this.fetchById(123).subscribe(item => console.log(item));
	 */
	fetchById(id: number): Observable<Item> {
		return this.#http.get<Item>(`${this.#buildUrl()}/${id}`);
	}

	/**
	 * Creates a new item.
	 *
	 * @param data - The item data to create
	 * @returns Observable<Item> Stream containing the created item
	 * @throws HttpErrorResponse if validation fails
	 * @example
	 * const newItem = { name: 'Example', value: 100 };
	 * this.create(newItem).subscribe(item => console.log(item));
	 */
	create(data: CreateItemDto): Observable<Item> {
		return this.#http.post<Item>(this.#buildUrl(), data);
	}

	/**
	 * Updates an existing item.
	 *
	 * @param id number - The unique identifier of the item to update
	 * @param data - Updated item data
	 * @returns Observable<Item> Stream containing the updated item
	 * @throws HttpErrorResponse if item is not found or validation fails
	 * @example
	 * const updates = { name: 'Updated Name' };
	 * this.update(123, updates).subscribe(item => console.log(item));
	 */
	update(id: number, data: Partial<Item>): Observable<Item> {
		return this.#http.put<Item>(`${this.#buildUrl()}/${id}`, data);
	}

	/**
	 * Deletes an item by ID.
	 *
	 * @param id - The unique identifier of the item to delete
	 * @returns Observable<void> Completes when deletion is successful
	 * @throws HttpErrorResponse if item is not found
	 * @example
	 * this.delete(123).subscribe(() => console.log('Deleted'));
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

// Supporting interfaces (move to separate model files if shared)
interface Item {
	id: number;
	name: string;
	value: number;
	createdAt: string;
}

interface CreateItemDto {
	name: string;
	value: number;
}
