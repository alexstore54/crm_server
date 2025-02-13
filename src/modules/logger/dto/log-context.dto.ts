import { IsOptional, IsUrl } from 'class-validator';

export class LogContext {
  @IsOptional()
  @IsUrl()
  path?: string;
}