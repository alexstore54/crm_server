import { IsEmail, IsPhoneNumber } from 'class-validator';
import { UseValidation } from '@/common/decorators/validation';

export class SignUpCustomer {
  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;

  @UseValidation.validatePassword()
  password: string;

  @UseValidation.validateName()
  firstname: string;

  @UseValidation.validateName()
  lastname: string;
}
