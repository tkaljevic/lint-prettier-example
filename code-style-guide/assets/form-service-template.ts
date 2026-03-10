import { inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserForm } from './models';

/**
 * Example typed reactive form with proper typing and validation.
 *
 * Use this as a template for creating type-safe forms in Angular.
 */
export class UserFormService {
  // #region Properties

  #formBuilder = inject(FormBuilder);

  // #endregion

  // #region Init

  initForm(): FormGroup<UserForm> {
    return this.#formBuilder.group<UserForm>({
      email: this.#formBuilder.control('', {
        nonNullable: true,
        validators: [Validators.required, Validators.email]
      }),
      password: this.#formBuilder.control('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(8)]
      }),
      firstName: this.#formBuilder.control('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)]
      }),
      lastName: this.#formBuilder.control('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(2)]
      }),
      age: this.#formBuilder.control(0, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(18)]
      }),
      acceptTerms: this.#formBuilder.control(false, {
        nonNullable: true,
        validators: [Validators.requiredTrue]
      })
    });
  }

  // #endregion

  // #region Utility

  isFieldInvalid(form: FormGroup, fieldName: keyof UserForm): boolean {
    const field = form.controls[fieldName];
    return !!(field.invalid && field.touched);
  }

  getFieldError(form: FormGroup, fieldName: keyof UserForm): string {
    const field = form.controls[fieldName];

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

  resetForm(form: FormGroup): void {
    form.reset();
  }

  // #endregion
}
