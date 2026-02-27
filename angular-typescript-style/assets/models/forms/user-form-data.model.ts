/**
 * UserFormData model definition
 *
 * Type representing the raw data values from UserForm.
 */

export type UserFormData = {
	email: string;
	password: string;
	firstName: string;
	lastName: string;
	age: number;
	acceptTerms: boolean;
};
