import {
  IsArray,
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { VALIDATION_REGEX } from '@/shared/constants/auth';
import { VALIDATION_ERRORS } from '@/shared/constants/errors';

export class UpdateAgent {
  @IsOptional()
  @IsNumber()
  role_id?: number;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(VALIDATION_REGEX.PASSWORD, {
    message: VALIDATION_ERRORS.PASSWORD,
  })
  password?: string;

  @IsOptional()
  @IsDate()
  last_time_online?: Date;

  @IsOptional()
  @IsArray()
  desk_ids?: number[];
}
