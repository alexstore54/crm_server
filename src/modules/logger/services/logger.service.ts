import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CreateLog } from '@/modules/logger/dto';

@Injectable()
export class AppLoggerService {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger) {}

  log(message: string, data?: CreateLog): void {
    const logEntry = {
      message,
      level: data?.level || 'info',
      userId: data?.agentId || null,
      context: data?.context ? JSON.stringify(data.context) : null,
    };

    this.logger.info(logEntry.message, logEntry);
  }

  error(message: string, data?: CreateLog): void {
    const logEntry = {
      message,
      level: data?.level || 'info',
      userId: data?.agentId || null,
      context: data?.context ? JSON.stringify(data.context) : null,
    };

    this.logger.error(message, logEntry);
  }

  warn(message: string, data?: CreateLog): void {
    const logEntry = {
      message,
      level: data?.level || 'info',
      userId: data?.agentId || null,
      context: data?.context ? JSON.stringify(data.context) : null,
    };

    this.logger.warn(message, logEntry);
  }
}
