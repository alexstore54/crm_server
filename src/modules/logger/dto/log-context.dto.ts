import { IsEnum, IsNumber, IsOptional, IsUrl } from 'class-validator';
import { LogOperationType } from '@/shared/types/logger';

export class LogContext {
  @IsOptional()
  @IsUrl()
  path?: string;

  @IsEnum(LogOperationType)
  operationType: LogOperationType;

  @IsOptional()
  @IsNumber()
  leadId?: number;
}
