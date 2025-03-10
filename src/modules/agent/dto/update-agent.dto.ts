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
import { ERROR_MESSAGES, VALIDATION_ERRORS } from '@/shared/constants/errors';
import { Type } from 'class-transformer';
import { UseValidator } from '@/common/decorators/validation';

export class UpdateAgent {
  @IsOptional()
  @IsNumber()
  roleId?: number;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @UseValidator.validatePassword()
  password?: string;

  @IsOptional()
  @UseValidator.validateDesksIdArray()
  deskIds?: number[];
}
