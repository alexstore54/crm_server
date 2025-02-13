import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class AppLoggerService {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
    @Inject('CONTEXT') private readonly context: string,
  ) {
  }

  log(message: string): void {
    console.log(message);
  }

  error(message: string, trace: string): void {
    console.error(message, trace);
  }

  warn(message: string): void {
    console.warn(message);
  }

  debug(message: string): void {
    console.debug(message);
  }

  verbose(message: string): void {
    console.log(message);
  }
}
