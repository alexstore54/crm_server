import { IsEnum, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { LogContext } from '@/modules/logger/dto/log-context.dto';
import { LogLevel, LogUserType } from '@prisma/client';

export class CreateLog {
  @IsString()
  readonly message: string;

  @IsOptional()
  @IsEnum(LogLevel)
  readonly level?: LogLevel;

  @IsString()
  @IsEnum(LogUserType)
  readonly logUserType?: LogUserType;

  @IsOptional()
  @IsNumber()
  readonly userId?: number;

  @IsOptional()
  @Type(() => LogContext)
  readonly context?: LogContext;
}
