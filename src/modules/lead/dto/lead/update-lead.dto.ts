import { IsNumber, IsOptional, IsString } from 'class-validator';
import { UseValidation } from '@/common/decorators/validation';

export class UpdateLead {
  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @UseValidation.validateName()
  firstname?: string;

  @IsOptional()
  @UseValidation.validateName()
  lastname?: string;

  @IsOptional()
  @IsNumber()
  statusId?: number;
}
