import { IsOptional, IsUrl, IsUUID } from 'class-validator';

export class LogContext {
  @IsOptional()
  @IsUUID()
  readonly requestId?: string;

  @IsOptional()
  @IsUrl()
  path?: string;
}