import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateTeam {
  @IsString()
  @MaxLength(30)
  @IsOptional()
  name?: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  description?: string;
}
