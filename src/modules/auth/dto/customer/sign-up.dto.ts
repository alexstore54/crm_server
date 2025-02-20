import { IsEmail, IsPhoneNumber, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { VALIDATION_REGEX } from '@/shared/constants/auth';
import { VALIDATION_ERRORS } from '@/shared/constants/errors';

export class SignUpCustomer {
  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(VALIDATION_REGEX.PASSWORD, {
    message: VALIDATION_ERRORS.PASSWORD,
  })
  password: string;

  @IsString()
  @MinLength(4)
  @MaxLength(30)
  country: string;

  @IsString()
  @MaxLength(25)
  @Matches(VALIDATION_REGEX.NAME)
  firstname: string;

  @IsString()
  @MaxLength(25)
  @Matches(VALIDATION_REGEX.NAME)
  lastname: string;
}
