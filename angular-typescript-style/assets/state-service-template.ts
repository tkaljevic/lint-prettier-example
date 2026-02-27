import { Injectable, signal } from '@angular/core';

/**
 * State service for managing [entity] state across the application.
 * Provides centralized state management with signals.
 *
 * @example
 * ```ts
 * constructor() {
 *   this.exampleState.items.set([...]);
 *   console.log(this.exampleState.items());
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ExampleStateService {
	// #region State Signals

	items = signal<Item[]>([]);
	selectedItem = signal<Item | null>(null);
	isLoading = signal<boolean>(false);
	error = signal<string | null>(null);

	// #endregion

	// #region State Mutations
	/**
	 * Sets the items list.
	 *
	 * @param items - Array of items to set
	 */
	setItems(items: Item[]): void {
		this.items.set(items);
	}

	/**
	 * Adds a single item to the existing list.
	 *
	 * @param item - Item to add
	 */
	addItem(item: Item): void {
		this.items.update((current) => [...current, item]);
	}

	/**
	 * Updates an existing item in the list.
	 *
	 * @param id - ID of the item to update
	 * @param updates - Partial updates to apply
	 */
	updateItem(id: number, updates: Partial<Item>): void {
		this.items.update((current) =>
			current.map((item) => (item.id === id ? { ...item, ...updates } : item)),
		);
	}

	/**
	 * Removes an item from the list.
	 *
	 * @param id - ID of the item to remove
	 */
	removeItem(id: number): void {
		this.items.update((current) => current.filter((item) => item.id !== id));
	}

	/**
	 * Sets the currently selected item.
	 *
	 * @param item - Item to select, or null to clear selection
	 */
	selectItem(item: Item | null): void {
		this.selectedItem.set(item);
	}

	/**
	 * Sets the loading state.
	 *
	 * @param isLoading - Loading state
	 */
	setLoading(isLoading: boolean): void {
		this.isLoading.set(isLoading);
	}

	/**
	 * Sets an error message.
	 *
	 * @param error - Error message, or null to clear
	 */
	setError(error: string | null): void {
		this.error.set(error);
	}

	/**
	 * Resets all state to initial values.
	 */
	reset(): void {
		this.items.set([]);
		this.selectedItem.set(null);
		this.isLoading.set(false);
		this.error.set(null);
	}

	// #endregion
}

// Supporting interfaces
interface Item {
	id: number;
	name: string;
	value: number;
}
