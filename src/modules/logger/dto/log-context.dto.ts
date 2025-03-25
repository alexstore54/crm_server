import { IsEnum, IsNumber, IsOptional, IsString, IsUrl, IsUUID } from 'class-validator';
import { LogOperationType } from '@/shared/types/logger';

export class LogContext {
  @IsOptional()
  @IsUrl()
  path?: string;

  @IsEnum(LogOperationType)
  operationType: LogOperationType;

  @IsOptional()
  @IsString()
  @IsUUID()
  leadPublicId?: string;
}
