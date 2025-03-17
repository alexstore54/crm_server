import { IsString, IsNotEmpty, IsOptional, MinLength, MaxLength } from 'class-validator';

export class CreateTeam {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  name: string;

  @IsString()
  @MaxLength(255)
  @IsOptional()
  description?: string;
}