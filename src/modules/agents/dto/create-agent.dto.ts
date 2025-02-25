import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { VALIDATION_REGEX } from '@/shared/constants/auth';
import { VALIDATION_ERRORS } from '@/shared/constants/errors';
import { Type } from 'class-transformer';

export class CreateAgent {
  @IsNumber()
  roleId: number;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(VALIDATION_REGEX.PASSWORD, {
    message: VALIDATION_ERRORS.PASSWORD,
  })
  password: string;

  @IsOptional()
  @ValidateIf((o) => o.deskIds !== null)
  @IsArray()
  @Type(() => Number)
  @IsNumber({}, { each: true })
  deskIds?: number[];

  @IsOptional()
  @ValidateIf((o) => o.permissions !== null)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AgentPermissionDto)
  permissions?: AgentPermissionDto[];
}

export class AgentPermissionDto {
  @IsNumber()
  permissionId: number;

  @IsOptional()
  @IsBoolean()
  allowed: boolean;
}
