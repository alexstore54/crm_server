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
  ValidateIf,
} from 'class-validator';
import { VALIDATION_REGEX } from '@/shared/constants/auth';
import { VALIDATION_ERRORS } from '@/shared/constants/errors';
import { Type } from 'class-transformer';

export class UpdateAgent {
  @IsOptional()
  @IsNumber()
  roleId?: number;

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
  @ValidateIf((o) => o.deskIds !== null)
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  deskIds?: number[];
}
