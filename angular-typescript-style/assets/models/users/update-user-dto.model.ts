/**
 * UpdateUserDto model definition
 *
 * Data transfer object for updating existing users.
 */

import { CreateUserDto } from './create-user-dto.model';

export interface UpdateUserDto extends Partial<CreateUserDto> {
	id: number;
}
