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
import { UserValidation } from '@/common/decorators/validation';

export class UpdateAgent {
  @IsOptional()
  @IsNumber()
  roleId?: number;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @UserValidation.validatePassword()
  password?: string;

  @IsOptional()
  @UserValidation.validateDesksIdArray()
  deskIds?: number[];
}
