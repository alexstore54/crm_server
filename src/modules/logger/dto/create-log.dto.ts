import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { LogContext } from '@/modules/logger/dto/log-context.dto';
import { LogLevel } from '@prisma/client';

export class CreateLog {
  @IsString()
  readonly message: string;

  @IsOptional()
  @IsEnum(LogLevel)
  readonly level?: LogLevel;
  
  @IsOptional()
  @IsUUID()
  readonly userId?: string;

  @IsOptional()
  @Type(() => LogContext)
  readonly context?: LogContext;
}