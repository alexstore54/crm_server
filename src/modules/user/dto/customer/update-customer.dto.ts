import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { VALIDATION_REGEX } from '@/shared/constants/auth';
import { VALIDATION_ERRORS } from '@/shared/constants/errors';
import { UserValidation } from '@/common/decorators/validation';

export class UpdateCustomer {
  @IsOptional()
  @IsNumber()
  lead_id?: number;

  @IsOptional()
  @IsNumber()
  agent_id?: number;

  @IsOptional()
  @IsDate()
  last_time_online?: Date;

  @IsOptional()
  @UserValidation.validatePassword()
  password?: string;
}
