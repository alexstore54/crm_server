import { IsNumber, IsOptional, IsString } from 'class-validator';
import { UserValidation } from '@/common/decorators/validation';

export class UpdateLead {
  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @UserValidation.validateName()
  firstname?: string;

  @IsOptional()
  @UserValidation.validateName()
  lastname?: string;

  @IsOptional()
  @IsNumber()
  statusId?: number;
}
