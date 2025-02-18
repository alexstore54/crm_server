import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateLead {
  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  firstname?: string;

  @IsOptional()
  @IsString()
  second_name?: string;

  @IsOptional()
  @IsNumber()
  status_id?: number;
}
