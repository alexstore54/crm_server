import { ArgumentsHost, ExceptionFilter, Inject } from '@nestjs/common';
import { FiltersUtil } from '@/shared/utils';
import { AppError } from '@/shared/types/errors';
import { Request, Response } from 'express';
import { APP_LOGGER_SERVICE, AppLoggerService } from '@/common/config/logger';


export class AppExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(APP_LOGGER_SERVICE) private readonly logger: AppLoggerService,
  ) {}


  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = FiltersUtil.getExceptionStatus(exception);

    //#TODO - Implement logger

    const error: AppError = {
      message: FiltersUtil.getExceptionMessage(exception),
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    response.status(status).json(error);
  }
}