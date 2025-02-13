import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { APP_LOGGER_SERVICE } from '@/modules/logger/logger.module';
import { AppLoggerService } from '@/modules/logger/services';
import { CreateLog } from '@/modules/logger/dto';
import { LogLevel } from '@prisma/client';

@Injectable()
export class AppLoggingInterceptor implements NestInterceptor {
  constructor(
    @Inject(APP_LOGGER_SERVICE) private readonly logger: AppLoggerService,
  ) {
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;


    const now = Date.now();
    return next
      .handle()
      .pipe(
        tap(() => {
          const logEntry: CreateLog = {
            message: `Request to ${method} ${url} took ${Date.now() - now}ms`,
            context: { path: url},
            level: LogLevel.INFO,
          };
          this.logger.log(logEntry.message, logEntry);
        }),
      );
  }
}