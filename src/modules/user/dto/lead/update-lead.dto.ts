import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateLead {
  @IsOptional()
  @IsString()
  country?: string | null;

  @IsOptional()
  @IsString()
  firstname?: string;

  @IsOptional()
  @IsString()
  lastname?: string;

  @IsOptional()
  @IsNumber()
  statusId?: number | null;
}
