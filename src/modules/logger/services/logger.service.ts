import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { CreateLog } from '@/modules/logger/dto';

@Injectable()
export class AppLoggerService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    @Inject('CONTEXT') private readonly context: string,
  ) {
  }

  log(message: string, data?: CreateLog): void {
    this.logger.info(message, { ...data });
  }

  error(message: string, data?: CreateLog): void {
    this.logger.error(message, { ...data });
  }

  warn(message: string, data?: CreateLog): void {
    this.logger.warn(message, { ...data });
  }
}