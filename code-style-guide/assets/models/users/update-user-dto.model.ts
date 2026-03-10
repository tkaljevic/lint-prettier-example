import { CreateUserDto } from './create-user-dto.model';

export interface UpdateUserDto extends Partial<CreateUserDto> {
  id: number;
}
