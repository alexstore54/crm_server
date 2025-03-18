import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateDesk {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name?: string;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  description?: string;
}