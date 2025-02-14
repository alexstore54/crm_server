import { IsEnum, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { LogLevel } from '@prisma/client';
import { Type } from 'class-transformer';
import { LogContext } from '@/modules/logger/dto/log-context.dto';

export class UpdateLog {
  @IsString()
  @IsOptional()
  readonly message?: string;

  @IsOptional()
  @IsEnum(LogLevel)
  readonly level?: LogLevel;

  @IsOptional()
  @IsUUID()
  readonly userId?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LogContext)
  readonly context?: LogContext;
}