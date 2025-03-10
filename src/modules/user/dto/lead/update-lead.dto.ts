import { IsNumber, IsOptional, IsString } from 'class-validator';
import { UseValidator } from '@/common/decorators/validation';

export class UpdateLead {
  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @UseValidator.validateName()
  firstname?: string;

  @IsOptional()
  @UseValidator.validateName()
  lastname?: string;

  @IsOptional()
  @IsNumber()
  statusId?: number;
}
