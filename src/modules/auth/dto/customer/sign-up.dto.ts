import { IsEmail, IsPhoneNumber } from 'class-validator';
import { UseValidator } from '@/common/decorators/validation';

export class SignUpCustomer {
  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;

  @UseValidator.validatePassword()
  password: string;

  @UseValidator.validateName()
  firstname: string;

  @UseValidator.validateName()
  lastname: string;
}
