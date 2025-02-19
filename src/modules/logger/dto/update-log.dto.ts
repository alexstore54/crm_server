import { IsEnum, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
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
  @IsNumber()
  readonly userId?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => LogContext)
  readonly context?: LogContext;
}