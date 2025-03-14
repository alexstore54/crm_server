import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { VALIDATION_REGEX } from '@/shared/constants/auth';
import { VALIDATION_ERRORS } from '@/shared/constants/errors';
import { UseValidation } from '@/common/decorators/validation';

export class SignInCustomer {
  @IsEmail()
  email: string;

  @UseValidation.validatePassword()
  password: string;
}
