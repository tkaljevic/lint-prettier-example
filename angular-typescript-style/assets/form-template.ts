import { inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserForm, UserFormData } from './models';

/**
 * Example typed reactive form with proper typing and validation.
 *
 * Use this as a template for creating type-safe forms in Angular.
 */

// Example component using the form
export class UserFormExample {
	// #region Dependencies

	#formBuilder = inject(FormBuilder);

	// #endregion

	// #region Class properties

	protected userForm = this.#initForm();

	// #endregion

	// #region Init

	#initForm(): FormGroup<UserForm> {
		return this.#formBuilder.group<UserForm>({
			email: this.#formBuilder.control('', {
				nonNullable: true,
				validators: [Validators.required, Validators.email],
			}),
			password: this.#formBuilder.control('', {
				nonNullable: true,
				validators: [Validators.required, Validators.minLength(8)],
			}),
			firstName: this.#formBuilder.control('', {
				nonNullable: true,
				validators: [Validators.required, Validators.minLength(2)],
			}),
			lastName: this.#formBuilder.control('', {
				nonNullable: true,
				validators: [Validators.required, Validators.minLength(2)],
			}),
			age: this.#formBuilder.control(0, {
				nonNullable: true,
				validators: [Validators.required, Validators.min(18)],
			}),
			acceptTerms: this.#formBuilder.control(false, {
				nonNullable: true,
				validators: [Validators.requiredTrue],
			}),
		});
	}

	#submitForm(data: UserFormData): void {
		// Submit logic here
		console.log('Form submitted:', data);
	}

	// #endregion

	// #region UI Responses

	protected onSubmit(): void {
		if (this.userForm.invalid) {
			this.userForm.markAllAsTouched();
			return;
		}

		const formValue = this.userForm.getRawValue();
		// formValue is fully typed as:
		// {
		//   email: string;
		//   password: string;
		//   firstName: string;
		//   lastName: string;
		//   age: number;
		//   acceptTerms: boolean;
		// }

		this.#submitForm(formValue);
	}

	// #endregion

	// #region Utility

	protected isFieldInvalid(fieldName: keyof UserForm): boolean {
		const field = this.userForm.controls[fieldName];
		return !!(field.invalid && field.touched);
	}

	protected getFieldError(fieldName: keyof UserForm): string {
		const field = this.userForm.controls[fieldName];

		if (field.hasError('required')) {
			return `${fieldName} is required`;
		}

		if (field.hasError('email')) {
			return 'Invalid email address';
		}

		if (field.hasError('minlength')) {
			const minLength = field.getError('minlength').requiredLength;
			return `Minimum length is ${minLength} characters`;
		}

		if (field.hasError('min')) {
			const min = field.getError('min').min;
			return `Minimum value is ${min}`;
		}

		return '';
	}

	protected resetForm(): void {
		this.userForm.reset();
	}

	// #endregion
}

/**
 * Example template for the form
 *
 * ```html
 * <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
 *   <div>
 *     <label for="email">Email</label>
 *     <input
 *       id="email"
 *       type="email"
 *       formControlName="email"
 *       [attr.aria-invalid]="isFieldInvalid('email')"
 *     />
 *     @if (isFieldInvalid('email')) {
 *       <span class="error">{{ getFieldError('email') }}</span>
 *     }
 *   </div>
 *
 *   <div>
 *     <label for="password">Password</label>
 *     <input
 *       id="password"
 *       type="password"
 *       formControlName="password"
 *       [attr.aria-invalid]="isFieldInvalid('password')"
 *     />
 *     @if (isFieldInvalid('password')) {
 *       <span class="error">{{ getFieldError('password') }}</span>
 *     }
 *   </div>
 *
 *   <div>
 *     <label for="firstName">First Name</label>
 *     <input
 *       id="firstName"
 *       type="text"
 *       formControlName="firstName"
 *       [attr.aria-invalid]="isFieldInvalid('firstName')"
 *     />
 *     @if (isFieldInvalid('firstName')) {
 *       <span class="error">{{ getFieldError('firstName') }}</span>
 *     }
 *   </div>
 *
 *   <div>
 *     <label for="lastName">Last Name</label>
 *     <input
 *       id="lastName"
 *       type="text"
 *       formControlName="lastName"
 *       [attr.aria-invalid]="isFieldInvalid('lastName')"
 *     />
 *     @if (isFieldInvalid('lastName')) {
 *       <span class="error">{{ getFieldError('lastName') }}</span>
 *     }
 *   </div>
 *
 *   <div>
 *     <label for="age">Age</label>
 *     <input
 *       id="age"
 *       type="number"
 *       formControlName="age"
 *       [attr.aria-invalid]="isFieldInvalid('age')"
 *     />
 *     @if (isFieldInvalid('age')) {
 *       <span class="error">{{ getFieldError('age') }}</span>
 *     }
 *   </div>
 *
 *   <div>
 *     <label>
 *       <input
 *         type="checkbox"
 *         formControlName="acceptTerms"
 *         [attr.aria-invalid]="isFieldInvalid('acceptTerms')"
 *       />
 *       I accept the terms and conditions
 *     </label>
 *     @if (isFieldInvalid('acceptTerms')) {
 *       <span class="error">{{ getFieldError('acceptTerms') }}</span>
 *     }
 *   </div>
 *
 *   <button type="submit" [disabled]="userForm.invalid">
 *     Submit
 *   </button>
 *   <button type="button" (click)="resetForm()">
 *     Reset
 *   </button>
 * </form>
 * ```
 */
