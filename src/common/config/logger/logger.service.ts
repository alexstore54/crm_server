import { Injectable } from '@nestjs/common';

@Injectable()
export class AppLoggerService {
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
