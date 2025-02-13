import { ArgumentsHost, ExceptionFilter, Inject } from '@nestjs/common';
import { FiltersUtil } from '@/shared/utils';
import { AppError } from '@/shared/types/errors';
import { Request, Response } from 'express';
import { APP_LOGGER_SERVICE } from '@/modules/logger/logger.module';
import { AppLoggerService } from '@/modules/logger/services';
import { LogLevel } from '@prisma/client';


export class AppExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(APP_LOGGER_SERVICE) private readonly logger: AppLoggerService,
  ) {}


  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = FiltersUtil.getExceptionStatus(exception);
    const message = FiltersUtil.getExceptionMessage(exception);

    this.logger.error(message, {
      message,
      level: LogLevel.ERROR,
      context: {
        path: request.path,
      },
    });

    const error: AppError = {
      message: FiltersUtil.getExceptionMessage(exception),
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(error);
  }
}