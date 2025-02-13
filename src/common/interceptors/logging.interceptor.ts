import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { APP_LOGGER_SERVICE } from '@/modules/logger/logger.module';
import { AppLoggerService } from '@/modules/logger/services';

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

    //#TODO implement logger

    return next.handle();
  }
}
