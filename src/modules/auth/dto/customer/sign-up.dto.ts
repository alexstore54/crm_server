import {
  IsEmail,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
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
  @MaxLength(25)
  @Matches(VALIDATION_REGEX.NAME, { message: VALIDATION_ERRORS.NAME })
  firstname: string;

  @IsString()
  @MaxLength(25)
  @Matches(VALIDATION_REGEX.NAME)
  lastname: string;
}
