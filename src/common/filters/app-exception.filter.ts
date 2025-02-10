import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { FiltersUtil } from '@/shared/utils';
import { AppError } from '@/shared/types/errors';
import { Request, Response } from 'express';


export class AppExceptionFilter implements ExceptionFilter {
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