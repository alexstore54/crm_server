import { IsEmail, IsPhoneNumber } from 'class-validator';
import { UserValidation } from '@/common/decorators/validation';

export class SignUpCustomer {
  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;

  @UserValidation.validatePassword()
  password: string;

  @UserValidation.validateName()
  firstname: string;

  @UserValidation.validateName()
  lastname: string;
}
