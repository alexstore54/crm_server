import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { VALIDATION_REGEX } from '@/shared/constants/auth';
import { VALIDATION_ERRORS } from '@/shared/constants/errors';
import { UseValidator } from '@/common/decorators/validation';

export class SignInAgent {
  @IsEmail()
  email: string;

  @UseValidator.validatePassword()
  password: string;
}
